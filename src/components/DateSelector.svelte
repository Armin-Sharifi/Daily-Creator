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
  <div class="flex flex-wrap items-center justify-between gap-2">
    <h2 id="date-heading" class="card-title"><Icon name="calendar" /> Date</h2>
    <div class="flex items-center gap-2">
      <button class="btn btn-sm" type="button" onclick={() => app.setToday()}>Today</button>
      <button class="btn btn-sm" type="button" onclick={() => app.setTomorrow()}>Tomorrow</button>
      <label class="btn btn-sm btn-icon relative focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand" title="Pick a date from the calendar">
        <Icon name="calendar" size={14} />
        <span class="sr-only">Pick a date</span>
        <input type="date" value={nativeValue} onchange={onNativeChange} class="absolute inset-0 size-full cursor-pointer opacity-0" />
      </label>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
    <div class="grid gap-1.5">
      <label class="label" for="month-select">Month</label>
      <select id="month-select" class="input" bind:value={app.month}>
        {#each ABBREVIATED_MONTHS as m (m)}<option value={m}>{m}</option>{/each}
      </select>
    </div>
    <div class="grid gap-1.5">
      <label class="label" for="day-select">Day</label>
      <select id="day-select" class="input" bind:value={app.day}>
        {#each DAYS as d (d)}<option value={d}>{d} ({getDaySuffix(d)})</option>{/each}
      </select>
    </div>
    <div class="col-span-2 grid gap-1.5 sm:col-span-1">
      <label class="label" for="year-input">Year</label>
      <input id="year-input" class="input" type="number" min="1" max="9999" bind:value={app.year} />
    </div>
  </div>
</section>
