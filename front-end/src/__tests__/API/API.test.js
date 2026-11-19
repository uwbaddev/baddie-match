import { fetchElo, MatchPageUrl } from '../../API/API';

const summary = { singles: [{ name: 'Ada', singles_elo: 1100 }], doubles: [{ name: 'Ben' }] };
const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('match page requests include both filters and preserve unfiltered defaults', () => {
  const url = new URL(MatchPageUrl(2, 20, '2026-09-01', '2027-08-31', 'mixed', 59), 'http://localhost');
  expect(url.searchParams.get('event')).toBe('mixed');
  expect(url.searchParams.get('playerId')).toBe('59');
  expect(url.searchParams.get('page')).toBe('2');
  expect(MatchPageUrl(1, 20, '2026-09-01', '2027-08-31')).toContain('event=all&playerId=all');
});

test('concurrent singles and doubles queries share one request for the same period', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(summary) });
  const [singles, doubles] = await Promise.all([
    fetchElo('singles', '2025-09-01', '2026-08-31'),
    fetchElo('doubles', '2025-09-01', '2026-08-31'),
  ]);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/elo?start=2025-09-01&end=2026-08-31'), { method: 'GET' });
  expect(singles).toEqual(summary.singles);
  expect(doubles).toEqual(summary.doubles);
});

test('different periods do not share requests and later visits fetch fresh results', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(summary) });
  await Promise.all([
    fetchElo('singles', '2025-09-01', '2026-08-31'),
    fetchElo('doubles', '2023-09-01', '2024-08-31'),
  ]);
  expect(global.fetch).toHaveBeenCalledTimes(2);
  await fetchElo('singles', '2025-09-01', '2026-08-31');
  expect(global.fetch).toHaveBeenCalledTimes(3);
});

test('a failed request does not prevent a fresh retry', async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: false, status: 500 })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(summary) });
  await expect(fetchElo('singles', '2025-09-01', '2026-08-31')).rejects.toThrow('Elo request failed: 500');
  await expect(fetchElo('singles', '2025-09-01', '2026-08-31')).resolves.toEqual(summary.singles);
  expect(global.fetch).toHaveBeenCalledTimes(2);
});
