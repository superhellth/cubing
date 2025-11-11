export interface IUser {
    username: string;
    createdAt: Date;
}

export interface ISolve {
    user: string,
    timeInMs: number;
    date: number;
    scramble: string;
    discipline: Discipline;
}

export enum Discipline {
    ThreeByThree,
    FourByFour,
    Onehanded,
}