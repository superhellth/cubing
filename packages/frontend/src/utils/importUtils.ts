export async function extractCsTimerSession(file: any) {
    const text = await file.text();
    const data = JSON.parse(text);
    data.properties.sessionData = JSON.parse(data.properties.sessionData)
    data.properties.toolsfunc = JSON.parse(data.properties.toolsfunc)
    console.log(data)
}

function extractSessions(str: string) {
    const result: any = {};

    // Regex Explanation:
    // "(session\d+)"     -> Capture the key (e.g., session2)
    // :                  -> Match the colon
    // (\[.*?\])          -> Capture the array value (non-greedy)
    // (?=,"session|,"prop) -> Lookahead: Stop when we see the next key or "properties"

    const regex = /"(session\d+)":(\[.*?\])(?=,"(?:session|properties))/g;

    const matches = str.matchAll(regex);

    for (const match of matches) {
        const key = match[1];
        const valueStr = match[2];

        try {
            result[key] = JSON.parse(valueStr);
        } catch (e) {
            console.error(`Could not parse data for ${key}`);
            result[key] = valueStr;
        }
    }

    return result;
}

// const filePath = path.join(__dirname, 'myfile.txt');
// const data = fs.readFileSync(filePath, 'utf-8');
// const sessions = extractSessions(rawString);
// console.log(sessions);