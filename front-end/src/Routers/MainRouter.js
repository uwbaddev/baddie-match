import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReportMatchComponent from '../components/ReportMatch';
import Header from '../components/Header';

const MainRouter = () => {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route exact path='/' element={ReportMatchComponent()}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default MainRouter;