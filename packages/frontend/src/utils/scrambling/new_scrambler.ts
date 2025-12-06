import { randomScrambleForEvent } from "cubing/scramble";

export async function getScramble(event: string = "333") {
    return (await randomScrambleForEvent(event)).toString();
}