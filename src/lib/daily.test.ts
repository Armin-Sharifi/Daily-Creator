import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateDuration, generateDailyText, getDaySuffix } from './daily.ts';

test('day suffixes', () => {
  const expected: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd', 4: 'th', 11: 'th', 12: 'th', 13: 'th', 21: 'st', 22: 'nd', 23: 'rd', 31: 'st' };
  for (const [day, suffix] of Object.entries(expected)) assert.equal(getDaySuffix(Number(day)), suffix);
});

test('durations', () => {
  assert.equal(calculateDuration('13:00', '15:00'), '2 hours');
  assert.equal(calculateDuration('10:00', '10:45'), '45 mins');
  assert.equal(calculateDuration('9:00', '10:30'), '1 hour 30 mins');
  assert.equal(calculateDuration('23:00', '01:00'), '2 hours');
  assert.equal(calculateDuration('1:00 pm', '2:00 PM'), '1 hour');
  assert.equal(calculateDuration('10:00', '10:00'), '0 mins');
  assert.equal(calculateDuration('abc', '10:00'), '');
});

test('daily text without timeouts', () => {
  const text = generateDailyText({ year: 2025, month: 'Mar', day: 2, tasksRaw: 'one\n- two\n\n• three\r\n  -four  ' });
  assert.equal(
    text,
    "🗓 2025 - Mar - 2nd\n\n⏰ Start time: -\n⏰ End time: -\n🗒 Today's tasks:\n\n- one\n- two\n- three\n- four",
  );
});

test('daily text with timeouts', () => {
  const text = generateDailyText({
    year: 2025, month: 'Dec', day: 11, tasksRaw: '', startTime: '9:00', endTime: '17:00',
    timeouts: [{ id: '1', title: 'PowerOutage', startTime: '13:00', endTime: '15:00', duration: '2 hours' }],
  });
  assert.equal(
    text,
    "🗓 2025 - Dec - 11th\n\n⏰ Start time: 9:00\n⏰ End time: 17:00\n🗒 Today's tasks:\n\n⚡TimeOuts:\n -PowerOutage : 13:00 - 15:00 (2 hours)",
  );
});
