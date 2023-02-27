import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

export const ThemeContext = React.createContext({
  toggleTheme: (isDark: boolean) => {},
  isDark: false,
});

type ThemeType = {
  colors: {
    backgroundColor: string;
    panelBackgroundColor: string;
    flatBackgroundColor: string;
    flatTextColor: string;
    fontColor: string;
    tabDefaultFontColor: string;
    tabActiveFontColor: string;
  };
};

const THEMES: { LIGHT: ThemeType; DARK: ThemeType } = {
  LIGHT: {
    colors: {
      backgroundColor: "white",
      panelBackgroundColor: "white",
      flatBackgroundColor: "rgba(15,206,137,0.8)",
      flatTextColor: "white",
      fontColor: "black",
      tabDefaultFontColor: "#7e7e7e", 
      tabActiveFontColor: "black"
    },
  },
  DARK: {
    colors: {
      backgroundColor: "#313131",
      panelBackgroundColor: "#838383",
      flatBackgroundColor: "rgba(15,206,137,0.8)",
      flatTextColor: "white",
      fontColor: "white",
      tabDefaultFontColor: "#dadada",
      tabActiveFontColor: "black"
    },
  },
};

export const ThemeContextProvider = ({ children }: { children: any }) => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
  }, []);

  const toggleTheme = (isDark: boolean) => {
    setIsDark(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDark }}>
      <ThemeProvider theme={{ isDark, ...THEMES[isDark ? "DARK" : "LIGHT"] }}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
