import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.forgetPassword;
const api = `${URL}/${endPoints}`;

export const ForgetPasswordService = (email) => {
    return httpservice.post(api, { email: email }, {
        withCredentials: true
    });
}

