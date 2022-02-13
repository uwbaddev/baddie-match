import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReportMatchComponent from '../components/ReportMatch';
import Header from '../components/Header';
import LandingPage from '../components/LandingPage';
import ResultsPage from '../components/Results';

const MainRouter = () => {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route exact path='/' element={LandingPage()}></Route>
                    <Route exact path='/report' element={ReportMatchComponent()} />
                    <Route exact path='results' element={ResultsPage()} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainRouter;