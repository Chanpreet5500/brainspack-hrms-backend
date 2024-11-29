export function parseDateString(dateString: string): Date {
    dateString = dateString.toString()
    const [year, month, date] = dateString.split('/').map(Number);
    const formateddate = new Date(year, month - 1, date + 1)
    return formateddate;
}