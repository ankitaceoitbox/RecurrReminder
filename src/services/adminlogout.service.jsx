import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.get.adminlogout;
const api = `${URL}/${endPoints}`;

export const AdminLogoutService = () => {
    return httpservice.get(api, {
        withCredentials: true
    });
}
