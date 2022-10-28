import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReportMatchComponent from '../components/ReportMatch';
import Header from '../components/Header';
import LandingPage from '../components/LandingPage';
import ResultsPage from '../components/Results';
import Admin from '../components/Admin/Admin';


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
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainRouter;