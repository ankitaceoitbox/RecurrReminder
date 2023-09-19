import React from 'react'
import ContactForm from '../components/contactform'
import { ContactFormSubmit } from '../services/contactform_submit.services';
import { toast } from 'react-toastify';

function ContactPage() {
    /** This function will call the api function. */
    const handleContactFormSubmit = async (formData) => {
        const response = await ContactFormSubmit(formData);
        if (response.data.success === true) {
            toast.success('Form Submitted Successfully.', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
        } else {
            toast.error('Form not Submitted.', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
        }
        return 1;
    }
    return (
        <>
            <ContactForm
                onHandleContactFormSubmit={handleContactFormSubmit}
            />
        </>
    )
}

export default ContactPage