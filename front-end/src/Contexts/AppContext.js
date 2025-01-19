import { useBootstrapPrefix } from "react-bootstrap/esm/ThemeProvider"
import { AllMatchesUrl, CategoryId, CategoryUrl, MatchUrl, PlayerIdUrl, PlayerMatchesUrl, PlayersUrl, GetStatsUrl, EloUrl, MatchPageUrl } from "../API/API"
import React from "react"
import { useState, useEffect } from "react"
import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses"
import Moment from "moment"
import { getOverlayDirection } from "react-bootstrap/esm/helpers"

export const AppContext = React.createContext('')

const useApp = () => {
    const [players, setPlayers] = useState([]);
    const [activePlayers, setActivePlayers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [singlesRankings, setSinglesRankings] = useState([]);
    const [doublesRankings, setDoublesRankings] = useState([]);
    const [mixedRankings, setMixedRankings] = useState([]);
    const [singlesElo, setSinglesElo] = useState([]);
    const [doublesElo, setDoublesElo] = useState([]);


    useEffect(() => {

        fetch(PlayersUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => {
                console.error(data)
                data.sort((a, b) => (a.first_name > b.first_name) ? 1 : ((b.first_name > a.first_name) ? -1 : 0));
                setPlayers(data);
                setActivePlayers(data.filter((p) => p.elegible_year >= 0));
            });

        fetch(CategoryUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => { setCategories(data) })

        // getStats('singles');
        // getStats('doubles');
        // getStats('mixed');


        getElo('singles');
        getElo('doubles');
    }, []);

    const getElo = (event,start,end) => {
        queryElo(event,start,end)
            .then(data => {
                if (event === 'singles') {
                    setSinglesElo(data);

                } else {
                    setDoublesElo(data);
                }
            })
    };

    const queryPlayerResults = (id) => fetch(PlayerMatchesUrl(id), { method: 'GET' }).then(response => response.json())

    const queryMatch = (id) => fetch(MatchUrl(id), { method: 'GET' }).then(response => response.json())

    const queryPlayer = (id) => fetch(PlayerIdUrl, { method: 'GET' }).then(response => response.json())

    const queryCategory = (id) => fetch(CategoryId, { method: 'GET' }).then(response => response.json())

    const queryStats = (start, end) => fetch(GetStatsUrl(start, end), { method: 'GET' }).then(response => response.json())

    const queryElo = (event, start, end) => fetch(EloUrl(event, start, end), { method: 'GET' }).then(response => response.json())

    const queryMatchPage = (id, perPage, start, end) => fetch(MatchPageUrl(id, perPage, start, end), { method: 'GET' }).then(response => response.json())

    return {
        //constants across app
        categories,
        players,
        activePlayers,
        singlesRankings,
        doublesRankings,
        mixedRankings,
        singlesElo,
        doublesElo,

        //usable functions for app
        queryPlayerResults,
        queryMatch,
        queryPlayer,
        queryCategory,
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