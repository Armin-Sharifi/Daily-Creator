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
  <div
    role="status"
    class="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm shadow-lg lg:right-6 lg:bottom-6 lg:left-auto lg:translate-x-0"
  >
    <Icon name="wifiOff" /> Offline — all features still work
  </div>
{/if}
