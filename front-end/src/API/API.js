const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })

console.log("DomainName: " + process.env.DomainName)

export const DomainName = process.env.DomainName;
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
