<script lang="ts">
  import { app } from '../lib/app.svelte.ts';
  import { ABBREVIATED_MONTHS, DAYS, getDaySuffix } from '../lib/daily.ts';
  import Icon from './Icon.svelte';

  // Bridge between the month/day/year state and the native <input type="date"> (YYYY-MM-DD).
  const nativeValue = $derived.by(() => {
    const monthIndex = ABBREVIATED_MONTHS.indexOf(app.month as (typeof ABBREVIATED_MONTHS)[number]);
    const mm = String(monthIndex >= 0 ? monthIndex + 1 : 1).padStart(2, '0');
    return `${app.year}-${mm}-${String(app.day).padStart(2, '0')}`;
  });

  function onNativeChange(e: Event) {
    const value = (e.currentTarget as HTMLInputElement).value;
    if (!value) return;
    const [y, m, d] = value.split('-').map(Number);
    if (y && m && d) {
      app.year = y;
      app.month = ABBREVIATED_MONTHS[m - 1];
      app.day = d;
    }
  }
</script>

<section class="card" aria-labelledby="date-heading">
  <div class="card-head">
    <h2 id="date-heading">Date</h2>
    <div class="row">
      <button class="btn btn-sm" type="button" onclick={() => app.setToday()}>Today</button>
      <button class="btn btn-sm" type="button" onclick={() => app.setTomorrow()}>Tomorrow</button>
      <label class="btn btn-sm btn-icon picker" title="Pick a date from the calendar">
        <Icon name="calendar" />
        <span class="sr-only">Pick a date</span>
        <input type="date" value={nativeValue} onchange={onNativeChange} />
      </label>
    </div>
  </div>

  <div class="grid">
    <div class="field">
      <label for="month-select">Month</label>
      <select id="month-select" class="input" bind:value={app.month}>
        {#each ABBREVIATED_MONTHS as m (m)}<option value={m}>{m}</option>{/each}
      </select>
    </div>
    <div class="field">
      <label for="day-select">Day</label>
      <select id="day-select" class="input" bind:value={app.day}>
        {#each DAYS as d (d)}<option value={d}>{d} ({getDaySuffix(d)})</option>{/each}
      </select>
    </div>
    <div class="field">
      <label for="year-input">Year</label>
      <input id="year-input" class="input" type="number" min="1" max="9999" bind:value={app.year} />
    </div>
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
    gap: 0.75rem;
  }
  .picker {
    position: relative;
    cursor: pointer;
  }
  .picker input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .picker:focus-within {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
</style>
