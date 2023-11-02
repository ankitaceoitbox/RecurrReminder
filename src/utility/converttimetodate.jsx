function setTimeToAMPM(time) {
    if (!time) {
        return;
    }
    // Extract hours, minutes, and AM/PM from the time string
    let [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    // Adjust hours for PM times
    if (ampm === 'PM' && hours < 12) {
        hours += 12;
    }
    // Create a new Date object and set the time
    const timeInDateObject = new Date();
    timeInDateObject.setHours(hours);
    timeInDateObject.setMinutes(minutes);
    timeInDateObject.setSeconds(0); // Optional: Set seconds to 0
    return timeInDateObject;
}

export default setTimeToAMPM;