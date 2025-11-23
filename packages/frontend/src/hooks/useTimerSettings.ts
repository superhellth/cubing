import { useState } from "react";

const defaultSettings = {
    inspection: false,
    readyAfter: 200,
    averageGraphXAxis: 'date'
};

export const useTimerSettings = () => {
    const [settings, setSettings] = useState(() => {
        try {
            const item = localStorage.getItem("appSettings");
            return item ? JSON.parse(item) : defaultSettings;
        } catch (error) {
            console.error(error);
            return defaultSettings;
        }
    });

    const updateSetting = (key: string, value: any) => {
        try {
            setSettings((prev: any) => ({ ...prev, [key]: value }));
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    };

    return {settings, updateSetting}
}