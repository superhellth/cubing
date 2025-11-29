import { useState } from "react";

const defaultSettings = {
    inspection: false,
    readyAfter: 200,
    avgGraphXAxis: 'id',
    avgGraphDisplay: ["avg5", "avg12"],
    avgGraphNumSolves: 50
};

export const useTimerSettings = () => {
    const [settings, setSettings] = useState(() => {
        try {
            const item = localStorage.getItem("appSettings");
            return item ? { ...defaultSettings, ...JSON.parse(item) } : defaultSettings;
        } catch (error) {
            console.error(error);
            return defaultSettings;
        }
    });

    const updateSetting = (key: string, value: any) => {
        setSettings((prev: any) => {
            const newSettings = { ...prev, [key]: value };
            try {
                localStorage.setItem("appSettings", JSON.stringify(newSettings));
            } catch (error) {
                console.error("Failed to save settings to LocalStorage", error);
            }

            return newSettings;
        });
    };

    return { settings, updateSetting }
}