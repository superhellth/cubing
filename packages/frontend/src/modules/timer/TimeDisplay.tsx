import type Solve from "../api/solve";
import Timer from "./timer";

function TimeDisplay({ solves, deleteSolve }: { solves: Solve[], deleteSolve: Function }) {
    return (
        <div style={{ backgroundColor: "blue", display: "flex", flexDirection: "column", height: "100%" }}>

            <div style={{ flex: 1 }}>
                <h1 style={{ margin: 0 }}>Your Solves</h1>

                <h3>Mean of 3: {solves.length >= 3 ? Timer.formatTime(Timer.getAvg(solves.slice(-3))) : ""} </h3>
                <h3>Avg. of 5: {solves.length >= 5 ? Timer.formatTime(Timer.getFilteredAvg(solves.slice(-5))) : ""} </h3>
                <h3>Avg. of 12: {solves.length >= 12 ? Timer.formatTime(Timer.getFilteredAvg(solves.slice(-12))) : ""} </h3>
            </div>

            <div style={{ backgroundColor: "black", flex: 2, overflow: "auto" }}>
                <table className="w-full text-left divide-y divide-gray-700">
                    <thead className="sticky top-0 bg-gray-800 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                                Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                                Scramble
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-gray-900">
                        {solves.map((solve) => (
                            <tr key={solve.id} className="hover:bg-gray-800 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {solve.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-white">
                                    {Timer.formatTime(solve.timeInMs)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400 truncate max-w-xs">
                                    {solve.scramble}
                                </td>
                                <td>
                                    <button onClick={() => { deleteSolve(solve.id) }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* <div className="border border-green-300 max-h-96 overflow-y-auto background black">
                {solves.map((solve: Solve, index: number) => (
                    <p key={index}>{Timer.formatTime(solve.timeInMs)}</p>
                ))}
            </div> */}

        </div>
    );
}

export default TimeDisplay;