export function calculateTotalDay(startDate: Date, endDate: Date) {
    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}