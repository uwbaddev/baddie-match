export function getDomainName() {
    if (process.env.REACT_APP_DOMAIN_NAME !== 'undefined') {
        return process.env.REACT_APP_DOMAIN_NAME
    } else  {
        return "https://app-production-4e43.up.railway.app/api"
    }
}

export const DomainName = "https://app-production-4e43.up.railway.app/api";
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
