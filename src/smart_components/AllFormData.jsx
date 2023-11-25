import React, { useEffect, useState } from 'react'
import AllFormData from '../components/allformdata'
import { AllFormsDataService } from '../services/allContactFormData.service';
import { toast } from 'react-toastify';
import { DeleteFormData } from '../services/deleteformdata.service';

function AllFormDataSmart() {
    const [allFormData, setAllFormData] = useState([]);
    /** This function will call the api for getting all the form data. */
    const handleContactFormAllData = async (show = true) => {
        try {
            const { data } = await AllFormsDataService();
            const { success, forms } = data;
            if (success === true) {
                setAllFormData(forms);
                if (show) {
                    toast.success('Data loaded successfully.', {
                        position: 'top-right',
                        autoClose: 500, // Time in milliseconds for the notification to automatically close
                    });
                }
            }
        }
        catch (e) {
            toast.error('Data not loaded.', {
                position: 'top-right',
                autoClose: 1000, // Time in milliseconds for the notification to automatically close
            });
        }
    }

    /** Delete data by id. */
    const deleteFormDataById = async (_id) => {
        const response = await DeleteFormData(_id);
        if (response.data.success === true) {
            toast.success('Data deleted successfully.', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
            const filterData = allFormData.filter(data => data._id !== _id);
            setAllFormData(filterData);
        }
    }

    const loadFormDataAgain = async () => {
        await handleContactFormAllData(false);
    }

    useEffect(() => {
        handleContactFormAllData();
    }, []);

    return (
        <>
            <AllFormData
                allData={allFormData}
                onDeleteFormDataById={deleteFormDataById}
                onLoadFormDataAgain={loadFormDataAgain}
            />
        </>
    )
}

export default AllFormDataSmart