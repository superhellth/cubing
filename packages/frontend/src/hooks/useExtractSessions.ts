import { ImportSource, type StatlessSolve } from "@cubing/shared";
import { useEffect, useState } from "react";
import { csTimerFileToObject } from "../utils/importUtils";

export interface Session {
    name: string;
    solveCount: number;
    solves: StatlessSolve[];
}

export const useExtractSessions = (file: any, importSource: ImportSource) => {
    const [extractedSessions, setExtractedSessions] = useState<Session[] | null>(null);

    useEffect(() => {
        if (file == null) {
            setExtractedSessions(null);
            return;
        }
        const loadSessionsFromFile = async () => {
            let data: any;
            switch (importSource) {
                case ImportSource.CsTimer:
                default:
                    // ensure unique session names
                    data = await csTimerFileToObject(file);
            }
            const sessionData = data.properties.sessionData;
            const relevantSessions: any[] = [];
            Object.entries(sessionData).forEach(([key, value]: any) => {
                if (value.stat && value.stat[0] > 0) {
                    relevantSessions.push({ name: value.name, count: value.stat[0], solves: data["session" + key] });
                }
            })
            if (relevantSessions.length > 0) {
                setExtractedSessions(relevantSessions);
            }
        }
        loadSessionsFromFile();
    }, [file, importSource])

    return extractedSessions;
}