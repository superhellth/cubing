class ClockScrambler {
    private static readonly FRONT_MOVES: string[] = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL"];
    private static readonly BACK_MOVES: string[] = ["U", "R", "D", "L", "ALL"];

    constructor() {
    }

    public generateScramble(): string {
        const scrambleParts: string[] = [];

        ClockScrambler.FRONT_MOVES.forEach(move => {
            scrambleParts.push(`${move}${this.getRandomTurn()}`);
        });

        scrambleParts.push("y2");

        ClockScrambler.BACK_MOVES.forEach(move => {
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
}

export default ClockScrambler;