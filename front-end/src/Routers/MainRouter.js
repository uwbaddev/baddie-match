import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import V2ReportMatch from '../components/ReportMatch';
import V2LandingPage from '../components/LandingPage';
import V2ResultsPage from '../components/Results';
import V2Players from '../components/Players';
import V2EloPage from '../components/EloPage';
import PlayerProfile from '../components/PlayerProfile';
import LegacyLandingPage from '../components/legacy/LegacyLandingPage';
import LegacyReportMatch from '../components/legacy/LegacyReportMatch';
import LegacyResults from '../components/legacy/LegacyResults';
import LegacyPlayers from '../components/legacy/LegacyPlayers';
import LegacyEloPage from '../components/legacy/LegacyEloPage';


const MainRouter = () => {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route exact path='/' element={<LegacyLandingPage />} />
                    <Route exact path='/report' element={<LegacyReportMatch />} />
                    <Route exact path='/results' element={<LegacyResults />} />
                    <Route exact path='/players' element={<LegacyPlayers />} />
                    <Route exact path='/elo' element={<LegacyEloPage />} />
                    <Route exact path='/v2' element={<V2LandingPage />} />
                    <Route exact path='/v2/report' element={<V2ReportMatch />} />
                    <Route exact path='/v2/results' element={<V2ResultsPage />} />
                    <Route exact path='/v2/players' element={<V2Players />} />
                    <Route exact path='/v2/elo' element={<V2EloPage />} />
                    <Route exact path='/v2/players/:season/id/:id' element={<PlayerProfile />} />
                    <Route exact path='/v2/players/:season/:slug' element={<PlayerProfile />} />
                    <Route exact path='/v2/players/:id' element={<PlayerProfile />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainRouter;
