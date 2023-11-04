import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.get.userlogout;
const api = `${URL}/${endPoints}`;

export const UserLogoutService = () => {
    return httpservice.get(api, {
        withCredentials: true
    });
}
