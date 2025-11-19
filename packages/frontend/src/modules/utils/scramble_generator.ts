import { Discipline } from "@cubing/shared";

// Clock
type TurnDirection = '+' | '-';
type PinState = 'U' | 'd';

// Pyraminx
type BodyAxis = 'U' | 'L' | 'R' | 'B';
type TipAxis = 'u' | 'l' | 'r' | 'b';
type Direction = "" | "'";

interface ClockMove {
    pins: string[];
    amount: number;
    direction: TurnDirection;
}

class ScrambleGenerator {
    private static readonly FACES = ["U", "D", "L", "R", "F", "B"];
    private static readonly MODIFIERS = ["", "'", "2"];
    private static readonly MOVES_ORDER: string[] = [
        "UR DR DL UL",
        "UR",
        "DR",
        "DL",
        "UL",
        "UR DR",
        "UR DR DL"
    ];
    private static readonly BODY_AXES: BodyAxis[] = ['U', 'L', 'R', 'B'];
    private static readonly TIP_AXES: TipAxis[] = ['u', 'l', 'r', 'b'];

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
            case Discipline.Clock:
                return this.generateClockScramble();
            case Discipline.Pyraminx:
                return this.generatePyraminxScramble();
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
            let face: string = ScrambleGenerator.FACES[Math.floor(Math.random() * ScrambleGenerator.FACES.length)];

            if (face === lastFace) {
                continue;
            }
            let modifier: string = ScrambleGenerator.MODIFIERS[Math.floor(Math.random() * ScrambleGenerator.MODIFIERS.length)];
            let moveType: string = legalMoveTypes[Math.floor(Math.random() * legalMoveTypes.length)];

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

    public generatePyraminxScramble(): string {
        const body = this.generateBodyMoves();
        const tips = this.generateTipMoves();

        return [...body, ...tips].join(" ");
    }

    public generateClockScramble(): string {
        const scrambleParts: string[] = [];
        const frontMoves = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL"];

        frontMoves.forEach(move => {
            scrambleParts.push(`${move}${this.getRandomTurn()}`);
        });

        scrambleParts.push("y2");
        const backMoves = ["U", "R", "D", "L", "ALL"];

        backMoves.forEach(move => {
            scrambleParts.push(`${move}${this.getRandomTurn()}`);
        });

        const finalPins = this.getRandomPins();
        if (finalPins) {
            scrambleParts.push(finalPins);
        }

        return scrambleParts.join(" ");
    }

    private getRandomPins(): string {
        const pins = ['UR', 'DR', 'DL', 'UL'];
        const states = pins.map(pin => {
            return Math.random() < 0.5 ? pin : '';
        }).filter(p => p !== '').join(' ');

        return states;
    }

    private getRandomTurn(): string {
        const amount = Math.floor(Math.random() * 6) + 1;
        const direction = Math.random() < 0.5 ? '+' : '-';
        return `${amount}${direction}`;
    }

    private generateBodyMoves(): string[] {
        const moves: string[] = [];
        let lastAxis: BodyAxis | null = null;

        for (let i = 0; i < 11; i++) {
            let availableAxes = ScrambleGenerator.BODY_AXES.filter(axis => axis !== lastAxis);

            const randomAxis = availableAxes[Math.floor(Math.random() * availableAxes.length)];
            const direction = this.getRandomDirection();

            moves.push(`${randomAxis}${direction}`);
            lastAxis = randomAxis;
        }

        return moves;
    }

    private generateTipMoves(): string[] {
        const tips: string[] = [];

        ScrambleGenerator.TIP_AXES.forEach(axis => {
            const rand = Math.random();

            if (rand < 0.33) {
                tips.push(axis);
            } else if (rand < 0.66) {
                tips.push(`${axis}'`);
            }
        });

        return tips;
    }

    private getRandomDirection(): Direction {
        return Math.random() < 0.5 ? "" : "'";
    }

}

export default ScrambleGenerator;