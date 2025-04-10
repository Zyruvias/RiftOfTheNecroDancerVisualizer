import { createContext } from "react"

export const defaultSettings = {
    showEnemyImages: true,
    showBeatNumber: true,
    hitSplatSize: 5,
    showVibePath: true,
    useReducedMotion: false,
    vibePowerShadingColor: "rgba(255, 255, 0, 0.25)",
    hitSplatVibeColor: "#FFAA00",
    hitSplatColor: "#0000FF"
}

export const SettingsContext = createContext({
    options: defaultSettings,
    setOptions: (callback): void => {}
})