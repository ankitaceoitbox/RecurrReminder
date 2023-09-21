import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.form;
const api = `${URL}/${endPoints}`;
const headers = {
    'Accept': 'application/json', // Specify the desired response format
    'Content-Type': 'application/json', // Specify the request body format
};
export const ContactFormSubmit = (formData) => {
    const { commonFields, emailFields, whatsappFields, isEmailChecked, isWAChecked } = formData;
    const finalData = new FormData();
    finalData.append("startDate", commonFields.startDate);
    finalData.append("day", commonFields.day);
    finalData.append("every", commonFields.every);
    finalData.append("frequency", commonFields.frequency);
    finalData.append("skipHolidays", commonFields.skipHolidays);
    finalData.append("sendTime", commonFields.sendTime);
    finalData.append("name", commonFields.name);
    finalData.append("company", commonFields.company);
    finalData.append("endDate", commonFields.endsOnDate);
    finalData.append("isActiveWA", isWAChecked);
    finalData.append("isActiveEmail", isEmailChecked);
    finalData.append("mobile", whatsappFields.mobileOrGroupID);
    finalData.append("waMessage", whatsappFields.waMessage);
    finalData.append("WaAttachement", whatsappFields.attachment);
    finalData.append("email", emailFields.emailIDTo);
    finalData.append("cc", emailFields.emailIDCc,);
    finalData.append("bcc", emailFields.emailIDBCc);
    finalData.append("emailSubject", emailFields.subjectLine);
    finalData.append("emailBody", emailFields.mailBodyHTML);
    return httpservice.post(api, finalData, { headers, withCredentials: true });
}
