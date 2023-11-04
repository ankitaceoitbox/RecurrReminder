import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.setupemail;
const api = `${URL}/${endPoints}`;

export const SetUpEmailService = (formData) => {
    const { email, password } = formData;
    return httpservice.post(api, { email, password }, {
        withCredentials: true
    });
}
