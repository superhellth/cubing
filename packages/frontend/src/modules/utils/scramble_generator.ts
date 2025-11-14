class ScrambleGenerator {
    private static readonly FACES = ["U", "D", "L", "R", "F", "B"];
    private static readonly MODIFIERS = ["", "'", "2"];

    constructor() {
    }

    public generateScramble(length = 20): string {
        let scramble: string[] = [];
        let lastFace: string = "";

        while (scramble.length < length) {
            // 1. Pick a random face
            let face: string = ScrambleGenerator.FACES[Math.floor(Math.random() * ScrambleGenerator.FACES.length)];

            // 2. Check if it's the same as the last face
            if (face === lastFace) {
                continue; // If so, try again
            }

            // 3. Pick a random modifier
            let modifier: string = ScrambleGenerator.MODIFIERS[Math.floor(Math.random() * ScrambleGenerator.MODIFIERS.length)];

            // 4. Add the move and update the last face
            scramble.push(face + modifier);
            lastFace = face;
        }

        return scramble.join(" ");
    }
}

export default ScrambleGenerator;