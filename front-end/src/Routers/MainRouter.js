import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import LandingPage from '../components/LandingPage';
import ReportMatchComponent from '../components/ReportMatch';
import ResultsPage from '../components/Results';
import Players from '../components/Players';
import EloPage from '../components/EloPage';
import V2Header from '../v2/components/Header';
import V2ReportMatch from '../v2/components/ReportMatch';
import V2LandingPage from '../v2/components/LandingPage';
import V2ResultsPage from '../v2/components/Results';
import V2Players from '../v2/components/Players';
import V2EloPage from '../v2/components/EloPage';
import PlayerProfile from '../v2/components/PlayerProfile';

const RouteHeader = () => {
    const location = useLocation();
    const isV2 = location.pathname === '/v2' || location.pathname.startsWith('/v2/');

    return isV2 ? <V2Header /> : <Header />;
};

const MainRouter = () => {
    return (
        <>
            <BrowserRouter>
                <RouteHeader />
                <Routes>
                    <Route exact path='/' element={<LandingPage />} />
                    <Route exact path='/report' element={<ReportMatchComponent />} />
                    <Route exact path='/results' element={<ResultsPage />} />
                    <Route exact path='/players' element={<Players />} />
                    <Route exact path='/elo' element={<EloPage />} />
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
