import { Discipline, inspectionlessDisciplines } from '@cubing/shared';
import { useCallback, useEffect, useState } from 'react';
import { TimerStatus } from '../components/timer/TimerText';
import { useTimerSettings } from './TimerSettingsContext';

export const useTimerLogic = (selectedDiscipline: Discipline) => {
    const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.Idle);
    const [readySince, setReadySince] = useState<number>(-1);
    const { settings } = useTimerSettings();

    const onPressDown = useCallback(() => {
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
    }, [timerStatus, settings, selectedDiscipline]);

    const onPressUp = useCallback(() => {
        if (timerStatus !== TimerStatus.Ready && timerStatus !== TimerStatus.ReadyForInspection) return;

        const timeHeld = Date.now() - readySince;

        if (timeHeld > settings.readyAfter) {
            if (timerStatus === TimerStatus.ReadyForInspection) {
                setTimerStatus(TimerStatus.Inspecting);
            } else {
                setTimerStatus(TimerStatus.Running);
            }
        } else {
            setTimerStatus(TimerStatus.Idle);
            setReadySince(-1);
        }
    }, [timerStatus, readySince, settings]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                event.preventDefault();
                if (!event.repeat) onPressDown();
            } else if (event.key === 'Escape') {
                if (timerStatus === TimerStatus.Running) setTimerStatus(TimerStatus.Cancelled);
                if (timerStatus === TimerStatus.Inspecting) setTimerStatus(TimerStatus.InspectionCancelled);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'Space') onPressUp();
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [onPressDown, onPressUp, timerStatus]);

    return {
        timerStatus,
        timerHandlers: {
            onTouchStart: (e: React.TouchEvent) => {
                if (e.cancelable && timerStatus !== TimerStatus.Idle) e.preventDefault();
                onPressDown();
            },
            onTouchEnd: (_e: React.TouchEvent) => {
                onPressUp();
            },
            onMouseDown: (e: React.MouseEvent) => {
                if (e.button === 0 && settings.clickToTime) onPressDown();
            },
            onMouseUp: (e: React.MouseEvent) => {
                if (e.button === 0 && settings.clickToTime) onPressUp();
            }
        }
    };
};