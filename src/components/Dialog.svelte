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

  function onBackdropClick(e: MouseEvent) {
    if (e.target === dialog) open = false;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} class:side onclose={() => (open = false)} onclick={onBackdropClick} aria-label={title}>
  {#if open}
    <div class="panel">
      <header>
        <h2>{title}</h2>
        <button class="btn btn-icon" type="button" onclick={() => (open = false)} aria-label="Close">
          <Icon name="x" />
        </button>
      </header>
      <div class="body">
        {@render children()}
      </div>
    </div>
  {/if}
</dialog>

<style>
  dialog {
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow);
    width: min(28rem, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 0.5);
  }
  dialog.side {
    margin: 0 0 0 auto;
    height: 100vh;
    max-height: none;
    width: min(28rem, 100vw);
    border-radius: 0;
    border-width: 0 0 0 1px;
  }
  .panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: inherit;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }
  h2 {
    margin: 0;
    font-size: 1.05rem;
  }
  .body {
    padding: 1rem 1.25rem 1.25rem;
    overflow-y: auto;
    flex: 1;
    display: grid;
    gap: 0.75rem;
    align-content: start;
  }
</style>
