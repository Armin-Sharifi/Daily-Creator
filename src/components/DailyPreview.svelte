<script lang="ts">
  import { app } from '../lib/app.svelte.ts';
  import Icon from './Icon.svelte';

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;
  const words = $derived(app.dailyText.trim() ? app.dailyText.trim().split(/\s+/).length : 0);

  async function share() {
    if (!app.dailyText) return;
    try {
      await navigator.share({ title: 'Daily Tasks & Standup', text: app.dailyText });
    } catch {
      // Share sheet dismissed or unavailable.
    }
  }

  function download() {
    if (!app.dailyText) return;
    const url = URL.createObjectURL(new Blob([app.dailyText], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-standup-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
</script>

<section class="stack" aria-labelledby="output-heading">
  <button id="btnCreateText" class="btn btn-primary generate" type="button" onclick={() => app.createDaily()}>
    <Icon name="sparkles" /> Create Daily
  </button>

  <div class="card">
    <div class="card-head">
      <h2 id="output-heading">Daily</h2>
      {#if app.dailyText}
        <span class="badge">{app.dailyText.length} chars · {words} words</span>
      {/if}
    </div>

    <textarea
      id="daily-output"
      class="input mono output"
      readonly
      rows="12"
      value={app.dailyText}
      aria-labelledby="output-heading"
      placeholder="Your daily will appear here after you press “Create Daily”."
    ></textarea>

    <div class="row">
      <button id="btnCopy" class="btn copy" type="button" onclick={() => app.copyDaily()} disabled={!app.dailyText}>
        {#if app.copyStatus === 'copied'}
          <Icon name="check" /> Copied to clipboard
        {:else}
          <Icon name="copy" /> Copy Daily
        {/if}
      </button>
      {#if app.dailyText}
        {#if canShare}
          <button class="btn btn-icon" type="button" onclick={share} aria-label="Share" title="Share to Slack, Teams, WhatsApp…">
            <Icon name="share" />
          </button>
        {/if}
        <button class="btn btn-icon" type="button" onclick={download} aria-label="Download as .txt" title="Download as .txt">
          <Icon name="download" />
        </button>
      {/if}
    </div>
    <p class="status" role="status">
      {#if app.copyStatus === 'failed'}<span class="fail">Couldn't access the clipboard. Select the text and copy it manually.</span>{/if}
    </p>
  </div>
</section>

<style>
  .stack {
    display: grid;
    gap: 1rem;
  }
  .generate {
    min-height: 3rem;
    font-size: 1rem;
  }
  .output {
    font-size: 0.85rem;
    min-height: 14rem;
  }
  .copy {
    flex: 1;
  }
  .status {
    margin: 0;
    min-height: 1.2rem;
    font-size: 0.85rem;
  }
  .fail {
    color: var(--danger);
  }
</style>
