import { Discipline } from "@cubing/shared";
import ClockScrambler from "./clock_scrambler";
import PyraminxScrambler from "./pyraminx_scrambler";
import CubeScrambler from "./cube_scrambler";
import MegaminxScrambler from "./megaminx_scrambler";
import SkewbScrambler from "./skewb_scrambler";
import Square1Scrambler from "./square1_scrambler";

class Scrambler {
    private readonly cubeScrambler;
    private readonly clockScrambler;
    private readonly pyraminxScrambler;
    private readonly megaminxScrambler;
    private readonly skewbScrambler;
    private readonly square1Scrambler;

    constructor() {
        this.cubeScrambler = new CubeScrambler();
        this.clockScrambler = new ClockScrambler();
        this.pyraminxScrambler = new PyraminxScrambler();
        this.megaminxScrambler = new MegaminxScrambler();
        this.skewbScrambler = new SkewbScrambler();
        this.square1Scrambler = new Square1Scrambler();
    }

    public generateScramble(discipline: Discipline = Discipline.ThreeByThree, length: number = -1): string {
        let standardLength: number = -1;
        let legalMoves: string[] = [""];
        switch (discipline) {
            case Discipline.TwoByTwo:
                standardLength = 11;
                break;
            case Discipline.ThreeBlind:
            case Discipline.OneHanded:
            case Discipline.FewestMoves:
            case Discipline.ThreeByThree:
                standardLength = 20;
                break;
            case Discipline.FourBlind:
            case Discipline.FourByFour:
                standardLength = 40;
                legalMoves = ["", "w"];
                break;
            case Discipline.FiveBlind:
            case Discipline.FiveByFive:
                standardLength = 60;
                legalMoves = ["", "w"];
                break;
            case Discipline.SixBySix:
                standardLength = 80;
                legalMoves = ["", "w", "3w"];
                break;
            case Discipline.SevenBySeven:
                standardLength = 100;
                legalMoves = ["", "w", "3w"];
                break;
            case Discipline.Clock:
                return this.clockScrambler.generateScramble();
            case Discipline.Pyraminx:
                return this.pyraminxScrambler.generateScramble();
            case Discipline.Megaminx:
                return this.megaminxScrambler.generateScramble();
            case Discipline.Skewb:
                return this.skewbScrambler.generateScramble();
            case Discipline.Square1:
                return this.square1Scrambler.generateScramble();
            default:
                return "";
        }
        if (length > 0 && length < 100) {
            standardLength = length;
        }
        return this.cubeScrambler.generateScramble(standardLength, legalMoves);
    }

}

export default Scrambler;