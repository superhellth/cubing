import { useState, useEffect } from 'react';
import DBReader from '../services/dbReader';

const dbReader = DBReader.instance;

export const useBackendHealth = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            const status = await dbReader.checkHealth();
            setIsOnline(status);
        };
        checkStatus();
        const interval = setInterval(checkStatus, 20000);
        return () => clearInterval(interval);
    }, []);

    return isOnline;
};