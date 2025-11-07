import Timer from "./timer";

function TimeDisplay({times}) {
    return (
        <div>
            <h1>Your Solves</h1>
            
            <h3>Mean of 3: {times.length >= 3 ? Timer.formatTime(Timer.getAvg(times.slice(-3))) : ""} </h3>
            <h3>Avg. of 5: {times.length >= 5 ? Timer.formatTime(Timer.getFilteredAvg(times.slice(-5))) : ""} </h3>
            <h3>Avg. of 12: {times.length >= 12 ? Timer.formatTime(Timer.getFilteredAvg(times.slice(-12))) : ""} </h3>
            {times.map((time: number, index: number) => (
                    <p key={index}>{Timer.formatTime(time)}</p>
                ))}
        </div>
    );
}

export default TimeDisplay;