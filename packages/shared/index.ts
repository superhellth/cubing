export interface IUser {
    readonly username: string;
    readonly id: string;
    readonly createdAt: Date;
}

export interface ISolve {
    readonly uuid: string;
    readonly duration: number;
    readonly date: Date;
    readonly scramble: string;
    readonly id: number;
    readonly discipline: Discipline;
    readonly session: string;
    status: Status;
    setStatus(status: Status): void;
}

export enum Status {
    Valid = "Valid",
    PlusTwo = "+2",
    DNF = "DNF"
}

export enum Discipline {
    TwoByTwo = "2x2",
    ThreeByThree = "3x3",
    FourByFour = "4x4",
    FiveByFive = "5x5",
    SixBySix = "6x6",
    SevenBySeven = "7x7",
    ThreeBlind = "3x3 Blind",
    FourBlind = "4x4 Blind",
    FiveBlind = "5x5 Blind",
    OneHanded = "3x3 OH",
    FewestMoves = "3x3 FM",
    Clock = "Clock",
    Megaminx = "Megaminx",
    Pyraminx = "Pyraminx",
    Skewb = "Skewb",
    Square1 = "Square-1",
}

export const DISCIPLINE_LABELS = Object.entries(Discipline).map(([key, value]) => ({
    key: key,
    value: value,
}));