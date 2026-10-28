<script lang="ts">
  import { app, newId } from '../lib/app.svelte.ts';
  import { ABBREVIATED_MONTHS, calculateDuration, DAYS, getDaySuffix } from '../lib/daily.ts';

  let newTitle = $state('');
  let newStart = $state('13:00');
  let newEnd = $state('15:00');

  function addTimeout() {
    if (!newTitle.trim()) return;
    app.timeouts = [
      ...app.timeouts,
      {
        id: newId(),
        title: newTitle.trim(),
        startTime: newStart.trim(),
        endTime: newEnd.trim(),
        duration: calculateDuration(newStart, newEnd),
      },
    ];
    newTitle = '';
  }
</script>

<div class="notice">Classic WinForms mode — mirrors the original .NET form layout</div>

<div class="window">
  <div class="titlebar">
    <span>🗓 Daily Creator</span>
    <span class="controls" aria-hidden="true"><i>_</i><i>□</i><i class="close">✕</i></span>
  </div>

  <div class="body">
    <fieldset>
      <legend>Date</legend>
      <div class="row">
        <label for="retro-month">Month :</label>
        <select id="retro-month" bind:value={app.month}>
          {#each ABBREVIATED_MONTHS as m (m)}<option value={m}>{m}</option>{/each}
        </select>
        <label for="retro-day">Day :</label>
        <select id="retro-day" bind:value={app.day}>
          {#each DAYS as d (d)}<option value={d}>{d} ({getDaySuffix(d)})</option>{/each}
        </select>
      </div>
    </fieldset>

    <label for="retro-tasks">Tasks Per Line :</label>
    <textarea id="retro-tasks" rows="4" bind:value={app.tasksRaw}></textarea>

    <fieldset>
      <legend>TimeOuts</legend>
      <div class="row">
        <label for="retro-emoji">Emoji:</label>
        <input id="retro-emoji" class="narrow" bind:value={app.timeoutEmoji} />
        {#each ['⚡', '⏸️', '☕', '🔌'] as em (em)}
          <button type="button" class="small" onclick={() => (app.timeoutEmoji = em)}>{em}</button>
        {/each}
      </div>
      <div class="row">
        <input class="grow" placeholder="Title (e.g. PowerOutage)" aria-label="Timeout title" bind:value={newTitle} />
        <input class="narrow" placeholder="13:00" aria-label="Timeout start" bind:value={newStart} />
        <span>-</span>
        <input class="narrow" placeholder="15:00" aria-label="Timeout end" bind:value={newEnd} />
        <button type="button" onclick={addTimeout}>+ Add</button>
      </div>
      {#each app.timeouts as item (item.id)}
        <div class="item">
          <span>
            {app.timeoutEmoji} -{item.title} : {item.startTime} - {item.endTime} ({item.duration || calculateDuration(item.startTime, item.endTime)})
          </span>
          <button type="button" class="x" aria-label={`Remove ${item.title}`} onclick={() => (app.timeouts = app.timeouts.filter((t) => t.id !== item.id))}>×</button>
        </div>
      {/each}
    </fieldset>

    <button type="button" onclick={() => app.createDaily()}>Create Daily</button>

    <label for="retro-daily">Daily :</label>
    <textarea id="retro-daily" rows="5" readonly value={app.dailyText}></textarea>

    <button type="button" onclick={() => app.copyDaily()} disabled={!app.dailyText}>
      {app.copyStatus === 'copied' ? '✓ Copied to Clipboard!' : 'Copy Daily'}
    </button>
  </div>
</div>

<style>
  .notice {
    width: fit-content;
    margin: 0 auto 1rem;
    padding: 0.25rem 0.75rem;
    background: rgb(255 255 255 / 0.9);
    border: 1px solid #b6c2d0;
    font-size: 0.75rem;
    color: #1e395b;
  }
  .window {
    width: min(26.5rem, 100%);
    margin: 0 auto;
    font: 12px Tahoma, Verdana, sans-serif;
    color: #000;
    background: #f0f0f0;
    border: 2px solid #0055ea;
    border-radius: 8px 8px 0 0;
    box-shadow: 4px 6px 18px rgb(0 0 0 / 0.4);
  }
  .titlebar {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0.6rem;
    background: linear-gradient(#d9e8fb, #99c4f5);
    color: #1e395b;
    font-weight: 600;
  }
  .controls {
    display: flex;
    gap: 3px;
  }
  .controls i {
    font-style: normal;
    width: 1.3rem;
    text-align: center;
    background: #e1e9f2;
    border: 1px solid #a4b9d1;
    font-size: 10px;
  }
  .controls .close {
    background: #c74534;
    color: #fff;
    width: 1.6rem;
  }
  .body {
    padding: 0.8rem;
    display: grid;
    gap: 0.5rem;
  }
  fieldset {
    margin: 0;
    border: 1px solid #d0d0d0;
    display: grid;
    gap: 0.4rem;
  }
  .row {
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }
  select,
  input,
  textarea {
    background: #fff;
    color: #000;
    border: 1px solid #7f9db9;
    border-radius: 0;
    padding: 2px 4px;
    font: inherit;
    min-width: 0;
  }
  textarea {
    resize: none;
    width: 100%;
  }
  select {
    flex: 1;
  }
  .grow {
    flex: 1;
  }
  .narrow {
    width: 3.6rem;
    text-align: center;
  }
  button {
    font: inherit;
    color: #000;
    padding: 3px 10px;
    background: linear-gradient(#f2f2f2, #ebebeb);
    border: 1px solid #707070;
    border-radius: 2px;
    cursor: pointer;
  }
  button:hover:not(:disabled) {
    background: linear-gradient(#eaf6fd, #bee6fd);
    border-color: #3c7fb1;
  }
  button:disabled {
    color: #888;
    cursor: default;
  }
  .small {
    padding: 0 4px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 1px solid #e0e0e0;
    padding: 1px 4px;
  }
  .x {
    border: 0;
    background: none;
    color: #c00;
    font-weight: 700;
    padding: 0 4px;
  }
</style>
