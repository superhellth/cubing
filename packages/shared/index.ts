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


export const SolveSchema = z.object({
    pk: z.coerce.bigint(),
    id: z.coerce.number(),
    uuid: z.uuid(),
    discipline: z.enum(Discipline),
    session: z.string(),
    duration: z.number(),
    date: z.coerce.date(),
    scramble: z.string(),
    status: z.enum(Status),
    avg5: z.number().optional(),
    avg12: z.number().optional(),
    avg100: z.number().optional(),
    avg1000: z.number().optional(),
    newPB: z.boolean().optional(),
    pb: z.number().optional()
});

export const NewSolveSchema = SolveSchema.omit({ id: true, pk: true });

export type ISolve = z.infer<typeof SolveSchema>;
export type INewSolve = z.infer<typeof NewSolveSchema>;