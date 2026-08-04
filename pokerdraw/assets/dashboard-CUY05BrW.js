import"./modulepreload-polyfill-B5Qt9EMX.js";const t=document.querySelector("#dashboard-app");if(t===null)throw new Error("Missing #dashboard-app");const r=[{id:"architecture",eyebrow:"SYSTEM EXPLAINER",title:"Architecture explorer",description:"Trace the project at experience, app-system and exact code/technology depth across product, testing, deployment and live-ops flows.",href:"./architecture.html",action:"Explore architecture",tone:"purple"},{id:"ux-simulator",eyebrow:"PLAYER JOURNEY",title:"UX session simulator",description:"Play, pause, rewind and inspect five modeled poker-session paths with a phone view, feature states, research evidence and timestamped logs.",href:"./ux-map.html",action:"Open UX simulator",tone:"blue"}],o=[{id:"draw",title:"Poker Draw",type:"Arcade game",description:"Timed Hold'em hand-recognition run using Canvas 2D, GSAP, DOM UI and Web Audio.",href:"./poker-draw.html",status:"Local browser"},{id:"practice",title:"Practice Hold'em",type:"Offline simulation",description:"Full local cash-game loop with bots, practice economy, persistence and debug controls.",href:"./holdem.html",status:"2–6 seats"},{id:"online",title:"Online Hold'em",type:"Multiplayer client",description:"Firebase identity and table discovery with a Cloud Run WebSocket room authority.",href:"./online-holdem.html",status:"Server authority"}],i=[{id:"testing",number:"01",title:"Testing",summary:"Unit rules → emulators → browser journeys → screenshots/state → production build",href:"./architecture.html?flow=testing&depth=player"},{id:"deployment",number:"02",title:"Deployment",summary:"Vite → Firebase Hosting and Docker → Cloud Run → live authenticated smoke test",href:"./architecture.html?flow=deployment&depth=player"},{id:"liveops",number:"03",title:"Live operations",summary:"Directory, presence, economy, logs and the planned cleanup, protection and support layers",href:"./architecture.html?flow=liveops&depth=player"}],s=[{id:"surface",label:"Browser surfaces",detail:"Six HTML entries with focused TypeScript composition roots",examples:"Dashboard · Games · UX · Architecture"},{id:"domain",label:"Shared domain",detail:"UI-independent cards, evaluation, Hold'em rules and bot policies",examples:"src/poker · src/holdem/domain · bots/config"},{id:"adapters",label:"Mode adapters",detail:"Local persistence/economy or Firebase identity/directory/WebSocket",examples:"localStorage · Firebase SDK · WSS contracts"},{id:"authority",label:"Cloud authority",detail:"Node room service owns online rules, timers, bots and chip settlement",examples:"Cloud Run · Firestore · Firebase Auth"}];t.innerHTML=`
  <div class="dashboard-shell">
    <header class="dashboard-topbar">
      <a class="dashboard-brand" href="./dashboard.html">
        <span>POKER PROJECT</span>
        <strong>Working Dashboard</strong>
      </a>
      <nav aria-label="Project surfaces">
        <a href="#tools">System tools</a>
        <a href="#playables">Playable builds</a>
        <a href="#structure">Structure</a>
        <a href="#operations">Operations</a>
      </nav>
      <span class="dashboard-build-state"><i></i>Project index</span>
    </header>

    <main>
      <section class="dashboard-hero">
        <div>
          <span class="dashboard-eyebrow">END-TO-END PROJECT MAP</span>
          <h1>Understand it, simulate it, play it, ship it.</h1>
          <p>This repository contains multiple browser products around one poker domain: an arcade game, a full offline Hold'em simulation, a server-authoritative multiplayer client and two system-analysis dashboards.</p>
          <div class="dashboard-hero-actions">
            <a class="dashboard-primary-button" href="./architecture.html">Start with architecture</a>
            <a href="./ux-map.html">Run the player flow</a>
          </div>
        </div>
        <div class="dashboard-system-summary" aria-label="Project summary">
          <div><span>06</span><small>browser entry points</small></div>
          <div><span>03</span><small>runtime modes</small></div>
          <div><span>05</span><small>mapped system flows</small></div>
          <div><span>01</span><small>online authority</small></div>
        </div>
      </section>

      <section class="dashboard-section" id="tools">
        <div class="dashboard-section-heading">
          <div><span class="dashboard-eyebrow">ANALYZE</span><h2>System dashboards</h2></div>
          <p>These tools explain the same app from different perspectives.</p>
        </div>
        <div class="dashboard-tool-grid">
          ${r.map(e=>`
            <article class="dashboard-tool-card" data-tone="${e.tone}">
              <span class="dashboard-eyebrow">${e.eyebrow}</span>
              <h3>${e.title}</h3>
              <p>${e.description}</p>
              <a href="${e.href}">${e.action}<span aria-hidden="true">→</span></a>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="dashboard-section" id="playables">
        <div class="dashboard-section-heading">
          <div><span class="dashboard-eyebrow">RUN</span><h2>Playable builds</h2></div>
          <p>Each page is an independent Vite entry with a specific runtime boundary.</p>
        </div>
        <div class="dashboard-playable-grid">
          ${o.map((e,a)=>`
            <a class="dashboard-playable-card" href="${e.href}">
              <span class="dashboard-playable-index">0${a+1}</span>
              <div><small>${e.type}</small><h3>${e.title}</h3><p>${e.description}</p></div>
              <span class="dashboard-status">${e.status}</span>
            </a>
          `).join("")}
        </div>
      </section>

      <section class="dashboard-section" id="structure">
        <div class="dashboard-section-heading">
          <div><span class="dashboard-eyebrow">ARCHITECTURE</span><h2>How the repository is layered</h2></div>
          <p>Dependencies point inward toward deterministic rules. Authority and storage stay behind adapters.</p>
        </div>
        <div class="dashboard-structure-flow" role="img" aria-label="Browser surfaces connect to the shared domain, then mode adapters, then the cloud authority for online play.">
          ${s.map((e,a)=>`
            <article>
              <span>${String(a+1).padStart(2,"0")}</span>
              <h3>${e.label}</h3>
              <p>${e.detail}</p>
              <code>${e.examples}</code>
            </article>
            ${a<s.length-1?'<i aria-hidden="true">→</i>':""}
          `).join("")}
        </div>
      </section>

      <section class="dashboard-docker-section" aria-labelledby="docker-title">
        <div class="dashboard-docker-heading">
          <span class="dashboard-docker-mark">D</span>
          <div><span class="dashboard-eyebrow">SERVER PACKAGING</span><h2 id="docker-title">What Docker does here</h2></div>
        </div>
        <div class="dashboard-docker-grid">
          <article>
            <h3>Its purpose</h3>
            <p>Docker turns the Node WebSocket authority and its exact production dependencies into one reproducible Linux image. Cloud Run can start the same artifact in a controlled environment.</p>
          </article>
          <article>
            <h3>The two stages</h3>
            <p>The build stage installs all server packages and compiles TypeScript. The runtime stage keeps only production packages and compiled files, runs as the non-root <code>node</code> user and listens on port 8080.</p>
          </article>
          <article>
            <h3>What it does not do</h3>
            <p>Docker does not serve the Vite browser UI, create multiplayer rules or store durable rooms. Firebase Hosting serves static client files. RoomAuthority contains the rules. Firestore stores durable state.</p>
          </article>
        </div>
        <a href="./architecture.html?flow=deployment&depth=code&node=deploy-code-docker">Inspect the Docker deployment path →</a>
      </section>

      <section class="dashboard-section" id="operations">
        <div class="dashboard-section-heading">
          <div><span class="dashboard-eyebrow">OPERATE</span><h2>Quality, release and live-ops flows</h2></div>
          <p>Operational paths use the same three-depth explorer as player-facing architecture.</p>
        </div>
        <div class="dashboard-operations-list">
          ${i.map(e=>`
            <a href="${e.href}">
              <span>${e.number}</span>
              <strong>${e.title}</strong>
              <p>${e.summary}</p>
              <i aria-hidden="true">→</i>
            </a>
          `).join("")}
        </div>
      </section>
    </main>

    <footer class="dashboard-footer">
      <span>Poker Draw repository · TypeScript + Vite</span>
      <div><a href="./architecture.html?flow=surfaces&depth=code">Code map</a><a href="./architecture.html?flow=deployment&depth=app">Deployment map</a><a href="./ux-map.html">UX model</a></div>
    </footer>
  </div>
`;const d={mode:"project-dashboard",coordinateSystem:"DOM document flow; sections run top-to-bottom and card grids run left-to-right.",systemTools:r.map(e=>({id:e.id,href:e.href})),playableSurfaces:o.map(e=>({id:e.id,href:e.href,status:e.status})),structureLayers:s.map(e=>e.id),operationFlows:i.map(e=>({id:e.id,href:e.href})),docker:{packages:"Node WebSocket room authority",runtime:"Google Cloud Run",excludes:["Vite browser UI","Firebase Hosting","Firestore durable storage"]}};window.render_game_to_text=()=>JSON.stringify(d);window.advanceTime=()=>{};
