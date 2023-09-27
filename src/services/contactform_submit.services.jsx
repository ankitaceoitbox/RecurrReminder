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
    const finalData = {};
    finalData["startDate"] = commonFields.startDate;
    finalData["day"] = commonFields.day;
    finalData["every"] = commonFields.every;
    finalData["frequency"] = commonFields.frequency;
    finalData["skipHolidays"] = commonFields.skipHolidays;
    finalData["sendTime"] = commonFields.sendTime;
    finalData["name"] = commonFields.name;
    finalData["company"] = commonFields.company;
    finalData["endDate"] = commonFields.endsOnDate;
    finalData["isActiveWA"] = isWAChecked;
    finalData["isActiveEmail"] = isEmailChecked;
    finalData["mobile"] = whatsappFields.mobileOrGroupID;
    finalData["waMessage"] = whatsappFields.waMessage;
    finalData["WaAttachement"] = whatsappFields.attachment;
    finalData["email"] = emailFields.emailIDTo;
    finalData["cc"] = emailFields.emailIDCc;
    finalData["bcc"] = emailFields.emailIDBCc;
    finalData["emailSubject"] = emailFields.subjectLine;
    finalData["emailBody"] = emailFields.mailBodyHTML;
    finalData["emailAttachments"] = emailFields.attachment;
    return httpservice.post(api, finalData, { headers, withCredentials: true });
}
