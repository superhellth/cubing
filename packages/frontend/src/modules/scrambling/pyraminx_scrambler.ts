type BodyAxis = 'U' | 'L' | 'R' | 'B';
type TipAxis = 'u' | 'l' | 'r' | 'b';
type Direction = "" | "'";

class PyraminxScrambler {
    private static readonly BODY_AXES: BodyAxis[] = ['U', 'L', 'R', 'B'];
    private static readonly TIP_AXES: TipAxis[] = ['u', 'l', 'r', 'b'];

    constructor() {
    }

    public generateScramble(): string {
        const body = this.generateBodyMoves();
        const tips = this.generateTipMoves();

        return [...body, ...tips].join(" ");
    }

    private generateBodyMoves(): string[] {
        const moves: string[] = [];
        let lastAxis: BodyAxis | null = null;

        for (let i = 0; i < 11; i++) {
            let availableAxes = PyraminxScrambler.BODY_AXES.filter(axis => axis !== lastAxis);

            const randomAxis = availableAxes[Math.floor(Math.random() * availableAxes.length)];
            const direction = this.getRandomDirection();

            moves.push(`${randomAxis}${direction}`);
            lastAxis = randomAxis;
        }

        return moves;
    }

    private generateTipMoves(): string[] {
        const tips: string[] = [];

        PyraminxScrambler.TIP_AXES.forEach(axis => {
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

export default PyraminxScrambler;