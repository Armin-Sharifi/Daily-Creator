<script lang="ts">
  import { app } from '../lib/app.svelte.ts';
  import Icon from './Icon.svelte';

  const SAMPLE_TASKS = [
    'Refactor API client to handle offline caching',
    'Review Pull Request #42 for PWA manifest configuration',
    'Optimize database queries for team daily standup summary',
    'Sync with design team on dark mode tokens',
  ];

  let pasteFailed = $state(false);

  async function paste() {
    pasteFailed = false;
    try {
      const text = await navigator.clipboard.readText();
      if (text) app.tasksRaw = app.tasksRaw ? `${app.tasksRaw}\n${text}` : text;
    } catch {
      pasteFailed = true;
    }
  }

  function sortAlphabetically() {
    app.tasksRaw = app.tasksRaw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join('\n');
  }
</script>

<section class="card" aria-labelledby="tasks-heading">
  <div class="flex items-center justify-between gap-2">
    <h2 id="tasks-heading" class="card-title">
      <Icon name="sort" />
      <label for="tasks-input" class="cursor-pointer">Tasks <span class="font-normal text-muted">· one per line</span></label>
    </h2>
    <span class="chip">{app.taskCount} {app.taskCount === 1 ? 'task' : 'tasks'}</span>
  </div>

  <div class="flex flex-wrap gap-2">
    <button class="btn btn-sm" type="button" onclick={() => (app.tasksRaw = SAMPLE_TASKS.join('\n'))}>
      <Icon name="sparkles" size={14} /> Sample
    </button>
    <button class="btn btn-sm" type="button" onclick={paste}><Icon name="paste" size={14} /> Paste</button>
    {#if app.taskCount > 1}
      <button class="btn btn-sm" type="button" onclick={sortAlphabetically}><Icon name="sort" size={14} /> Sort A–Z</button>
    {/if}
    {#if app.tasksRaw.length > 0}
      <button class="btn btn-sm btn-danger" type="button" onclick={() => (app.tasksRaw = '')}>
        <Icon name="trash" size={14} /> Clear
      </button>
    {/if}
  </div>
  {#if pasteFailed}
    <p class="text-sm text-danger" role="alert">Couldn't read the clipboard. Allow clipboard access or paste with Ctrl/⌘+V.</p>
  {/if}

  <textarea
    id="tasks-input"
    class="input min-h-44 resize-y leading-relaxed"
    rows="8"
    bind:value={app.tasksRaw}
    placeholder={'Enter tasks, one per line\nMorning stand-up meeting\nDraft project proposal'}
  ></textarea>

  <details class="group rounded-xl bg-surface-2 px-3 py-2.5">
    <summary class="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
      <Icon name="timer" size={14} /> Start / end time
      <span class="chip ml-auto font-mono">
        {app.startTime === '-' && app.endTime === '-' ? 'default: -' : `${app.startTime} → ${app.endTime}`}
      </span>
    </summary>
    <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="grid gap-1.5">
        <label class="label" for="start-time">Start time</label>
        <input id="start-time" class="input font-mono" type="text" bind:value={app.startTime} placeholder="-" />
      </div>
      <div class="grid gap-1.5">
        <label class="label" for="end-time">End time</label>
        <input id="end-time" class="input font-mono" type="text" bind:value={app.endTime} placeholder="-" />
      </div>
    </div>
  </details>
</section>
