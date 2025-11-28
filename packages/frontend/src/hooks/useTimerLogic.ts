import { Discipline, inspectionlessDisciplines } from '@cubing/shared';
import { useCallback, useEffect, useState } from 'react';
import { TimerStatus } from '../components/timer/TimerText';

export const useTimerLogic = (settings: any, selectedDiscipline: Discipline) => {
    const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.Idle);
    const [readySince, setReadySince] = useState<number>(-1);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.code === 'Space') {
            event.preventDefault();
            switch (timerStatus) {
                case TimerStatus.Running:
                    setTimerStatus(TimerStatus.Idle);
                    break;
                case TimerStatus.Idle:
                case TimerStatus.Cancelled:
                case TimerStatus.InspectionCancelled:
                    if (settings.inspection && !inspectionlessDisciplines.includes(selectedDiscipline)) {
                        setTimerStatus(TimerStatus.ReadyForInspection);
                    } else {
                        setTimerStatus(TimerStatus.Ready);
                    }
                    setReadySince(Date.now());
                    break;
                case TimerStatus.Inspecting:
                    setTimerStatus(TimerStatus.Ready);
                    setReadySince(Date.now());
                    break;
            }
        } else if (event.key === 'Escape') {
            switch (timerStatus) {
                case TimerStatus.Running:
                    setTimerStatus(TimerStatus.Cancelled);
                    event.preventDefault();
                    break;
                case TimerStatus.Inspecting:
                    setTimerStatus(TimerStatus.InspectionCancelled);
                    event.preventDefault();
                    break;
            }
        }
    }, [timerStatus, settings]);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        if (event.code === 'Space') {
            switch (timerStatus) {
                case TimerStatus.Ready:
                    event.preventDefault();
                    if (Date.now() - readySince > settings.readyAfter) {
                        setTimerStatus(TimerStatus.Running);
                    } else {
                        if (settings.inspection) {
                            setTimerStatus(TimerStatus.Inspecting);
                        } else {

                            setTimerStatus(TimerStatus.Idle);
                            setReadySince(-1);
                        }
                    }
                    break;
                case TimerStatus.ReadyForInspection:
                    event.preventDefault();
                    console.log(settings.readyAfter)
                    if (Date.now() - readySince > settings.readyAfter) {
                        setTimerStatus(TimerStatus.Inspecting);
                    } else {
                        setTimerStatus(TimerStatus.Idle);
                        setReadySince(-1);
                    }
                    break;
            }
        }
    }, [timerStatus, readySince, settings]);

    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown, handleKeyUp]);

    return { timerStatus };
};