import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.get.emailWhatsAppDetails;
const api = `${URL}/${endPoints}`;

export const EmailWhatsAppDetailsService = () => {
    return httpservice.get(api, {
        withCredentials: true
    });
}