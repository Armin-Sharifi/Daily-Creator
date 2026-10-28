<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';

  let online = $state(true);

  onMount(() => {
    online = navigator.onLine;
    const update = () => (online = navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  });
</script>

{#if !online}
  <div class="offline" role="status">
    <Icon name="wifiOff" /> Offline mode — all features still work
  </div>
{/if}

<style>
  .offline {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    border-radius: 999px;
    background: var(--warn-bg);
    color: var(--warn-text);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    font-size: 0.85rem;
  }
</style>
