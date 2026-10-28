<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';

  let {
    open = $bindable(false),
    title,
    side = false,
    children,
  }: { open: boolean; title: string; side?: boolean; children: Snippet } = $props();

  let dialog: HTMLDialogElement;

  $effect(() => {
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  aria-label={title}
  onclose={() => (open = false)}
  onclick={(e) => e.target === dialog && (open = false)}
  class="border-line bg-surface text-fg shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm
    {side
    ? 'mt-0 mr-0 mb-0 ml-auto h-dvh max-h-none w-full max-w-md border-l'
    : 'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md rounded-2xl border'}"
>
  {#if open}
    <div class="flex h-full max-h-[inherit] flex-col">
      <header class="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 class="text-base font-semibold">{title}</h2>
        <button class="btn btn-icon btn-sm" type="button" onclick={() => (open = false)} aria-label="Close">
          <Icon name="x" />
        </button>
      </header>
      <div class="grid flex-1 content-start gap-3 overflow-y-auto px-5 py-4">
        {@render children()}
      </div>
    </div>
  {/if}
</dialog>
