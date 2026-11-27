import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from '../v2/components/Header';
import ReportMatch from '../v2/components/ReportMatch';
import LandingPage from '../v2/components/LandingPage';
import ResultsPage from '../v2/components/Results';
import Players from '../v2/components/Players';
import EloPage from '../v2/components/EloPage';
import PlayerProfile from '../v2/components/PlayerProfile';

// v2 used to live under /v2; keep old links and bookmarks working.
const LegacyV2Redirect = () => {
    const location = useLocation();
    const pathname = location.pathname.replace(/^\/v2(?=\/|$)/, '') || '/';
    return <Navigate to={`${pathname}${location.search}${location.hash}`} replace />;
};

const MainRouter = () => {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route exact path='/' element={<LandingPage />} />
                    <Route exact path='/report' element={<ReportMatch />} />
                    <Route exact path='/results' element={<ResultsPage />} />
                    <Route exact path='/players' element={<Players />} />
                    <Route exact path='/elo' element={<EloPage />} />
                    <Route exact path='/players/:season/id/:id' element={<PlayerProfile />} />
                    <Route exact path='/players/:season/:slug' element={<PlayerProfile />} />
                    <Route exact path='/players/:id' element={<PlayerProfile />} />
                    <Route path='/v2/*' element={<LegacyV2Redirect />} />
                    <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainRouter;
