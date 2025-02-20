
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material';

// // Create the context
// const ThemeContext = createContext({
//   toggleTheme: () => {},
//   mode: 'light' as 'light' | 'dark',
// });

// // Hook to use the context
// export const useThemeContext = () => useContext(ThemeContext);

// // The provider component with type definition for `children`
// interface ThemeProviderProps {
//   children: React.ReactNode; // Type for children prop
// }

// export const ThemeProviderComponent: React.FC<ThemeProviderProps> = ({ children }) => {
//   const [mode, setMode] = useState<'light' | 'dark'>('light');

//   // Load the theme from localStorage on initial render
//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme');
//     if (storedTheme === 'dark' || storedTheme === 'light') {
//       setMode(storedTheme as 'light' | 'dark');
//     }
//   }, []); // Only run once when the component is mounted

//   // Update the theme in localStorage when it changes
//   useEffect(() => {
//     localStorage.setItem('theme', mode); // Save the mode to localStorage whenever it changes
//   }, [mode]);

//   // Toggle between light and dark mode
//   const toggleTheme = () => {
//     setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//   };

//   // Create the theme based on current mode
//   const theme = createTheme({
//     palette: {
//       mode,
//     },
//   });

//   return (
//     <ThemeContext.Provider value={{ toggleTheme, mode }}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </ThemeContext.Provider>
//   );
// };


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
