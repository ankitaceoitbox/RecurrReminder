import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.put.verifyPassword;

export const UpdatePassword = (newPassword, token) => {
    let api = `${URL}/${endPoints}/${token}`;
    console.log(api)
    return httpservice.put(api, { newPassword: newPassword }, {
        withCredentials: true
    });
}

