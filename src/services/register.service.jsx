import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.register;
const api = `${URL}/${endPoints}`;

export const UserRegister = (registerData) => {
    const finalData = {
        name: registerData.firstName,
        email: registerData.email,
        password: registerData.password
    }
    return httpservice.post(api, finalData);
}