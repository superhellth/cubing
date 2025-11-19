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

export const DISCIPLINE_LABELS = Object.entries(Discipline).map(([key, value]) => ({
    key: key,
    value: value,
}));

export interface ISolve {
    readonly id: number;
    readonly uuid: string;
    readonly discipline: Discipline;
    readonly session: string;
    readonly duration: number;
    readonly date: Date;
    readonly scramble: string;
    readonly status: Status;
    readonly avg5?: number | null;
    readonly avg12?: number | null;
}
export type INewSolve = Omit<ISolve, 'id'>;

export const SolveSchema = z.object({
    id: z.coerce.number().int(),
    uuid: z.uuid(),
    discipline: z.enum(Discipline),
    session: z.string(),
    duration: z.number(),
    date: z.coerce.date(),
    scramble: z.string(),
    status: z.enum(Status),
    avg5: z.number().nullable().optional(),
    avg12: z.number().nullable().optional(),
});
export const NewSolveSchema = SolveSchema.omit({ id: true });