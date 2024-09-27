export function parseDateString(dateString: string): Date {
    dateString = dateString.toString()
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day + 1)
    return date;
}