import httpservice from "./httpservice";
import config from '../config.json';

const URL = config.recurring.domainUrl;
const endPoints = config.recurring.put.addholidays;
const api = `${URL}/${endPoints}`;

export const AddHolidays = (skipDates, skipDays) => {
    return httpservice.put(api, { skipDates, skipDays }, {
        withCredentials: true
    });
}

