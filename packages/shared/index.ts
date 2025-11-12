export interface IUser {
    readonly username: string;
    readonly createdAt: Date;
}

export interface ISolve {
    readonly username: string;
    readonly timeInMs: number;
    readonly date: Date;
    readonly scramble: string;
    readonly id: number;
    discipline: Discipline;
}

export enum Discipline {
    ThreeByThree,
    FourByFour,
    OneHanded,
}