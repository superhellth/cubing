import { Discipline } from "@cubing/shared";
import { useLocalStorage } from "./useLocalStorage"; // Import your utility
import { createContext, useContext, type ReactNode } from "react";

const defaultSettings = {
    inspection: false,
    hideElementsWhileSolving: false,
    readyAfter: 200,
    avgGraphXAxis: 'id',
    avgGraphDisplay: ["duration", "avg5", "avg12"],
    avgGraphNumSolves: 50,
    lastStatDiscipline: Discipline.ThreeByThree,
    clickToTime: false,
};

interface TimerSettingsContextType {
    settings: typeof defaultSettings;
    updateSetting: (key: keyof typeof defaultSettings, value: any) => void;
}

const TimerSettingsContext = createContext<TimerSettingsContextType | undefined>(undefined);

export const TimerSettingsProvider = ({ children }: { children: ReactNode }) => {
    const [storedSettings, setStoredSettings] = useLocalStorage("appSettings", defaultSettings);

    const settings = { ...defaultSettings, ...storedSettings };

    const updateSetting = (key: keyof typeof defaultSettings, value: any) => {
        setStoredSettings((prev: any) => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <TimerSettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </TimerSettingsContext.Provider>
    );
}

export const useTimerSettings = () => {
    const context = useContext(TimerSettingsContext);
    if (!context) {
        throw new Error("useTimerSettings must be used within a TimerSettingsProvider");
    }
    return context;
};