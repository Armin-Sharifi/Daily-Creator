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

<section class="card overflow-hidden" aria-labelledby="output-heading">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <h2 id="output-heading" class="card-title"><Icon name="sparkles" /> Daily</h2>
    {#if app.dailyText}
      <span class="chip">{app.dailyText.length} chars · {words} words</span>
    {/if}
  </div>

  <textarea
    id="daily-output"
    class="input min-h-64 resize-y bg-surface-2 font-mono text-[13px] leading-relaxed sm:min-h-80"
    readonly
    rows="12"
    value={app.dailyText}
    aria-labelledby="output-heading"
    placeholder="Your daily will appear here after you press “Create Daily”."
  ></textarea>

  <div class="flex gap-2">
    <button
      id="btnCopy"
      class="btn flex-1 {app.copyStatus === 'copied' ? 'border-ok text-ok' : ''}"
      type="button"
      onclick={() => app.copyDaily()}
      disabled={!app.dailyText}
    >
      {#if app.copyStatus === 'copied'}
        <Icon name="check" /> Copied!
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
  <p class="-mt-2 min-h-5 text-sm text-danger" role="status">
    {#if app.copyStatus === 'failed'}Couldn't access the clipboard. Select the text and copy it manually.{/if}
  </p>
</section>
