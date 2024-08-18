import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ProfilePage } from './components/ProfilePage';


function App() {
    return (
        <Routes>
            <Route path="profile">
                <Route path=":playerID" element={<ProfilePage />} />
            </Route>
        </Routes>
    )
}

export default App;