import { ImportSource, type NewSolve } from "@cubing/shared";
import { useEffect, useState } from "react";
import { csTimerFileToSessions, cubicTimerFileToSessions } from "../utils/importUtils";
import { useUserID } from "./useUserID";

export interface Session {
    name: string;
    solveCount: number;
    solves: NewSolve[];
}

export const useExtractSessions = (file: any, importSource: ImportSource) => {
    const [extractedSessions, setExtractedSessions] = useState<Session[] | null>(null);
    const [error, setError] = useState(null);
    const uuid = useUserID();

    useEffect(() => {
        setError(null);
        setExtractedSessions(null);
        if (file == null) {
            return;
        }

        const loadSessionsFromFile = async () => {
            let sessions: Session[];
            switch (importSource) {
                case ImportSource.CubicTimer:
                    sessions = await cubicTimerFileToSessions(file, uuid);
                    break;
                case ImportSource.CsTimer:
                    // ensure unique session names
                    sessions = await csTimerFileToSessions(file, uuid);
            }
            setExtractedSessions(sessions);
        }

        loadSessionsFromFile().catch((error) => {setError(error)});
    }, [file, importSource])

    return { sessions: extractedSessions, error: error };
}