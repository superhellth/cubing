import { Discipline } from "@cubing/shared";

class ScrambleGenerator {
    private static readonly FACES = ["U", "D", "L", "R", "F", "B"];
    private static readonly MODIFIERS = ["", "'", "2"];

    constructor() {
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
            default:
                return "";
        }
        if (length > 0 && length < 100) {
            standardLength = length;
        }
        return this.generateSimpleScramble(standardLength, legalMoves);
    }

    private generateSimpleScramble(length: number, legalMoveTypes: string[]) {
        let scramble: string[] = [];
        let lastFace: string = "";
        while (scramble.length < length) {
            // 1. Pick a random face
            let face: string = ScrambleGenerator.FACES[Math.floor(Math.random() * ScrambleGenerator.FACES.length)];

            // 2. Check if it's the same as the last face
            if (face === lastFace) {
                continue;
            }

            // 3. Pick a random modifier and move type
            let modifier: string = ScrambleGenerator.MODIFIERS[Math.floor(Math.random() * ScrambleGenerator.MODIFIERS.length)];
            let moveType: string = legalMoveTypes[Math.floor(Math.random() * legalMoveTypes.length)];

            // 4. Add the move and update the last face
            let move: string;
            if (moveType === '3w') {
                move = `3${face}w${modifier}`;
            } else {
                move = `${face}${moveType}${modifier}`;
            }
            scramble.push(move);
            lastFace = face;
        }

        return scramble.join(" ");
    }
}

export default ScrambleGenerator;