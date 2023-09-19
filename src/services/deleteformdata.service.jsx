import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.delete.form;
export const DeleteFormData = (_id) => {
    let api = `${URL}/${endPoints}/${_id}`;
    return httpservice.delete(api);
}

