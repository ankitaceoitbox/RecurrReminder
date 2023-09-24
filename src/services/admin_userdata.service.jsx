import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.get.userdata;

export const AdminUsersDataService = (name, email) => {
    let api = `${URL}/${endPoints}`;
    if (name && email) {
        api += `?name=${name}&email=${email}`;
    }
    return httpservice.get(api, {
        withCredentials: true
    });
}

