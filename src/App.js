// App.js
import { useState, useEffect, createContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme';
import Routes from './Routes';

export const UserContext = createContext({
  userSession: null,
  updateUserSession: () => {},
});

function App() {
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const fetchUserAuth = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/isAuth');
        if (!res.ok) return setLoading(false);

        setUserSession(await res.json());
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('There was an error fetching auth', error);
      }
    };
    fetchUserAuth();
  }, []);

  const updateUserSession = (newUserSession) => {
    setUserSession(newUserSession);
  };

  return (
    <UserContext.Provider value={{ userSession, updateUserSession }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading ? <>Loading...</> : <Routes />}
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;

