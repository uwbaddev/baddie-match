export const DomainName = process.env.REACT_APP_DOMAIN_NAME
export const MatchUrl = (id) => `${DomainName}/match/${id}`
export const ReportMatchUrl = `${DomainName}/match`
export const CategoryUrl = `${DomainName}/categories`;
export const PlayersUrl = `${DomainName}/players`
export const AllMatchesUrl = `${DomainName}/matches/all`;
export const PlayerMatchesUrl = (id, start, end) => {
  const query = start && end ? `?start=${start}&end=${end}` : '';
  return `${DomainName}/match/player/${id}${query}`;
}
export const PlayerIdUrl = (id) => `${DomainName}/player/${id}`
export const CategoryId = (id) => `${DomainName}/category/${id}`
export const CreatePlayerUrl = `${DomainName}/player`;
export const GetStatsUrl = (start, end) => `${DomainName}/players/stats?start=${start}&end=${end}`
export const EloUrl = (event, start, end) => `${DomainName}/elo/${event}?start=${start}&end=${end}`
const pendingEloRequests = new Map();

export const fetchElo = (event, start, end) => {
  const url = `${DomainName}/elo?start=${start}&end=${end}`;
  // Share concurrent singles/doubles requests, but fetch fresh results on later visits.
  if (!pendingEloRequests.has(url)) {
    const pending = fetch(url, { method: 'GET' })
      .then(response => {
        if (!response.ok) throw new Error(`Elo request failed: ${response.status}`);
        return response.json();
      })
      .finally(() => pendingEloRequests.delete(url));
    pendingEloRequests.set(url, pending);
  }
  return pendingEloRequests.get(url).then(results => results[event]);
};

export const MatchPageUrl = (page, perPage,start,end,event = 'all') => `${DomainName}/matches?page=${page}&perPage=${perPage}&start=${start}&end=${end}&event=${encodeURIComponent(event)}`
export const GetMatchesCount = `${DomainName}/matches/count`
