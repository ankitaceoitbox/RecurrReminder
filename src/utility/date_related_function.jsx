export function getOccurrenceSuffix(occurrence) {
    if (occurrence >= 11 && occurrence <= 13) {
        return 'th';
    }
    switch (occurrence % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

export const DayFrequencyFormat = ({ date }) => {
    const dd = new Date(date);
    const occurence = getOccurrenceInMonth(dd);
    const format = getOccurrenceSuffix(occurence); // st,nd,rd
    const weekDayName = getDayOfWeek(dd);
    const formattedText = `Every ${occurence}<sup>${format}</sup> ${weekDayName} Of Month`
    return (
        <div dangerouslySetInnerHTML={{ __html: formattedText }} />
    );
}

export const DayDateFrequencyFormat = ({ date }) => {
    const dd = new Date(date);
    const format = getOccurrenceSuffix(dd.getDate());
    const formattedText = `Every ${dd.getDate()}<sup>${format}</sup> Date Of Month`;
    return (
        <div dangerouslySetInnerHTML={{ __html: formattedText }} />
    );
}

export const getDayOfWeek = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}

export const getOccurrenceInMonth = (date) => {
    const targetDayOfWeek = date.getDay();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    // Calculate the difference between the target day and the first day of the month
    let difference = targetDayOfWeek - firstDayOfWeek;
    if (difference < 0) difference += 7;

    // Calculate the occurrence
    const occurrence = Math.floor((date.getDate() - difference) / 7) + 1;
    return occurrence;
}

export function createDateWithTime(desiredTime) {
    const desiredDate = new Date();  // Get the current date
    // Split the time string into hours, minutes, and period (AM/PM)
    const [hours, minutes] = desiredTime.split(":").map(parseFloat);
    const isPM = desiredTime.includes("PM");
    // Adjust hours for PM
    if (isPM && hours !== 12) {
        hours += 12;
    }
    // Set the time in the Date object
    desiredDate.setHours(hours);
    desiredDate.setMinutes(minutes);
    desiredDate.setSeconds(0);  // Optional: Set seconds to 0 if needed
    return desiredDate;
}