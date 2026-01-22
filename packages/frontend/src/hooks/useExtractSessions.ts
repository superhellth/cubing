import { ImportSource, type NewSolve } from "@cubing/shared";
import { useEffect, useState } from "react";
import { csTimerFileToSessions, cubicTimerFileToSessions } from "../utils/importUtils";
import { useUserID } from "./useUserID";

export interface Session {
    name: string;
    solveCount: number;
    solves: NewSolve[];
}

export const useExtractSessions = (file: any, importSource: ImportSource): Session[] | null => {
    const [extractedSessions, setExtractedSessions] = useState<Session[] | null>(null);
    const uuid = useUserID();

    useEffect(() => {
        if (file == null) {
            setExtractedSessions(null);
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
        loadSessionsFromFile();
    }, [file, importSource])

    return extractedSessions;
}