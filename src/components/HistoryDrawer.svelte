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
  <div class="search">
    <Icon name="search" size={14} />
    <input class="input" type="search" bind:value={query} placeholder="Search past dailies…" aria-label="Search history" />
  </div>
  {#if app.history.length > 0}
    <button class="btn btn-sm btn-danger clear" type="button" onclick={clearAll}>
      <Icon name="trash" size={14} /> Clear history
    </button>
  {/if}

  {#if filtered.length === 0}
    <p class="empty">No history entries found. Dailies you create are saved here automatically (last 50).</p>
  {:else}
    {#each filtered as item (item.id)}
      <article>
        <div class="row head">
          <strong>{item.dateString}</strong>
          <time class="muted" datetime={new Date(item.timestamp).toISOString()}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        </div>
        <pre class="mono">{item.content}</pre>
        <div class="row foot">
          <span class="muted">
            {item.tasksCount} {item.tasksCount === 1 ? 'task' : 'tasks'}{item.timeoutsCount ? ` · ${item.timeoutsCount} timeouts` : ''}
          </span>
          <div class="row">
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

<style>
  .search {
    position: relative;
  }
  .search :global(svg) {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
  }
  .search .input {
    padding-left: 2.1rem;
  }
  .clear {
    justify-self: end;
  }
  .empty {
    text-align: center;
    color: var(--muted);
    padding: 2rem 0.5rem;
    margin: 0;
  }
  article {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.8rem;
    display: grid;
    gap: 0.6rem;
  }
  .head,
  .foot {
    justify-content: space-between;
  }
  .muted {
    color: var(--muted);
    font-size: 0.8rem;
  }
  pre {
    margin: 0;
    padding: 0.6rem;
    background: var(--surface-2);
    border-radius: 8px;
    font-size: 0.78rem;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    max-height: 7.5rem;
    overflow: hidden;
  }
</style>
