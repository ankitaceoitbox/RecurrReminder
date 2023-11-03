import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.put.adminapprove;

export const ApproveAdminService = ({ id, approve }) => {
    let api = `${URL}/${endPoints}`;
    return httpservice.put(api, { id, approve }, {
        withCredentials: true
    });
}
