import Discipline from "./diciplines";

class Solve {
    private timeInMs: number;
    private date: number;
    private scramble: string;
    private discipline: Discipline;

    constructor(timeInMs: number);
    constructor(timeInMs: number, date: number = Date.now(), scramble: string = "", discipline: Discipline = Discipline.ThreeByThree) {
        this.date = date;
        this.timeInMs = timeInMs;
        this.scramble = scramble;
        this.discipline = discipline;
    }

}