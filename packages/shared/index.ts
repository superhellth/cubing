import { z } from "zod";

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
export const inspectionlessDisciplines: Discipline[] = [Discipline.ThreeBlind, Discipline.FourBlind, Discipline.FiveBlind, Discipline.FewestMoves];

export const DISCIPLINE_LABELS = Object.entries(Discipline).map(([key, value]) => ({
    key: key,
    value: value,
}));

export const keyToLabels = {
    duration: "Single",
    pb: "PB",
    avg5: "Ao5",
    avg12: "Ao12",
    avg100: "Ao100",
    avg1000: "Ao1000"
};

export function getGrossDuration(netDuration: number, status: Status) {
    let grossDuration: number | null = netDuration;
    if (status === Status.PlusTwo) {
        grossDuration += 2000;
    } else if (status === Status.DNF) {
        grossDuration = null;
    }
    return grossDuration;
}

function computeGrossDuration<T extends z.infer<typeof NewSolveSchema>>(solve: T) {
    return { ...solve, grossDuration: getGrossDuration(solve.duration, solve.status) };
};

export const NewSolveSchema = z.object({
    uuid: z.uuid(),
    discipline: z.enum(Discipline),
    session: z.string(),
    duration: z.number(),
    date: z.coerce.date(),
    scramble: z.string(),
    status: z.enum(Status),
});
export const NewSolvesArraySchema = z.array(NewSolveSchema);
export type NewSolve = z.infer<typeof NewSolveSchema>;

const BaseStatlessSolveSchema = z.object({
    ...NewSolveSchema.shape,
    pk: z.coerce.bigint(),
    id: z.coerce.number(),
});
export const StatlessSolveSchema = BaseStatlessSolveSchema.transform(computeGrossDuration);
export const StatlessSolvesArraySchema = z.array(StatlessSolveSchema);
export type StatlessSolve = z.infer<typeof StatlessSolveSchema>;

const SolveStatsSchema = z.object({
    avg5: z.number().nullable().optional(),
    avg12: z.number().nullable().optional(),
    avg100: z.number().nullable().optional(),
    avg1000: z.number().nullable().optional(),
    pb: z.number(),
});
export type SolveStats = z.infer<typeof SolveStatsSchema>;
export const SOLVE_STATS_KEYS: (keyof SolveStats)[] = ["avg5", "avg12", "avg100", "avg1000", "pb"]

const BaseSolveSchema = z.object({
    ...BaseStatlessSolveSchema.shape,
    ...SolveStatsSchema.shape,
    newPB: z.boolean()
});
export const SolveSchema = BaseSolveSchema.transform(computeGrossDuration);
export type Solve = z.infer<typeof SolveSchema>;