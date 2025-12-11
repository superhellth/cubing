import { Discipline } from "@cubing/shared";
import { useLocalStorage } from "./useLocalStorage"; // Import your utility

const defaultSettings = {
    inspection: false,
    hideElementsWhileSolving: false,
    readyAfter: 200,
    avgGraphXAxis: 'id',
    avgGraphDisplay: ["avg5", "avg12"],
    avgGraphNumSolves: 50,
    lastStatDiscipline: Discipline.ThreeByThree
};

export const useTimerSettings = () => {
    const [storedSettings, setStoredSettings] = useLocalStorage("appSettings", defaultSettings);
    const settings = { ...defaultSettings, ...storedSettings };
    
    const updateSetting = (key: keyof typeof defaultSettings, value: any) => {
        setStoredSettings((prev: any) => ({
            ...prev,
            [key]: value
        }));
    };

    return { settings, updateSetting };
}