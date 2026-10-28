<script lang="ts">
  import DailyPreview from './components/DailyPreview.svelte';
  import DateSelector from './components/DateSelector.svelte';
  import Header from './components/Header.svelte';
  import HistoryDrawer from './components/HistoryDrawer.svelte';
  import OfflineIndicator from './components/OfflineIndicator.svelte';
  import RetroWinFormsView from './components/RetroWinFormsView.svelte';
  import ShortcutsModal from './components/ShortcutsModal.svelte';
  import TaskEditor from './components/TaskEditor.svelte';
  import TimeoutSection from './components/TimeoutSection.svelte';
  import { app } from './lib/app.svelte.ts';

  let historyOpen = $state(false);
  let shortcutsOpen = $state(false);

  $effect(() => {
    document.documentElement.dataset.theme = app.theme;
  });

  $effect(() => {
    app.persist();
  });

  function onKeydown(e: KeyboardEvent) {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === 'Enter') {
      e.preventDefault();
      app.createDaily();
    } else if (mod && e.shiftKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      app.copyDaily();
    } else if (e.key === 'Escape') {
      app.validationError = null;
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<Header onOpenHistory={() => (historyOpen = true)} onOpenShortcuts={() => (shortcutsOpen = true)} />

<main>
  {#if app.validationError}
    <div class="alert" role="alert">
      <span>{app.validationError}</span>
      <button class="btn btn-sm" type="button" onclick={() => (app.validationError = null)}>Dismiss</button>
    </div>
  {/if}

  {#if app.theme === 'retro-winforms'}
    <RetroWinFormsView />
  {:else}
    <div class="layout">
      <div class="col">
        <DateSelector />
        <TaskEditor />
        <TimeoutSection />
      </div>
      <div class="col sticky">
        <DailyPreview />
      </div>
    </div>
  {/if}
</main>

<HistoryDrawer bind:open={historyOpen} />
<ShortcutsModal bind:open={shortcutsOpen} />
<OfflineIndicator />

<style>
  main {
    max-width: 72rem;
    margin: 0 auto;
    padding: 1.25rem 1rem 3rem;
    display: grid;
    gap: 1rem;
  }
  .alert {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 0.9rem;
    border-radius: 8px;
    background: var(--warn-bg);
    color: var(--warn-text);
  }
  .layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    align-items: start;
  }
  .col {
    display: grid;
    gap: 1rem;
    min-width: 0;
  }
  @media (min-width: 62rem) {
    .layout {
      grid-template-columns: 1fr 1fr;
    }
    .sticky {
      position: sticky;
      top: 5rem;
    }
  }
</style>
