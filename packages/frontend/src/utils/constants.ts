import { Discipline } from '@cubing/shared';

export const EVENT_AND_DISCIPLINES_MAP = new Map<Discipline, string>([
    [Discipline.TwoByTwo, "222"],
    [Discipline.ThreeByThree, "333"],
    [Discipline.FourByFour, "444"],
    [Discipline.FiveByFive, "555"],
    [Discipline.SixBySix, "666"],
    [Discipline.SevenBySeven, "777"],
    [Discipline.OneHanded, "333oh"],
    // [Discipline.FewestMoves, "333fm"],
    [Discipline.ThreeBlind, "333bf"],
    [Discipline.FourBlind, "444bf"],
    [Discipline.FiveBlind, "555bf"],
    [Discipline.Clock, "clock"],
    [Discipline.Pyraminx, "pyram"],
    [Discipline.Megaminx, "minx"],
    [Discipline.Skewb, "skewb"],
    [Discipline.Square1, "sq1"]
]);

export const EVENT_TO_SCRAMBLE_KEY = new Map<Discipline, string>([
    [Discipline.TwoByTwo, "222"],
    [Discipline.ThreeByThree, "333"],
    [Discipline.FourByFour, "444"],
    [Discipline.FiveByFive, "555"],
    [Discipline.SixBySix, "666"],
    [Discipline.SevenBySeven, "777"],
    [Discipline.OneHanded, "333"],
    // [Discipline.FewestMoves, "333fm"],
    [Discipline.ThreeBlind, "333"],
    [Discipline.FourBlind, "444"],
    [Discipline.FiveBlind, "555"],
    [Discipline.Clock, "clock"],
    [Discipline.Pyraminx, "pyram"],
    [Discipline.Megaminx, "minx"],
    [Discipline.Skewb, "skewb"],
    [Discipline.Square1, "sq1"]
]);