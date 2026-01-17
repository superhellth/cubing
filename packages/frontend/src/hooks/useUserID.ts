import { useState } from 'react';

export const useUserID = (storageKey: string = "userID"): string => {
    const [userID] = useState<string>(() => {
        if (typeof window === 'undefined') {
            return '';
        }

        let uID = localStorage.getItem(storageKey);

        if (!uID) {
            uID = crypto.randomUUID();
            localStorage.setItem(storageKey, uID);
        }

        return uID;
    });

    return userID;
};