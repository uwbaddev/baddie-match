import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
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

export const V1_BASE_PATH = '/v1';

const isV1Path = (pathname) => pathname === V1_BASE_PATH || pathname.startsWith(`${V1_BASE_PATH}/`);

const RouteHeader = () => {
    const location = useLocation();
    return isV1Path(location.pathname) ? <Header /> : <V2Header />;
};

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
                <RouteHeader />
                <Routes>
                    <Route exact path='/' element={<V2LandingPage />} />
                    <Route exact path='/report' element={<V2ReportMatch />} />
                    <Route exact path='/results' element={<V2ResultsPage />} />
                    <Route exact path='/players' element={<V2Players />} />
                    <Route exact path='/elo' element={<V2EloPage />} />
                    <Route exact path='/players/:season/id/:id' element={<PlayerProfile />} />
                    <Route exact path='/players/:season/:slug' element={<PlayerProfile />} />
                    <Route exact path='/players/:id' element={<PlayerProfile />} />
                    <Route exact path={V1_BASE_PATH} element={<LandingPage />} />
                    <Route exact path={`${V1_BASE_PATH}/report`} element={<ReportMatchComponent />} />
                    <Route exact path={`${V1_BASE_PATH}/results`} element={<ResultsPage />} />
                    <Route exact path={`${V1_BASE_PATH}/players`} element={<Players />} />
                    <Route exact path={`${V1_BASE_PATH}/elo`} element={<EloPage />} />
                    <Route path='/v2/*' element={<LegacyV2Redirect />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainRouter;
