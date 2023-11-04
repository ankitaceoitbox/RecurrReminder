export function areEmailsValid(emails) {
    if (emails === '') {
        return true;
    }
    emails = emails.split(",");
    // Regular expression for a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every((email) => emailRegex.test(email));
}

export function isValidEmail(email) {
    if (email === '') {
        return true;
    }
    // Regular expression for a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}

