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
  <div class="flex items-center justify-between gap-2">
    <h2 id="timeouts-heading" class="card-title"><Icon name="timer" /> TimeOuts</h2>
    <span class="chip">{app.timeouts.length}</span>
  </div>

  <div class="grid gap-2">
    <span class="label" id="emoji-label">Header emoji</span>
    <div class="flex flex-wrap items-center gap-2" role="group" aria-labelledby="emoji-label">
      {#each EMOJIS as emoji (emoji)}
        <button
          type="button"
          class="size-9 cursor-pointer rounded-lg border text-base transition-colors {app.timeoutEmoji === emoji
            ? 'border-brand bg-brand-soft'
            : 'border-line bg-surface hover:bg-surface-2'}"
          aria-pressed={app.timeoutEmoji === emoji}
          onclick={() => (app.timeoutEmoji = emoji)}
          title={`Use ${emoji} for the TimeOuts header`}>{emoji}</button
        >
      {/each}
      <input class="input w-16 text-center" type="text" maxlength="4" bind:value={app.timeoutEmoji} placeholder="⚡" aria-label="Custom header emoji" />
      <span class="font-mono text-xs text-muted">{app.timeoutEmoji.trim() || '⚡'}TimeOuts:</span>
    </div>
  </div>

  <div class="grid gap-2">
    <span class="label" id="presets-label">Quick presets</span>
    <div class="flex flex-wrap gap-2" role="group" aria-labelledby="presets-label">
      {#each PRESETS as p (p.title)}
        <button type="button" class="btn btn-sm" onclick={() => applyPreset(p)}>
          {p.emoji} {p.title} <span class="font-mono text-muted">{p.start}–{p.end}</span>
        </button>
      {/each}
    </div>
  </div>

  <form onsubmit={add} class="grid gap-3 rounded-xl bg-surface-2 p-3 sm:p-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2 grid gap-1.5">
        <label class="label" for="to-title">Title / reason</label>
        <input id="to-title" class="input" type="text" bind:value={title} placeholder="e.g. PowerOutage" required />
      </div>
      <div class="grid gap-1.5">
        <label class="label" for="to-start">Start</label>
        <input id="to-start" class="input font-mono" type="time" bind:value={startTime} />
      </div>
      <div class="grid gap-1.5">
        <label class="label" for="to-end">End</label>
        <input id="to-end" class="input font-mono" type="time" bind:value={endTime} />
      </div>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <span class="chip font-mono">{activeDuration || '0 mins'}</span>
        <input
          class="input min-h-8 max-w-52 flex-1 py-1 text-xs"
          type="text"
          bind:value={customDuration}
          placeholder="Override duration…"
          aria-label="Override duration"
          title="Leave empty to use the calculated duration"
        />
      </div>
      <button class="btn btn-primary w-full sm:w-auto" type="submit" disabled={!title.trim()}>
        <Icon name="plus" /> Add TimeOut
      </button>
    </div>
  </form>

  <div class="flex items-center justify-between gap-2">
    <span class="label">Active ({app.timeouts.length})</span>
    {#if app.timeouts.length > 0}
      <button class="btn btn-sm btn-danger" type="button" onclick={() => (app.timeouts = [])}>
        <Icon name="trash" size={14} /> Clear all
      </button>
    {/if}
  </div>

  {#if app.timeouts.length === 0}
    <p class="rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
      No TimeOuts yet. Add an outage or break above to include it in the daily text.
    </p>
  {:else}
    <ul class="grid gap-2">
      {#each app.timeouts as item (item.id)}
        <li class="flex items-center justify-between gap-2 rounded-xl border border-line py-1.5 pr-1.5 pl-3">
          <span class="font-mono text-sm break-words">{formatTimeoutLine(item).trimStart()}</span>
          <button
            class="btn btn-sm btn-icon btn-danger shrink-0"
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
