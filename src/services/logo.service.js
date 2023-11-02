import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.post.logo;
const api = `${URL}/${endPoints}`;
let endPoints2=config.recurring.get.logo
const api2=`${URL}/${endPoints2}`


export const UploadLogo = (logoDataUri) => {
    return httpservice.post(api, {logoDataUri},{
        withCredentials:true
    });
}


export const getLogo = () => {
    return httpservice.get(api2,{
        withCredentials:true
    });
}