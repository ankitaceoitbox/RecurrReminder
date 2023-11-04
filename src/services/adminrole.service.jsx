import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.put.adminrole;

export const UpdateRoleService = ({ id, role }) => {
    let api = `${URL}/${endPoints}`;
    return httpservice.put(api, { id, role }, {
        withCredentials: true
    });
}
