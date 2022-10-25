import { useBootstrapPrefix } from "react-bootstrap/esm/ThemeProvider"
import { AllMatchesUrl, CategoryId, CategoryUrl, MatchUrl, PlayerIdUrl, PlayerMatchesUrl, PlayersUrl, GetStatsUrl } from "../API/API"
import React from "react"
import { useState, useEffect } from "react"
import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses"
import Moment from "moment"

export const AppContext = React.createContext('')

const useApp = () => {
    const [players, setPlayers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [matches, setMatches] = useState([]);
    const [singlesRankings, setSinglesRankings] = useState([]);
    const [doublesRankings, setDoublesRankings] = useState([]);
    const [mixedRankings, setMixedRankings] = useState([]);

    useEffect(() => {
        fetch(PlayersUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => {
                data.sort((a,b) => (a.first_name > b.first_name) ? 1 : ((b.first_name > a.first_name) ? -1 : 0));
                setPlayers(data);
            });
    
        fetch(CategoryUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => { setCategories(data) })

        fetch(AllMatchesUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                var matchesDict = {};
                
                data.forEach((d) => {
                    var date_obj = Moment.utc(d.last_edit, "YYYY-MM-DD-HH:mm:ss", true).local()

                    var key = date_obj.clone().startOf('day').unix()
                    if (!(key in matchesDict)) {
                        matchesDict[key] = [];
                    }
                    matchesDict[key].push({date: date_obj, data: d});
                });
                
                for (var day in matchesDict) {
                    matchesDict[day].sort((a, b) => {
                        if (a.date.unix() > b.date.unix()) return -1
                        else if (a.date.unix() < b.date.unix()) return 1
                        else return 0
                    })
                }

                setMatches(matchesDict);
            });

        const getStats = (category) => {
            queryStats()
            .then(data => data.map(s => {
                let percentage = 0;
                let category_wins = category + '_wins';
                let category_losses = category + '_losses';
                if (s[category_wins] + s[category_losses] != 0) {
                    percentage = Math.round((s[category_wins] / (s[category_wins] + s[category_losses])) * 100);
                }
                return {
                    name: s.name,
                    percentage: percentage,
                    wins: s[category_wins],
                    losses: s[category_losses],
                }
            }))
            .then(results => {
                var items = Object.keys(results).map(function(key) {
                    return [key, results[key]];
                });
                items.sort(function(first, second) {
                    return second[1].percentage - first[1].percentage;
                });
                return items;
            })
            .then(res => { 
                if (category === 'singles') {
                    setSinglesRankings(res) 
                } else if (category === 'doubles') {
                    setDoublesRankings(res) 
                } else {
                    setMixedRankings(res) 
                }
            })
        };
        getStats('singles');
        getStats('doubles');
        getStats('mixed');
        
    }, []);

    const queryPlayerResults = (id) => fetch(PlayerMatchesUrl(id), { method: 'GET' }).then(response => response.json())

    const queryMatch = (id) => fetch(MatchUrl(id), { method: 'GET' }).then(response => response.json())

    const queryPlayer = (id) => fetch(PlayerIdUrl, { method: 'GET' }).then(response => response.json())

    const queryCategory = (id) => fetch(CategoryId, { method: 'GET' }).then(response => response.json())

    const queryStats = () => fetch(GetStatsUrl, { method: 'GET' }).then(response => response.json())


    return {
        //constants across app
        categories,
        players,
        matches,
        singlesRankings,
        doublesRankings,
        mixedRankings,

        //usable functions for app
        queryPlayerResults,
        queryMatch,
        queryPlayer,
        queryCategory,
        queryStats
    }
}

const AppContextProvider = ({ children }) => {
    return (
        <AppContext.Provider value={useApp()} >
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider