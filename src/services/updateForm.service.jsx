import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.put.updateForm;
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const UpdateSingleUserForm = (formData, _id) => {
    let api = `${URL}/${endPoints}/${_id}`;
    return httpservice.put(api, formData, { headers, withCredentials: true });
}

