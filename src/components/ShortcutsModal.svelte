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
    <div class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-2 px-3 py-2.5 text-sm">
      <span>{s.description}</span>
      <span class="flex gap-1">
        {#each s.keys as k (k)}
          <kbd class="rounded-md border border-b-2 border-line bg-surface px-1.5 py-0.5 font-mono text-xs">{k}</kbd>
        {/each}
      </span>
    </div>
  {/each}
</Dialog>
