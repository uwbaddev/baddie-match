import { useBootstrapPrefix } from "react-bootstrap/esm/ThemeProvider"
import { AllMatchesUrl, CategoryId, CategoryUrl, MatchUrl, PlayerIdUrl, PlayerMatchesUrl, PlayersUrl } from "../API/API"
import React from "react"
import { useState, useEffect } from "react"
import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses"

export const AppContext = React.createContext('')

const useApp = () => {
    const [players, setPlayers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetch(PlayersUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => { setPlayers(data); console.log('hi'); console.log(data) });

        fetch(CategoryUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => { setCategories(data) })

        fetch(AllMatchesUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => setMatches(data));

    }, []);

    const queryPlayerResults = (id) => fetch(PlayerMatchesUrl(id), { method: 'GET' }).then(response => response.json())

    const queryMatch = (id) => fetch(MatchUrl(id), { method: 'GET' }).then(response => response.json())

    const queryPlayer = (id) => fetch(PlayerIdUrl, { method: 'GET' }).then(response => response.json())

    const queryCategory = (id) => fetch(CategoryId, { method: 'GET' }).then(response => response.json())


    return {
        //constants across app
        categories,
        players,
        matches,

        //usable functions for app
        queryPlayerResults,
        queryMatch,
        queryPlayer,
        queryCategory
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