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
    const finalData = {
        "startDate": commonFields.startDate,
        "day": commonFields.day,
        "remDay": commonFields.sendDays,
        "sendTime": commonFields.sendTime,
        "name": commonFields.name,
        "company": commonFields.company,
        "isActiveWA": isWAChecked,
        "isActiveEmail": isEmailChecked,
        "mobile": whatsappFields.mobileOrGroupID,
        "waMessage": whatsappFields.waMessage,
        "WaAttachement": whatsappFields.attachment,
        "email": emailFields.emailIDTo,
        "cc": emailFields.emailIDCc,
        "bcc": emailFields.emailIDBCc,
        "emailSubject": emailFields.subjectLine,
        "emailBody": emailFields.mailBodyHTML,
        "endDate": emailFields.endsOnDate
    }
    console.log(finalData);
<<<<<<< HEAD
    return httpservice.post(api, finalData, { headers });
=======
    return httpservice.post(api, finalData, { headers,withCredentials:true });
>>>>>>> 17fdb9d068f58a7830138b984aa25913980767b4
}