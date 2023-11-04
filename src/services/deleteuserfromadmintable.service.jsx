import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.delete.admindelete;
const api = `${URL}/${endPoints}`;

export const RemoveUserFromAdminTable = (id) => {
    console.log(id);
    return httpservice.delete(api, { id }, {
        withCredentials: true
    });
}
