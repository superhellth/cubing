export function getDisplayableDate(date: Date) {
    const longFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return longFormatter.format(date);
}