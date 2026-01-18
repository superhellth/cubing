import { createContext, useContext, type ReactNode } from 'react';
import { Discipline } from "@cubing/shared";
import { useSolveManager } from '../hooks/solves/useSolveManager';

type SolveContextType = ReturnType<typeof useSolveManager>;

const SolveContext = createContext<SolveContextType | null>(null);

interface SolveProviderProps {
    children: ReactNode;
    selectedDiscipline: Discipline;
    selectedSession: string;
}

export const SolveProvider = ({
    children,
    selectedDiscipline,
    selectedSession
}: SolveProviderProps) => {
    const solveData = useSolveManager(selectedDiscipline, selectedSession);

    return (
        <SolveContext.Provider value={solveData}>
            {children}
        </SolveContext.Provider>
    );
};

export const useSolves = () => {
    const context = useContext(SolveContext);

    if (!context) {
        throw new Error("useSolves must be used within a SolveProvider");
    }

    return context;
};