import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import { useRoutes } from './routes';
import AppContext from './shared/contexts/AppContext';
import { useMediaQuery } from './shared/hooks/mediaQuery';
import { useAppStateValue } from './state/AppStateProvider';

function App() {
  const [, dispatch] = useAppStateValue();
  const routes = useRoutes(false);

  const mobile = useMediaQuery();

  useEffect(() => {
    fetch('mock/baits.json')
      .then((response) => response.json())
      .then((baits) => {
        dispatch({ type: 'SET_BAITS', payload: { baits } });
      });

    fetch('mock/places.json')
      .then((response) => response.json())
      .then((places) => {
        dispatch({ type: 'SET_PLACES', payload: { places } });
      });
  }, [dispatch]);

  return (
    <AppContext.Provider value={{ isMobile: mobile }}>
      <div className="app-wrapper">
        <Router>
          <Header />
          <div className="router-container">{routes}</div>
        </Router>
      </div>
    </AppContext.Provider>
  );
}

export default App;
