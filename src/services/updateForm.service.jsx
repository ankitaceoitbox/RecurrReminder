import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.put.updateForm;
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const UpdateSingleUserForm = (formData, _id) => {
    let api = `${URL}/${endPoints}/${_id}`;
    const { commonFields, emailFields, whatsappFields, isEmailChecked, isWAChecked } = formData;
    const finalData = new FormData();
    finalData.append("startDate", commonFields.startDate ?? '');
    finalData.append("day", commonFields.day ?? '');
    finalData.append("every", commonFields.every ?? '');
    finalData.append("frequency", commonFields.frequency ?? '');
    finalData.append("skipDates", commonFields.skipDates ?? []);
    finalData.append("skipDays", commonFields.skipDays ?? []);
    finalData.append("sendTime", commonFields.sendTime);
    finalData.append("name", commonFields.name ?? '');
    finalData.append("company", commonFields.company ?? '');
    finalData.append("endDate", commonFields.endsOnDate);
    finalData.append("isActiveWA", isWAChecked ?? false);
    finalData.append("isActiveEmail", isEmailChecked ?? false);
    finalData.append("mobile", whatsappFields.mobileOrGroupID ?? '');
    finalData.append("waMessage", whatsappFields.waMessage ?? '');
    finalData.append("WaAttachement", whatsappFields.attachment ?? []);
    finalData.append("email", emailFields.emailIDTo ?? '');
    finalData.append("cc", emailFields.emailIDCc ?? '');
    finalData.append("bcc", emailFields.emailIDBCc ?? '');
    finalData.append("emailSubject", emailFields.subjectLine ?? '');
    finalData.append("emailBody", emailFields.mailBodyHTML ?? '');

    return httpservice.put(api, finalData, { headers, withCredentials: true });
}

