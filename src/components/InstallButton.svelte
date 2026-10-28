<script lang="ts">
  import { onMount } from 'svelte';
  import Dialog from './Dialog.svelte';
  import Icon from './Icon.svelte';

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }

  let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
  let installed = $state(false);
  let isIOS = $state(false);
  let installing = $state(false);
  let iosGuideOpen = $state(false);

  onMount(() => {
    installed =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());

    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
    };
    const onInstalled = () => {
      installed = true;
      deferredPrompt = null;
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  });

  async function install() {
    if (!deferredPrompt) return;
    installing = true;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installed = true;
        deferredPrompt = null;
      }
    } finally {
      installing = false;
    }
  }
</script>

{#if !installed}
  {#if deferredPrompt}
    <button class="btn btn-primary" type="button" onclick={install} disabled={installing} title="Install app to your device">
      <Icon name="download" /> {installing ? 'Installing…' : 'Install'}
    </button>
  {:else if isIOS}
    <button class="btn" type="button" onclick={() => (iosGuideOpen = true)}>
      <Icon name="download" /> Install on iOS
    </button>
    <Dialog bind:open={iosGuideOpen} title="Install on iOS">
      <ol>
        <li>Tap the <strong>Share</strong> button in Safari.</li>
        <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
      </ol>
      <button class="btn btn-primary" type="button" onclick={() => (iosGuideOpen = false)}>Understood</button>
    </Dialog>
  {/if}
{/if}

<style>
  ol {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.5rem;
  }
</style>
