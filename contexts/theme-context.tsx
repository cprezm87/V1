"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "dark" | "light"
type Language = "en" | "es"

interface ThemeContextType {
  theme: Theme
  language: Language
  toggleTheme: () => void
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const defaultTranslations = {
  en: {
    "app.name": "OpacoVault",
    "nav.home": "Home",
    "preview.visitWebsite": "Visit Website",
    "preview.openInNewTab": "Open in new tab",
  },
  es: {
    "app.name": "OpacoVault",
    "nav.home": "Inicio",
    "preview.visitWebsite": "Visitar Sitio Web",
    "preview.openInNewTab": "Abrir en nueva pestaña",
  },
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  language: "en",
  toggleTheme: () => {},
  setLanguage: () => {},
  t: (key: string) => key,
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
      document.documentElement.classList.toggle("light", savedTheme === "light")
    } else {
      // Default to dark theme
      document.documentElement.classList.add("dark")
    }

    // Load language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    document.documentElement.classList.toggle("light", newTheme === "light")
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Translation function
  const t = (key: string) => {
    return defaultTranslations[language]?.[key] || defaultTranslations.en?.[key] || key
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        language,
        toggleTheme,
        setLanguage,
        t,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
