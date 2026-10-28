<script lang="ts">
  import { app, newId } from '../lib/app.svelte.ts';
  import { calculateDuration, formatTimeoutLine } from '../lib/daily.ts';
  import Icon from './Icon.svelte';

  const EMOJIS = ['⚡', '⏸️', '☕', '🛑', '⏳', '🔌', '⚠️', '🛠️'];
  const PRESETS = [
    { title: 'PowerOutage', start: '13:00', end: '15:00', emoji: '⚡' },
    { title: 'LunchBreak', start: '12:00', end: '13:00', emoji: '☕' },
    { title: 'DoctorAppointment', start: '15:30', end: '16:30', emoji: '⏸️' },
    { title: 'NetworkIssue', start: '10:00', end: '10:45', emoji: '🔌' },
  ];

  let title = $state('');
  let startTime = $state('13:00');
  let endTime = $state('15:00');
  let customDuration = $state('');

  const autoDuration = $derived(calculateDuration(startTime, endTime));
  const activeDuration = $derived(customDuration.trim() || autoDuration);

  function add(e: SubmitEvent) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    app.timeouts = [
      ...app.timeouts,
      { id: newId(), title: cleanTitle, startTime: startTime.trim(), endTime: endTime.trim(), duration: activeDuration },
    ];
    title = '';
    customDuration = '';
  }

  function applyPreset(p: (typeof PRESETS)[number]) {
    title = p.title;
    startTime = p.start;
    endTime = p.end;
    customDuration = '';
    app.timeoutEmoji = p.emoji;
  }
</script>

<section class="card" aria-labelledby="timeouts-heading">
  <div class="card-head">
    <h2 id="timeouts-heading"><Icon name="timer" size={16} /> TimeOuts</h2>
    <span class="badge">{app.timeouts.length}</span>
  </div>

  <div class="field">
    <span class="label" id="emoji-label">Header emoji</span>
    <div class="row" role="group" aria-labelledby="emoji-label">
      {#each EMOJIS as emoji (emoji)}
        <button
          type="button"
          class="emoji"
          class:active={app.timeoutEmoji === emoji}
          aria-pressed={app.timeoutEmoji === emoji}
          onclick={() => (app.timeoutEmoji = emoji)}
          title={`Use ${emoji} for the TimeOuts header`}>{emoji}</button
        >
      {/each}
      <input
        class="input emoji-input"
        type="text"
        maxlength="4"
        bind:value={app.timeoutEmoji}
        placeholder="⚡"
        aria-label="Custom header emoji"
      />
      <span class="preview mono">{app.timeoutEmoji.trim() || '⚡'}TimeOuts:</span>
    </div>
  </div>

  <div class="field">
    <span class="label" id="presets-label">Quick presets</span>
    <div class="row" role="group" aria-labelledby="presets-label">
      {#each PRESETS as p (p.title)}
        <button type="button" class="btn btn-sm" onclick={() => applyPreset(p)}>
          {p.emoji} {p.title} <span class="muted mono">{p.start}–{p.end}</span>
        </button>
      {/each}
    </div>
  </div>

  <form onsubmit={add} class="form">
    <div class="form-grid">
      <div class="field title">
        <label for="to-title">Title / reason</label>
        <input id="to-title" class="input" type="text" bind:value={title} placeholder="e.g. PowerOutage" required />
      </div>
      <div class="field">
        <label for="to-start">Start</label>
        <input id="to-start" class="input mono" type="time" bind:value={startTime} />
      </div>
      <div class="field">
        <label for="to-end">End</label>
        <input id="to-end" class="input mono" type="time" bind:value={endTime} />
      </div>
    </div>
    <div class="row between">
      <div class="row">
        <span class="label">Duration</span>
        <span class="badge mono">{activeDuration || '0 mins'}</span>
        <input
          class="input override"
          type="text"
          bind:value={customDuration}
          placeholder="Override duration…"
          aria-label="Override duration"
          title="Leave empty to use the calculated duration"
        />
      </div>
      <button class="btn btn-primary" type="submit" disabled={!title.trim()}>
        <Icon name="plus" /> Add TimeOut
      </button>
    </div>
  </form>

  <div class="row between">
    <span class="label">Active TimeOuts ({app.timeouts.length})</span>
    {#if app.timeouts.length > 0}
      <button class="btn btn-sm btn-danger" type="button" onclick={() => (app.timeouts = [])}>
        <Icon name="trash" size={14} /> Clear all
      </button>
    {/if}
  </div>

  {#if app.timeouts.length === 0}
    <p class="empty">No TimeOuts yet. Add an outage or break above to include it in the daily text.</p>
  {:else}
    <ul class="list">
      {#each app.timeouts as item (item.id)}
        <li>
          <span class="mono line">{formatTimeoutLine(item).trimStart()}</span>
          <button
            class="btn btn-sm btn-icon btn-danger"
            type="button"
            aria-label={`Remove ${item.title}`}
            onclick={() => (app.timeouts = app.timeouts.filter((t) => t.id !== item.id))}
          >
            <Icon name="trash" size={14} />
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .muted {
    color: var(--muted);
    font-size: 0.75rem;
  }
  .between {
    justify-content: space-between;
  }
  .emoji {
    width: 2.1rem;
    height: 2.1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    cursor: pointer;
  }
  .emoji.active {
    background: var(--accent-soft);
    border-color: var(--accent);
  }
  .emoji-input {
    width: 4.5rem;
    text-align: center;
  }
  .preview {
    color: var(--muted);
    font-size: 0.8rem;
  }
  .form {
    display: grid;
    gap: 0.75rem;
    padding: 0.9rem;
    background: var(--surface-2);
    border-radius: 10px;
  }
  .form-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 0.75rem;
  }
  .override {
    width: 11rem;
    min-height: 2rem;
  }
  .empty {
    margin: 0;
    padding: 0.9rem;
    text-align: center;
    color: var(--muted);
    border: 1px dashed var(--border);
    border-radius: 10px;
    font-size: 0.9rem;
  }
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.4rem;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.4rem 0.4rem 0.4rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .line {
    font-size: 0.85rem;
    overflow-wrap: anywhere;
  }
  @media (max-width: 36rem) {
    .form-grid {
      grid-template-columns: 1fr 1fr;
    }
    .title {
      grid-column: 1 / -1;
    }
  }
</style>
