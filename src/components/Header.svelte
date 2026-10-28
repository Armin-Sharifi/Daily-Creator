<script lang="ts">
  import { app } from '../lib/app.svelte.ts';
  import Icon from './Icon.svelte';
  import InstallButton from './InstallButton.svelte';

  let { onOpenHistory, onOpenShortcuts }: { onOpenHistory: () => void; onOpenShortcuts: () => void } = $props();

  const isDark = $derived(app.theme === 'dark');
</script>

<header class="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur-md">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
    <div class="flex min-w-0 items-center gap-3">
      <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="36" height="36" class="size-9 rounded-xl shadow-sm" />
      <div class="min-w-0">
        <h1 class="truncate text-lg leading-tight font-bold tracking-tight">Daily Creator</h1>
        <p class="hidden truncate text-xs text-muted sm:block">Daily message &amp; standup generator</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <InstallButton />
      <button class="btn btn-icon hidden sm:inline-flex sm:px-3.5" type="button" onclick={onOpenShortcuts} aria-label="Keyboard shortcuts" title="Keyboard shortcuts">
        <Icon name="keyboard" /><span class="hidden lg:inline">Shortcuts</span>
      </button>
      <button class="btn relative px-3 sm:px-3.5" type="button" onclick={onOpenHistory} aria-label="History" title="History">
        <Icon name="history" /><span class="hidden sm:inline">History</span>
        {#if app.history.length > 0}
          <span class="chip border-brand/30 bg-brand-soft text-brand">{app.history.length}</span>
        {/if}
      </button>
      <button
        class="btn btn-icon"
        type="button"
        onclick={() => (app.theme = isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        <Icon name={isDark ? 'sun' : 'moon'} />
      </button>
    </div>
  </div>
</header>
