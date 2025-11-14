import type Solve from "../api/solve";
import Timer from "./timer";

function TimeDisplay({ solves, deleteSolve, openSolveDetailsScreen, avg5s, avg12s }:
    { solves: Solve[], deleteSolve: Function, openSolveDetailsScreen: Function, avg5s: (number | null)[], avg12s: (number | null)[] }) {
    const filteredAvg5s: number[] = avg5s.filter((item): item is number => item !== null);
    const filteredAvg12s: number[] = avg12s.filter((item): item is number => item !== null);
    return (
        <div style={{ backgroundColor: "blue", display: "flex", flexDirection: "column", height: "100%" }}>

            <div style={{ flex: 1 }}>
                <h1 style={{ margin: 0 }}>Your Solves</h1>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Best</th>
                            <th>Current</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Single</td>
                            <td>{solves.length >= 1 ? Timer.formatTime(Math.min(...solves.map(solve => solve.duration))) : ""}</td>
                            <td>{solves.length >= 1 ? Timer.formatTime(solves[0].duration) : ""}</td>
                        </tr>
                        <tr>
                            <td>Mean of 3</td>
                            <td>{solves.length >= 3 ? "TBI" : ""}</td>
                            <td>{solves.length >= 3 ? Timer.formatTime(Timer.getAvg(solves.slice(-3))) : ""}</td>
                        </tr>
                        <tr>
                            <td>Avg. of 5</td>
                            <td>{solves.length >= 5 ? Timer.formatTime(Math.min(...filteredAvg5s)) : ""}</td>
                            <td>{solves.length >= 5 ? Timer.formatTime(avg5s[0]) : ""}</td>
                        </tr>
                        <tr>
                            <td>Avg. of 12</td>
                            <td>{solves.length >= 12 ? Timer.formatTime(Math.min(...filteredAvg12s)) : ""}</td>
                            <td>{solves.length >= 12 ? Timer.formatTime(avg12s[0]) : ""}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ backgroundColor: "black", flex: 2, overflow: "auto" }}>
                <table>
                    <thead>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>
                                Time
                            </th>
                            <th>
                                Avg5
                            </th>
                            <th>
                                Avg12
                            </th>
                            {/* <th>
                                Disc.
                            </th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {solves.map((solve, index) => (
                            <tr key={solve.id} onClick={() => openSolveDetailsScreen(solve)}>
                                <td>
                                    {solves.length - index}
                                </td>
                                <td>
                                    {Timer.formatTime(solve.duration)}
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400 truncate max-w-xs">
                                    {solve.scramble}
                                </td> */}
                                <td>
                                    {Timer.formatTime(avg5s[index])}
                                </td>
                                <td>
                                    {Timer.formatTime(avg12s[index])}
                                </td>
                                {/* <td>
                                    {solve.discipline}
                                </td> */}
                                {/* <td>
                                    <button onClick={() => { deleteSolve(solve.id) }}>Delete</button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TimeDisplay;