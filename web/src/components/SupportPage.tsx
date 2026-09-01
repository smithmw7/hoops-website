import { useMemo, useState, type FormEvent } from 'react';
import { games } from '../data/games';
import { Layout } from './Layout';

const SUPPORT_ENDPOINT = 'https://us-central1-aces-hightop-aces.cloudfunctions.net/submitSupportRequest';

export function SupportPage() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const requestedGame = params.get('game') || games[0].name;
  const uid = (params.get('uid') || '').trim();
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string }>();
  const [submitting, setSubmitting] = useState(false);

  async function submitSupport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setSubmitting(true);
    setStatus(undefined);
    const values = new FormData(form);
    const payload = {
      game: values.get('game'),
      email: String(values.get('email') || '').trim(),
      requestType: values.get('request-type'),
      subject: String(values.get('subject') || '').trim(),
      message: String(values.get('message') || '').trim(),
      uid,
      pageUrl: window.location.href,
      company: String(values.get('company') || '').trim(),
    };

    try {
      const response = await fetch(SUPPORT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok || !result.ticketId) throw new Error('request_failed');
      setStatus({ type: 'success', message: `Thanks — your ticket is ${result.ticketId}. We’ll follow up at ${payload.email}.` });
      form.reset();
    } catch {
      setStatus({ type: 'error', message: 'We couldn’t send that request. Please try again or email marshall@hightopgames.com.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout tone="light">
      <section className="support-page section-pad">
        <div className="site-shell support-grid">
          <div className="support-intro">
            <p className="eyebrow">Player support</p>
            <h1>Tell us what’s up.</h1>
            <p>Found a bug? Have a question? Made something brilliant happen? Send it our way.</p>
            <div className="support-direct">
              <a href="mailto:marshall@hightopgames.com">marshall@hightopgames.com</a>
            </div>
          </div>

          <form className="support-form" id="support-form" onSubmit={submitSupport}>
            <div className="field-row">
              <label>
                <span>Game</span>
                <select name="game" required defaultValue={requestedGame}>
                  {games.map((game) => <option key={game.slug} value={game.name}>{game.name}</option>)}
                  <option value="Skate Burger">Skate Burger</option>
                  <option value="Poker Draw">Poker Draw</option>
                  <option value="Other Hightop Games title">Other title</option>
                </select>
              </label>
              <label>
                <span>Request type</span>
                <select name="request-type" required>
                  <option value="Bug report">Bug report</option>
                  <option value="Gameplay help">Gameplay help</option>
                  <option value="Account or purchase question">Account or purchase</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
            <label><span>Your email</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            <label><span>Subject</span><input name="subject" type="text" maxLength={120} placeholder="How can we help?" required /></label>
            <label>
              <span>Details</span>
              <textarea name="message" maxLength={4000} placeholder="What happened? Include your device and any steps that help us reproduce it." required />
              <small>Please don’t include passwords, payment details, or other sensitive information.</small>
            </label>
            {uid && <label><span>User ID</span><input name="uid" type="text" value={uid} readOnly /></label>}
            <label className="honeypot" aria-hidden="true">Company<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
            <div className="form-submit">
              <button className="button button-dark" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send request'}<span aria-hidden="true">↗</span></button>
              {status && <p className={`status-message ${status.type}`} role="status">{status.message}</p>}
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
