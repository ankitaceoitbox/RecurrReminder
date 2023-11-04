import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.register;
const api = `${URL}/${endPoints}`;

export const UserRegister = (registerData) => {
    const finalData = {
        name: registerData.firstName + " " + registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        contact: registerData.contactNo,
        company: registerData.companyName
    };
    return httpservice.post(api, finalData, {
        withCredentials: true
    });
}