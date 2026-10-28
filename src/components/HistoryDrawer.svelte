<script lang="ts">
  import { app } from '../lib/app.svelte.ts';
  import { copyText } from '../lib/clipboard.ts';
  import Dialog from './Dialog.svelte';
  import Icon from './Icon.svelte';

  let { open = $bindable(false) }: { open: boolean } = $props();

  let query = $state('');
  let copiedId = $state<string | null>(null);

  const filtered = $derived.by(() => {
    const q = query.toLowerCase();
    return app.history.filter((h) => h.content.toLowerCase().includes(q) || h.dateString.toLowerCase().includes(q));
  });

  async function copy(id: string, content: string) {
    if (await copyText(content)) {
      copiedId = id;
      setTimeout(() => (copiedId = null), 2000);
    }
  }

  function clearAll() {
    if (window.confirm('Are you sure you want to clear all saved daily notes?')) app.clearHistory();
  }
</script>

<Dialog bind:open title={`History (${app.history.length})`} side>
  <div class="relative">
    <span class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"><Icon name="search" size={14} /></span>
    <input class="input pl-9" type="search" bind:value={query} placeholder="Search past dailies…" aria-label="Search history" />
  </div>
  {#if app.history.length > 0}
    <button class="btn btn-sm btn-danger justify-self-end" type="button" onclick={clearAll}>
      <Icon name="trash" size={14} /> Clear history
    </button>
  {/if}

  {#if filtered.length === 0}
    <p class="px-2 py-10 text-center text-sm text-muted">
      No history entries found. Dailies you create are saved here automatically (last 50).
    </p>
  {:else}
    {#each filtered as item (item.id)}
      <article class="grid gap-2.5 rounded-xl border border-line p-3">
        <div class="flex items-center justify-between gap-2">
          <strong class="text-sm">{item.dateString}</strong>
          <time class="text-xs text-muted" datetime={new Date(item.timestamp).toISOString()}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        </div>
        <pre class="max-h-28 overflow-hidden rounded-lg bg-surface-2 p-2.5 font-mono text-xs break-words whitespace-pre-wrap">{item.content}</pre>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs text-muted">
            {item.tasksCount} {item.tasksCount === 1 ? 'task' : 'tasks'}{item.timeoutsCount ? ` · ${item.timeoutsCount} timeouts` : ''}
          </span>
          <div class="flex items-center gap-2">
            <button class="btn btn-sm" type="button" onclick={() => copy(item.id, item.content)}>
              <Icon name={copiedId === item.id ? 'check' : 'copy'} size={14} />
              {copiedId === item.id ? 'Copied' : 'Copy'}
            </button>
            <button
              class="btn btn-sm btn-primary"
              type="button"
              onclick={() => {
                app.loadHistoryItem(item);
                open = false;
              }}>Load</button
            >
            <button
              class="btn btn-sm btn-icon btn-danger"
              type="button"
              aria-label={`Delete entry ${item.dateString}`}
              onclick={() => app.deleteHistoryItem(item.id)}
            >
              <Icon name="trash" size={14} />
            </button>
          </div>
        </div>
      </article>
    {/each}
  {/if}
</Dialog>
