import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReportMatchComponent from '../components/ReportMatch';
import Header from '../components/Header';
import LandingPage from '../components/LandingPage';
import ResultsPage from '../components/Results';
import Admin from '../components/Admin/Admin';
import Players from '../components/Players';


const MainRouter = () => {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route exact path='/' element={LandingPage()} />
                    <Route exact path='/report' element={ReportMatchComponent()} />
                    <Route exact path='/results' element={ResultsPage()} />
                    <Route exact path='/admin' element={Admin()} />
                    <Route exact path='/players' element={Players()} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainRouter;