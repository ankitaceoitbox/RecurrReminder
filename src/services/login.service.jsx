import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.login;
const api = `${URL}/${endPoints}`;

export const UserAdminLogin = (loginData) => {
    return httpservice.post(api, loginData, {
        'withCredentials': true,
    });
}
