import { CategoryUrl, PlayerMatchesUrl, PlayersUrl, GetStatsUrl, fetchElo as queryElo, MatchPageUrl } from "../API/API"
import React from "react"
import { useState, useEffect, useCallback } from "react"

export const AppContext = React.createContext('')

const useApp = () => {
    const [players, setPlayers] = useState([]);
    const [activePlayers, setActivePlayers] = useState([]);
    const [categories, setCategories] = useState([]);


    useEffect(() => {

        fetch(PlayersUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => (a.first_name > b.first_name) ? 1 : ((b.first_name > a.first_name) ? -1 : 0));
                setPlayers(data);
                // elegible_year -1 = retired; guests (is_guest) stay selectable so their matches can be reported
                setActivePlayers(data.filter((p) => p.elegible_year >= 0 || p.is_guest));
            });

        fetch(CategoryUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => { setCategories(data) })
    }, []);

    const queryPlayerResults = useCallback((id, start, end) => fetch(PlayerMatchesUrl(id, start, end), { method: 'GET' }).then(response => response.json()), [])

    const queryStats = useCallback((start, end) => fetch(GetStatsUrl(start, end), { method: 'GET' }).then(response => response.json()), [])

    const queryMatchPage = useCallback((id, perPage, start, end, event, playerId) => fetch(MatchPageUrl(id, perPage, start, end, event, playerId), { method: 'GET' }).then(response => response.json()), [])

    return {
        //constants across app
        categories,
        players,
        activePlayers,

        //usable functions for app
        queryPlayerResults,
        queryStats,
        queryElo,
        queryMatchPage,
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
