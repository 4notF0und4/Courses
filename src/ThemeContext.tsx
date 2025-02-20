import React, { createContext, useState, useEffect, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';


const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: 'light' as 'light' | 'dark',
});


export const useThemeContext = () => useContext(ThemeContext);


interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProviderComponent: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
   
    const storedTheme = localStorage.getItem('theme');
    console.log('Retrieved theme from localStorage:', storedTheme);
    return storedTheme === 'dark' ? 'dark' : 'light'; 
  });

 
  useEffect(() => {
    console.log('Saving theme to localStorage:', mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

  
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      console.log('Toggling theme:', newMode);
      return newMode;
    });
  };

 
  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
