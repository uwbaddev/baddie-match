export const DomainName = process.env.REACT_APP_DOMAIN_NAME || "https://baddie-match.herokuapp.com/api";
export const MatchUrl = (id) => `${DomainName}/match/${id}`
export const ReportMatchUrl = `${DomainName}/match`
export const CategoryUrl = `${DomainName}/categories`;
export const PlayersUrl = `${DomainName}/players`
export const AllMatchesUrl = `${DomainName}/matches`;
export const PlayerMatchesUrl = (id) => `${DomainName}/match/player/${id}`
export const PlayerIdUrl = (id) => `${DomainName}/player/${id}`
export const CategoryId = (id) => `${DomainName}/category/${id}`
export const CreatePlayerUrl = `${DomainName}/player`;
export const GetStatsUrl = `${DomainName}/players/stats`
export const EloUrl = (event) => `${DomainName}/elo/${event}`
export const MatchPageUrl = (page) => `${DomainName}/matches/${page}`
export const GetMatchesCount = `${DomainName}/matches/count`
