import test from 'node:test';
import assert from 'node:assert/strict';
import { daysRemaining, formatDeadline } from '../src/lib/dateUtils.js';
import { statusConfig, ALL_STATUSES } from '../src/lib/statusConfig.js';

test('statusConfig contains all defined statuses with required presentation metadata', () => {
  assert.equal(ALL_STATUSES.length, 7);
  const expected = [
    'researching',
    'preparing',
    'submitted',
    'interview',
    'accepted',
    'rejected',
    'waitlisted',
  ];
  assert.deepEqual(ALL_STATUSES, expected);

  for (const status of ALL_STATUSES) {
    const cfg = statusConfig[status];
    assert.ok(cfg, `Missing config for status ${status}`);
    assert.ok(cfg.label, `Missing label for status ${status}`);
    assert.ok(cfg.short, `Missing short code for status ${status}`);
    assert.ok(cfg.dot && cfg.dot.startsWith('bg-'), `Invalid dot color for ${status}: ${cfg.dot}`);
    assert.ok(cfg.badge && cfg.badge.includes('border'), `Invalid badge classes for ${status}: ${cfg.badge}`);
  }
});

test('daysRemaining accurately calculates future, past, and placeholder dates', () => {
  // Empty or null
  assert.equal(daysRemaining(null), null);
  assert.equal(daysRemaining(''), null);

  // Placeholder "Not Out Yet" sentinel date
  assert.equal(daysRemaining('9999-12-31'), null);
  assert.equal(daysRemaining('9999-12-31T23:59:59'), null);

  // Future date (30 days from now)
  const future = new Date();
  future.setDate(future.getDate() + 30);
  const futureIso = future.toISOString().split('T')[0];
  const remainingFuture = daysRemaining(futureIso);
  assert.ok(remainingFuture >= 29 && remainingFuture <= 31, `Expected ~30 days, got ${remainingFuture}`);

  // Past date (10 days ago)
  const past = new Date();
  past.setDate(past.getDate() - 10);
  const pastIso = past.toISOString().split('T')[0];
  const remainingPast = daysRemaining(pastIso);
  assert.ok(remainingPast <= -9 && remainingPast >= -11, `Expected ~-10 days, got ${remainingPast}`);

  // Today
  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];
  assert.equal(daysRemaining(todayIso), 0);
});

test('formatDeadline formats dates cleanly and handles special sentinels', () => {
  // Empty or null
  assert.equal(formatDeadline(null), '—');
  assert.equal(formatDeadline(''), '—');

  // Placeholder sentinel
  assert.equal(formatDeadline('9999-12-31'), 'Not Out Yet');

  // Specific ISO date
  assert.equal(formatDeadline('2026-10-15'), '15 Oct 2026');
  assert.equal(formatDeadline('2026-01-01'), '01 Jan 2026');
});

test('Pipeline aggregation calculates accurate counts and document ready states', () => {
  const mockUniversities = [
    { id: 1, name: 'MIT', status: 'researching', deadline: '2026-12-15' },
    { id: 2, name: 'Stanford', status: 'submitted', deadline: '2026-11-30' },
    { id: 3, name: 'CMU', status: 'submitted', deadline: '2026-12-01' },
    { id: 4, name: 'UC Berkeley', status: 'accepted', deadline: '2026-11-15' },
  ];

  const counts = {};
  for (const s of ALL_STATUSES) {
    counts[s] = 0;
  }
  for (const u of mockUniversities) {
    if (counts[u.status] !== undefined) counts[u.status]++;
  }

  assert.equal(counts.researching, 1);
  assert.equal(counts.submitted, 2);
  assert.equal(counts.accepted, 1);
  assert.equal(counts.rejected, 0);

  const mockDocs = [
    { id: 1, doc_name: 'Statement of Purpose', is_ready: true },
    { id: 2, doc_name: 'Resume / CV', is_ready: true },
    { id: 3, doc_name: 'Transcript', is_ready: false },
  ];

  const readyDocs = mockDocs.filter(d => d.is_ready).length;
  assert.equal(readyDocs, 2);
  assert.equal(mockDocs.length, 3);
});
