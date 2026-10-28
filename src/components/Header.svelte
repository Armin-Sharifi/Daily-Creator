<script lang="ts">
  import { app } from '../lib/app.svelte.ts';
  import type { ThemeMode } from '../lib/types.ts';
  import type { IconName } from '../lib/icons.ts';
  import Icon from './Icon.svelte';
  import InstallButton from './InstallButton.svelte';

  let { onOpenHistory, onOpenShortcuts }: { onOpenHistory: () => void; onOpenShortcuts: () => void } = $props();

  const themes: { value: ThemeMode; label: string; icon: IconName }[] = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'retro-winforms', label: 'Classic WinForms', icon: 'monitor' },
  ];
</script>

<header>
  <div class="inner">
    <div class="brand">
      <img src="/icon.svg" alt="" width="32" height="32" />
      <div>
        <h1>Daily Creator</h1>
        <p>Daily message &amp; standup generator</p>
      </div>
    </div>

    <div class="actions">
      <InstallButton />
      <button class="btn" type="button" onclick={onOpenShortcuts} title="Keyboard shortcuts">
        <Icon name="keyboard" /> <span class="hide-sm">Shortcuts</span>
      </button>
      <button class="btn" type="button" onclick={onOpenHistory} title="View saved daily notes">
        <Icon name="history" /> <span class="hide-sm">History</span>
        {#if app.history.length > 0}<span class="badge">{app.history.length}</span>{/if}
      </button>
      <div class="themes" role="radiogroup" aria-label="Theme">
        {#each themes as t (t.value)}
          <button
            type="button"
            role="radio"
            aria-checked={app.theme === t.value}
            aria-label={t.label}
            title={t.label}
            class:active={app.theme === t.value}
            onclick={() => (app.theme = t.value)}
          >
            <Icon name={t.icon} />
          </button>
        {/each}
      </div>
    </div>
  </div>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
  }
  .inner {
    max-width: 72rem;
    margin: 0 auto;
    padding: 0.7rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
  .brand img {
    border-radius: 8px;
  }
  h1 {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.2;
  }
  p {
    margin: 0;
    font-size: 0.75rem;
    color: var(--muted);
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .themes {
    display: flex;
    padding: 2px;
    gap: 2px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 9px;
  }
  .themes button {
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 1.9rem;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
  }
  .themes button.active {
    background: var(--accent);
    color: var(--accent-contrast);
  }
  @media (max-width: 40rem) {
    .hide-sm {
      display: none;
    }
    p {
      display: none;
    }
  }
</style>
