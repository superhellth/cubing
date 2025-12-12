export function getTrafficLightColor(ratio: number) {

    const clamped = Math.max(0, Math.min(1, ratio));
    const RED = "#ff0000";
    const YELLOW = "#ffff00";
    const GREEN = "#00ff00";

    if (clamped < 0.5) {
        return interpolateColor(RED, YELLOW, clamped * 2);
    } else {
        return interpolateColor(YELLOW, GREEN, (clamped - 0.5) * 2);
    }
}

export function interpolateColor(color1: string, color2: string, ratio: number): string {
    const hex = (color: string) => {
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);
        return [r, g, b];
    };

    const [r1, g1, b1] = hex(color1);
    const [r2, g2, b2] = hex(color2);

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    const toHex = (n: number) => {
        const hexStr = n.toString(16);
        return hexStr.length === 1 ? '0' + hexStr : hexStr;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}