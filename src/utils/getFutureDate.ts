export function getFutureDate(days: number, date: Date) {
    const daysToSeconds = days * 24 * 60 * 60 * 1000
    const dateInSecons = date.getTime()
    const futureDate = new Date(daysToSeconds + dateInSecons)
    return futureDate
}