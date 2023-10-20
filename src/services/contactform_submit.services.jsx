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
    return httpservice.post(api, formData, { headers, withCredentials: true });
}
