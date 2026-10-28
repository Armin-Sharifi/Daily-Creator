<script lang="ts">
  import DailyPreview from './components/DailyPreview.svelte';
  import DateSelector from './components/DateSelector.svelte';
  import Header from './components/Header.svelte';
  import HistoryDrawer from './components/HistoryDrawer.svelte';
  import Icon from './components/Icon.svelte';
  import OfflineIndicator from './components/OfflineIndicator.svelte';
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

  function create() {
    app.createDaily();
    // On stacked (small) layouts the output sits below the form; bring it into view.
    if (!app.validationError && !window.matchMedia('(min-width: 1024px)').matches) {
      requestAnimationFrame(() => document.getElementById('daily-output')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    }
  }

  function onKeydown(e: KeyboardEvent) {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === 'Enter') {
      e.preventDefault();
      create();
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

<main class="mx-auto grid max-w-6xl gap-4 px-4 pt-5 pb-28 sm:px-6 sm:pt-8 lg:pb-12">
  {#if app.validationError}
    <div class="flex items-center justify-between gap-3 rounded-xl border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger" role="alert">
      <span>{app.validationError}</span>
      <button class="btn btn-sm" type="button" onclick={() => (app.validationError = null)}>Dismiss</button>
    </div>
  {/if}

  <div class="grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
    <div class="grid min-w-0 gap-4">
      <DateSelector />
      <TaskEditor />
      <TimeoutSection />
    </div>

    <div class="grid min-w-0 gap-4 lg:sticky lg:top-24">
      <!-- Fixed bottom bar on small screens, regular button above the output on large ones. -->
      <div
        class="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-line bg-surface/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
      >
        <button id="btnCreateText" class="btn btn-primary min-h-12 flex-1 text-base font-semibold shadow-md lg:min-h-13" type="button" onclick={create}>
          <Icon name="sparkles" /> Create Daily
        </button>
        <button
          class="btn min-h-12 px-4 lg:hidden"
          type="button"
          onclick={() => app.copyDaily()}
          disabled={!app.dailyText}
          aria-label="Copy daily"
        >
          <Icon name={app.copyStatus === 'copied' ? 'check' : 'copy'} />
        </button>
      </div>
      <DailyPreview />
    </div>
  </div>
</main>

<HistoryDrawer bind:open={historyOpen} />
<ShortcutsModal bind:open={shortcutsOpen} />
<OfflineIndicator />
