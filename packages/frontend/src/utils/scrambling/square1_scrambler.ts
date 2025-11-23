class Square1Scrambler {
    private readonly length: number;

    constructor(length: number = 12) {
        this.length = length;
    }
    public generateScramble(): string {
        const scramble: string[] = [];

        for (let i = 0; i < this.length; i++) {
            scramble.push(this.generateMovePair());
        }

        return scramble.join(' ').slice(0, -1);
    }

    private getRandomLayerMove(): number {
        return Math.floor(Math.random() * 12) - 5;
    }

    private generateMovePair(): string {
        let top = 0;
        let bottom = 0;

        do {
            top = this.getRandomLayerMove();
            bottom = this.getRandomLayerMove();
        } while (top === 0 && bottom === 0);

        return `(${top}, ${bottom}) /`;
    }
}

export default Square1Scrambler;