import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.adminLogin;
const api = `${URL}/${endPoints}`;

export const AdminLogin = (loginData) => {
    const { email, password } = loginData;
    console.log(email, password);
    return httpservice.post(api, {
        email: email, password: password,
    }, {
        withCredentials: true
    });
}
