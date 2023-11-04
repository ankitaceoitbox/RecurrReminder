import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.whatsappmanualtesting;
const api = `${URL}/${endPoints}`;

export const WhatsAppManualTestingService = (username, password) => {
    const req = { username, password };
    return httpservice.post(api, req, {
        withCredentials: true
    });
}

