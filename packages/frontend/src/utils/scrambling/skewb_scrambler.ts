type SkewbMove = 'R' | 'L' | 'U' | 'B';
type Suffix = "'" | "";

class SkewbScrambler {
    private static readonly moves: SkewbMove[] = ['R', 'L', 'U', 'B'];
    private readonly length: number;

    constructor(length: number = 25) {
        this.length = length;
    }

    public generateScramble(): string {
        const scramble: string[] = [];
        let lastMove: SkewbMove | null = null;

        while (scramble.length < this.length) {
            const move = this.getRandomMove();

            if (move === lastMove) {
                continue;
            }

            const suffix = this.getRandomSuffix();
            scramble.push(`${move}${suffix}`);
            lastMove = move;
        }

        return scramble.join(' ');
    }
    private getRandomMove(): SkewbMove {
        const index = Math.floor(Math.random() * SkewbScrambler.moves.length);
        return SkewbScrambler.moves[index];
    }

    private getRandomSuffix(): Suffix {
        return Math.random() < 0.5 ? "'" : "";
    }

}
export default SkewbScrambler;