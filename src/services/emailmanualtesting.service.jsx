// "emailmanualtesting": "check/email"
import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.emailmanualtesting;
const api = `${URL}/${endPoints}`;

export const EmailManualTestingService = (email, password) => {
    const req = { email, password };
    return httpservice.post(api, req, {
        withCredentials: true
    });
}

