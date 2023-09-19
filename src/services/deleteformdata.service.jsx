import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.delete.form;
export const DeleteFormData = (_id) => {
    let api = `${URL}/${endPoints}/${_id}`;
<<<<<<< HEAD
    return httpservice.delete(api);
=======
    return httpservice.delete(api,{
        withCredentials:true
    });
>>>>>>> 17fdb9d068f58a7830138b984aa25913980767b4
}

