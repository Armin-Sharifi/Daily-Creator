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
  <div class="card-head">
    <h2 id="tasks-heading">
      <label for="tasks-input">Tasks <span class="hint">(one per line)</span></label>
    </h2>
    <span class="badge">{app.taskCount} {app.taskCount === 1 ? 'task' : 'tasks'}</span>
  </div>

  <div class="row">
    <button class="btn btn-sm" type="button" onclick={() => (app.tasksRaw = SAMPLE_TASKS.join('\n'))}>
      <Icon name="sparkles" size={14} /> Sample
    </button>
    <button class="btn btn-sm" type="button" onclick={paste}>
      <Icon name="paste" size={14} /> Paste
    </button>
    {#if app.taskCount > 1}
      <button class="btn btn-sm" type="button" onclick={sortAlphabetically}>
        <Icon name="sort" size={14} /> Sort A–Z
      </button>
    {/if}
    {#if app.tasksRaw.length > 0}
      <button class="btn btn-sm btn-danger" type="button" onclick={() => (app.tasksRaw = '')}>
        <Icon name="trash" size={14} /> Clear
      </button>
    {/if}
  </div>
  {#if pasteFailed}
    <p class="error" role="alert">Couldn't read the clipboard. Allow clipboard access or paste with Ctrl/⌘+V.</p>
  {/if}

  <textarea
    id="tasks-input"
    class="input"
    rows="8"
    bind:value={app.tasksRaw}
    placeholder={'Enter tasks, one per line\nMorning stand-up meeting\nDraft project proposal'}
  ></textarea>

  <details>
    <summary>
      Start / end time
      <span class="badge mono">
        {app.startTime === '-' && app.endTime === '-' ? 'default: -' : `${app.startTime} → ${app.endTime}`}
      </span>
    </summary>
    <div class="times">
      <div class="field">
        <label for="start-time">Start time</label>
        <input id="start-time" class="input mono" type="text" bind:value={app.startTime} placeholder="-" />
      </div>
      <div class="field">
        <label for="end-time">End time</label>
        <input id="end-time" class="input mono" type="text" bind:value={app.endTime} placeholder="-" />
      </div>
    </div>
  </details>
</section>

<style>
  label {
    cursor: pointer;
  }
  .hint {
    font-weight: 400;
    color: var(--muted);
  }
  .error {
    margin: 0;
    color: var(--danger);
    font-size: 0.85rem;
  }
  summary {
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .times {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
</style>
