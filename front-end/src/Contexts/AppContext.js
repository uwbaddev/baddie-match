import { useBootstrapPrefix } from "react-bootstrap/esm/ThemeProvider"
import { CategoryUrl } from "../API/API"
import React from "react"
import { useState, useEffect } from "react"

export const AppContext = React.createContext('')

const useApp = () => {
    const [players, setPlayers] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('https://baddie-match.herokuapp.com/players')
            .then(res => res.json())
            .then(data => {
                setPlayers(data);
            });
        fetch(CategoryUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => { setCategories(data) })
    }, []);



    return {
        categories,
        players
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