type Suffix = '++' | '--';
type UMove = "U" | "U'";

class MegaminxScrambler {

    constructor() {
    }

    public generateScramble(): string {
        const scrambleLines: string[] = [];

        for (let i = 0; i < 7; i++) {
            scrambleLines.push(this.generateLine());
        }

        return scrambleLines.join('\n');
    }

    private getRandomSuffix(): Suffix {
        return Math.random() < 0.5 ? '++' : '--';
    }

    private getRandomUMove(): UMove {
        return Math.random() < 0.5 ? "U" : "U'";
    }

    private generateLine(): string {
        let line = '';

        for (let i = 0; i < 5; i++) {
            const rMove = `R${this.getRandomSuffix()}`;
            const dMove = `D${this.getRandomSuffix()}`;
            line += `${rMove} ${dMove} `;
        }

        line += this.getRandomUMove();
        return line;
    }
}

export default MegaminxScrambler;