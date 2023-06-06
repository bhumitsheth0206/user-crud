import * as yup from "yup";

const UserSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required')
        .matches(/^[A-Za-z ]*$/, 'Please enter valid first name'),
    lastName: yup.string().required('Last Name is required')
        .matches(/^[A-Za-z ]*$/, 'Please enter valid last name'),
    email: yup.string().required('Email is required')
        .matches(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}(.[a-z{2,3}])?/g, "Invalid email"),
    phone: yup.string().required('Phone is required')
        .max(10)
        .matches(/[0-9]\d$/, 'Please enter valid phone number')   
});

export default UserSchema;