import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.setupwhatsapp;
const api = `${URL}/${endPoints}`;

export const SetUpWhatsappService = (formData) => {
    const { username, password } = formData;
    return httpservice.post(api, { username, password }, {
        withCredentials: true
    });
}
