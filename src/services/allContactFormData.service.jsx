import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.get.forms;
const api = `${URL}/${endPoints}`;

export const AllFormsDataService = () => {
    return httpservice.get(api, {
        withCredentials: true
    });
}

