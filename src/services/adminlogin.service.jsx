import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.login;
const api = `${URL}/${endPoints}`;

export const AdminLogin = (loginData) => {
    const { email, password } = loginData;
    return httpservice.post(api, {
        email: email, password: password,
    }, {
        withCredentials: true
    });
}
