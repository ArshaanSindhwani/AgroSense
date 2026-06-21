import {createContext, useContext, useState} from "react"
import {useColorScheme} from "../hooks/useColorScheme"

const ThemeContext = createContext()

export function ThemeProvider({children}){
    const systemScheme = useColorScheme()
    const [override, setOverride] = useState(null)

    let isDark
    if (override !== null) {
        isDark = override
    } else {
        isDark = systemScheme === "dark"
    }

    let colorScheme
    if (isDark) {
        colorScheme = "dark"
    } else {
        colorScheme = "light"
    }

    function toggleTheme() {
        setOverride(prev => {
            if (prev === null) 
                return systemScheme !== "dark"
            return !prev
        })
    }

    return (
        <ThemeContext.Provider value={{isDark, colorScheme, toggleTheme}}>{children}</ThemeContext.Provider>
    )
}

export function useTheme(){
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within ThemeProvider')
        return context
}