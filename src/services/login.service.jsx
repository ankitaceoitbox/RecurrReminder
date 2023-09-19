import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.login;
const api = `${URL}/${endPoints}`;

export const UserLogin = (loginData) => {
    return httpservice.post(api, loginData);
}
