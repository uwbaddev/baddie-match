import './App.css';
import MainRouter from './Routers/MainRouter';
import AppContextProvider from './Contexts/AppContext';

function App() {
  return (
    <>
      <AppContextProvider>
        <MainRouter />
      </AppContextProvider>
    </>
  );
}

export default App;
