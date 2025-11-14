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
    TwoByTwo = "2x2",
    ThreeByThree = "3x3",
    FourByFour = "4x4",
    FiveByFive = "5x5",
    SixBySix = "6x6",
    SevenBySeven = "7x7",
    ThreeBlind = "3x3Blind",
    FourBlind = "4x4Blind",
    FiveBlind = "5x5Blind",
    OneHanded = "3x3OH",
    FewestMoves = "3x3FM",
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

// SELECT
//     id,
//     solve_time,
//     created_at,
//     -- This is the magic part:
//     AVG(solve_time) OVER (
//         PARTITION BY user_id
//         ORDER BY created_at
//         ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
//     ) AS rolling_average_of_5
// FROM
//     solves
// WHERE
//     user_id = 'some_user_id'
// ORDER BY
//     created_at DESC;