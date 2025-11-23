import { Discipline } from '@cubing/shared';

export const EVENTS_AND_DISCIPLINES = [
    ["222", Discipline.TwoByTwo],
    ["333", Discipline.ThreeByThree],
    ["444", Discipline.FourByFour],
    ["555", Discipline.FiveByFive],
    ["666", Discipline.SixBySix],
    ["777", Discipline.SevenBySeven],
    ["333oh", Discipline.OneHanded],
    //, ["333fm", Discipline.FewestMoves]
    ["333bf", Discipline.ThreeBlind],
    ["444bf", Discipline.FourBlind],
    ["555bf", Discipline.FiveBlind],
    ["clock", Discipline.Clock],
    ["pyram", Discipline.Pyraminx],
    ["minx", Discipline.Megaminx],
    ["skewb", Discipline.Skewb],
    ["sq1", Discipline.Square1]
] as const;