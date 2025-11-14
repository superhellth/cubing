import { Status, type ISolve } from "@cubing/shared";
import { useEffect, useRef, useState } from "react";

function SolveDetailsScreen({ solve, isOpen, onClose, onDeleteSolve }: { solve: ISolve, isOpen: Boolean, onClose: Function, onDeleteSolve: Function }) {
    const [selectedStatus, setSelectedStatus] = useState<Status>(solve.status);
    const dialogRef = useRef(null);
    const date: Date = new Date(solve.date);
    const longFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        const dialogNode: any = dialogRef.current;
        if (!dialogNode) {
            return;
        }

        if (isOpen) {
            dialogNode.showModal();
        } else {
            dialogNode.close();
        }
    }, [isOpen]);

    return (
        <dialog ref={dialogRef}>
            <div style={{ width: "600px", height: "400px" }}>
                <button onClick={() => onClose()}>Close</button>
                <h1>Solve {solve.id}</h1>
                <p>Scramble: {solve.scramble}</p>
                <p>Date: {longFormatter.format(date)}</p>
                <fieldset>
                    <legend>Solve Status:</legend>
                    {[Status.DNF, Status.PlusTwo, Status.Valid].map((status) => (
                        <label key={status} >
                            <input
                                type="radio"
                                name="fruit"
                                value={status}
                                checked={selectedStatus === status}
                                onChange={(event) => { setSelectedStatus(status) }} /> {status}
                        </label>))}
                </fieldset>
                <button onClick={() => onDeleteSolve(solve.id)}>Delete</button>
            </div>
        </dialog>
    );
}

export default SolveDetailsScreen;