import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReportMatchComponent from '../components/ReportMatch';
import Header from '../components/Header';
import LandingPage from '../components/LandingPage';
import ResultsPage from '../components/Results';
import Players from '../components/Players';
import EloPage from '../components/EloPage';
import PlayerProfile from '../components/PlayerProfile';


const MainRouter = () => {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route exact path='/' element={LandingPage()} />
                    <Route exact path='/report' element={ReportMatchComponent()} />
                    <Route exact path='/results' element={ResultsPage()} />
                    <Route exact path='/players' element={Players()} />
                    <Route exact path='/elo' element={EloPage()} />
                    <Route exact path='/players/:season/:slug' element={<PlayerProfile />} />
                    <Route exact path='/players/:id' element={<PlayerProfile />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainRouter;
