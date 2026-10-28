<script lang="ts">
  import Dialog from './Dialog.svelte';

  let { open = $bindable(false) }: { open: boolean } = $props();

  const shortcuts = [
    { keys: ['Ctrl / ⌘', 'Enter'], description: 'Generate the daily text' },
    { keys: ['Ctrl / ⌘', 'Shift', 'C'], description: 'Copy output to clipboard' },
    { keys: ['Esc'], description: 'Close the open drawer or dialog' },
  ];
</script>

<Dialog bind:open title="Keyboard shortcuts">
  {#each shortcuts as s (s.description)}
    <div class="shortcut">
      <span>{s.description}</span>
      <span class="keys">{#each s.keys as k (k)}<kbd>{k}</kbd>{/each}</span>
    </div>
  {/each}
</Dialog>

<style>
  .shortcut {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 0.75rem;
    background: var(--surface-2);
    border-radius: 8px;
    font-size: 0.9rem;
  }
  .keys {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
  }
</style>
