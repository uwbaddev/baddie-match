export const DomainName = "https://baddie-match.herokuapp.com";
export const MatchUrl = (id) => `${DomainName}/results/${id}`
export const ReportUrl = `${DomainName}/report`
export const CategoryUrl = `${DomainName}/categories`;
export const PlayersUrl = `${DomainName}/players`
export const AllMatchesUrl = `${DomainName}/matches`;
export const PlayerMatchesUrl = (id) => `${DomainName}/match/player/${id}`
export const PlayerIdUrl = (id) => `${DomainName}/player/${id}`
export const CategoryId = (id) => `${DomainName}/category/${id}`