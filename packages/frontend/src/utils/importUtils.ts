export async function csTimerFileToObject(file: any) {
    const text = await file.text();
    const data = JSON.parse(text);
    data.properties.sessionData = JSON.parse(data.properties.sessionData)
    data.properties.toolsfunc = JSON.parse(data.properties.toolsfunc)
    return data;
}