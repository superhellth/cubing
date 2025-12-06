class CubeScrambler {
    private static readonly FACES = ["U", "D", "L", "R", "F", "B"];
    private static readonly AXES = ["U", "F", "R"];
    private static readonly MODIFIERS = ["", "'", "2"];

    constructor() {
    }

    public generateScramble(length: number, legalMoveTypes: string[]) {
        let scramble: string[] = [];
        let lastFace: string = "";
        while (scramble.length < length) {
            // let 
            let face: string = CubeScrambler.FACES[Math.floor(Math.random() * CubeScrambler.FACES.length)];

            if (face === lastFace) {
                continue;
            }
            let modifier: string = CubeScrambler.MODIFIERS[Math.floor(Math.random() * CubeScrambler.MODIFIERS.length)];
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
}

export default CubeScrambler;