(() => {
  const storageKey = 'color-stack-profile';
  const defaultAvatar = 'avatars/default-profile.svg';
  window.createProfileController = ({feedback, summary, canOpen, onOpen, onClose}) => {
    const dialog = document.querySelector('#profile');
    const openers = [...document.querySelectorAll('.profile-open')];
    let opener = openers[0];
    const status = document.querySelector('#profileStatus');
    const choices = document.querySelector('#profileChoices');
    const editor = document.querySelector('#profileEditor');
    const canvas = document.querySelector('#profileCrop');
    const zoom = document.querySelector('#profileZoom');
    const motion = window.ScreenMotion;
    let value = {kind:'default'};
    let busy = false, version = 0, crop = null, drag = null;
    const inputRequests = new WeakMap();
    const available = () => dialog.open && !dialog.dataset.closing;
    const storedProfile = localStorage.getItem(storageKey);
    if (storedProfile !== null) {
      const saved = JSON.parse(storedProfile);
      if (saved?.kind === 'photo' && typeof saved.data === 'string' && saved.data.length < 1000000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(saved.data)) value = {kind:'photo', data:saved.data};
      else if (saved?.kind !== 'default') throw new Error('Invalid color-stack-profile record.');
    }

    function render() {
      const isPhoto = value.kind === 'photo';
      document.querySelectorAll('[data-player-avatar]').forEach(img => {
        img.src = isPhoto ? value.data : defaultAvatar;
        if (img.classList.contains('profile-portrait')) img.alt = isPhoto ? 'Your profile photo' : 'Default profile image';
      });
      document.querySelector('#profileAvatarName').textContent = isPhoto ? 'Your photo' : 'Your profile';
    }
    function setBusy(next) {
      busy = next;
      dialog.setAttribute('aria-busy', String(next));
      dialog.querySelectorAll('[data-photo-source]').forEach(button => {button.disabled = next;});
    }
    function save(next) {
      localStorage.setItem(storageKey, JSON.stringify(next));
      version++;
      value = next;
      render();
      status.textContent = 'Profile saved';
      feedback('confirm');
    }
    function profileItems() {
      return [...dialog.querySelector('.profile-header').children, ...motion.visible(dialog.querySelector('.profile-scroll'), '.profile-hero, .profile-stats, .profile-perfect-stat, .profile-photo-actions > button, .profile-local-note, #profileEditorTitle, .profile-editor > p, #profileCrop, .profile-zoom')];
    }
    function revealChoices() {
      motion.enter(choices, motion.visible(dialog.querySelector('.profile-scroll'), '#profileChoices .profile-action, .profile-local-note'));
    }
    function discardCrop() {
      motion.stop(editor); motion.stop(choices);
      if (drag) {try {canvas.releasePointerCapture(drag.id);} catch { /* Capture may already be released. */ }}
      crop = null; drag = null; editor.hidden = true; choices.hidden = false;
    }
    function open(event) {
      if (dialog.open || !canOpen()) return;
      opener = event?.currentTarget || openers[0];
      version++; dialog.inert = false; status.textContent = ''; discardCrop(); setBusy(false);
      const stats = summary();
      document.querySelector('#profileCompleted').textContent = stats.completed;
      document.querySelector('#profileStars').textContent = stats.stars;
      document.querySelector('#profileTries').textContent = stats.tries;
      document.querySelector('#profileFirstTryPerfect').textContent = stats.firstTryThreeStarWins;
      onOpen(); dialog.showModal(); document.querySelector('.profile-scroll').scrollTop = 0;
      opener.setAttribute('aria-expanded', 'true');
      motion.enter(dialog, profileItems());
      document.querySelector('#profileClose').focus({preventScroll:true}); feedback('click-primary');
    }
    function close() {
      if (!dialog.open || dialog.dataset.closing) return;
      dialog.dataset.closing = 'true'; dialog.inert = true; version++; setBusy(false);
      if (drag) {try {canvas.releasePointerCapture(drag.id);} catch { /* Capture can already be released. */ } drag = null;}
      motion.stop(editor); motion.stop(choices);
      motion.exit(dialog, profileItems(), {onComplete:() => {
        dialog.close(); discardCrop(); delete dialog.dataset.closing; opener.setAttribute('aria-expanded', 'false'); onClose(); opener.focus({preventScroll:true});
      }});
      feedback('click-back');
    }
    openers.forEach(button => button.addEventListener('click', open));
    document.querySelector('#profileClose').addEventListener('click', close);
    dialog.addEventListener('cancel', event => {event.preventDefault(); crop ? cancelCrop() : close();});

    function drawCrop() {
      if (!crop) return;
      const {image} = crop, side = Math.min(image.naturalWidth, image.naturalHeight) / crop.zoom;
      crop.x = Math.max(side / 2, Math.min(image.naturalWidth - side / 2, crop.x));
      crop.y = Math.max(side / 2, Math.min(image.naturalHeight - side / 2, crop.y));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1b1e24'; ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(image, crop.x - side / 2, crop.y - side / 2, side, side, 0, 0, 512, 512);
    }
    async function loadPhoto(src, request) {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve; image.onerror = () => reject(new Error('photo-decode'));
        image.src = src;
      });
      if (request !== version || !dialog.open) return;
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('photo-decode');
      crop = {image, zoom:1, x:image.naturalWidth / 2, y:image.naturalHeight / 2};
      zoom.value = '1'; choices.hidden = true; editor.hidden = false; status.textContent = '';
      motion.stop(dialog); motion.stop(choices);
      gsap.set(dialog, {opacity:1});
      drawCrop(); editor.scrollIntoView({block:'start', behavior:'instant'});
      motion.enter(editor, [...editor.children].filter(node => !node.hidden));
      document.querySelector('#profileUsePhoto').focus({preventScroll:true});
    }
    function reportError(error) {
      const code = String(error?.code || '');
      if (['OS-PLUG-CAMR-0006','OS-PLUG-CAMR-0020','OS-PLUG-CAMR-0013'].includes(code) || /cancel|no (?:photo|file|image).*select/i.test(error?.message || '')) {status.textContent = ''; return;}
      if (code === 'OS-PLUG-CAMR-0003') status.textContent = 'Camera access is off. Allow it for Color Rise in Settings, or upload a photo.';
      else if (code === 'OS-PLUG-CAMR-0005') status.textContent = 'Photo access is off. Allow it for Color Rise in Settings, or take a photo with the camera.';
      else if (code === 'OS-PLUG-CAMR-0007') status.textContent = 'No camera is available. Upload a photo instead.';
      else if (error?.message === 'photo-too-large') status.textContent = 'Choose a photo smaller than 30 MB.';
      else status.textContent = 'That photo couldn’t be opened. Try another photo.';
      feedback('error');
    }
    async function nativePhoto(source) {
      const request = ++version; setBusy(true); status.textContent = source === 'camera' ? 'Opening camera…' : 'Opening photos…';
      try {
        const {Camera, CameraDirection, MediaTypeSelection} = window.capacitorCamera;
        const config = {quality:90, targetWidth:1024, targetHeight:1024, correctOrientation:true, editable:'no', presentationStyle:'fullscreen'};
        const photo = source === 'camera'
          ? await Camera.takePhoto({...config, cameraDirection:CameraDirection.Front, saveToGallery:false})
          : (await Camera.chooseFromGallery({...config, mediaType:MediaTypeSelection.Photo, allowMultipleSelection:false})).results?.[0];
        if (request !== version || !dialog.open) return;
        if (photo?.webPath) await loadPhoto(photo.webPath, request);
        else status.textContent = '';
      } catch (error) {if (request === version && dialog.open) reportError(error);}
      finally {if (request === version) setBusy(false);}
    }
    async function filePhoto(input) {
      const request = inputRequests.get(input); inputRequests.delete(input);
      const file = input.files?.[0]; input.value = '';
      if (!file || !available() || request !== version) return;
      setBusy(true); status.textContent = 'Opening photo…';
      let url;
      try {
        if (file.size > 30 * 1024 * 1024) throw new Error('photo-too-large');
        url = URL.createObjectURL(file); await loadPhoto(url, request);
      } catch (error) {if (request === version && dialog.open) reportError(error);}
      finally {if (url) URL.revokeObjectURL(url); if (request === version) setBusy(false);}
    }
    document.querySelectorAll('[data-photo-source]').forEach(button => button.addEventListener('click', () => {
      if (busy || !available()) return;
      feedback('tap');
      const source = button.dataset.photoSource;
      if (window.Capacitor?.isNativePlatform()) {nativePhoto(source); return;}
      // A browser opens its own camera/file picker only inside this explicit user gesture.
      const input = document.querySelector(source === 'camera' ? '#profileCameraInput' : '#profileFileInput');
      inputRequests.set(input, ++version);
      input.value = ''; input.click();
    }));
    document.querySelectorAll('.profile-file-input').forEach(input => {
      input.addEventListener('change', () => filePhoto(input));
      input.addEventListener('cancel', () => inputRequests.delete(input));
    });
    canvas.addEventListener('pointerdown', event => {
      if (!crop || !available() || drag || event.button !== 0 || event.isPrimary === false) return;
      try {canvas.setPointerCapture(event.pointerId);} catch {return;}
      drag = {id:event.pointerId, x:event.clientX, y:event.clientY}; feedback('grab');
    });
    canvas.addEventListener('pointermove', event => {
      if (!crop || drag?.id !== event.pointerId) return;
      const ratio = Math.min(crop.image.naturalWidth, crop.image.naturalHeight) / crop.zoom / canvas.getBoundingClientRect().width;
      crop.x -= (event.clientX - drag.x) * ratio; crop.y -= (event.clientY - drag.y) * ratio;
      drag.x = event.clientX; drag.y = event.clientY; drawCrop();
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => canvas.addEventListener(type, event => {if (drag?.id === event.pointerId) drag = null;}));
    zoom.addEventListener('input', () => {if (crop) {crop.zoom = Number(zoom.value); drawCrop();}});
    zoom.addEventListener('change', () => feedback('tick'));
    function cancelCrop() {if (!available()) return; discardCrop(); revealChoices(); status.textContent = ''; feedback('panel-close'); document.querySelector('[data-photo-source="photos"]').focus({preventScroll:true});}
    document.querySelector('#profileCancelPhoto').addEventListener('click', cancelCrop);
    document.querySelector('#profileUsePhoto').addEventListener('click', () => {
      if (!crop || !available()) return;
      try {drawCrop(); const data = canvas.toDataURL('image/jpeg', .86); discardCrop(); save({kind:'photo', data}); document.querySelector('.profile-scroll').scrollTop = 0; revealChoices();}
      catch (error) {reportError(error);}
    });
    document.querySelectorAll('[data-player-avatar]').forEach(img => img.addEventListener('error', () => {
      if (value.kind !== 'photo') return;
      status.textContent = 'The saved profile photo could not be displayed.';
      feedback('error');
    }));
    render();
    return {state:() => ({open:dialog.open, kind:value.kind, preset:null, busy, editing:!!crop, persisted:true, choices:0})};
  };
})();
