import { Box, Button, FormLabel, TextField, makeStyles } from "@material-ui/core";
import { useFormik } from "formik";

import "../Assets/UserForm.css";
import UserSchema from "../Schema/UserSchema";
import { UserInterface } from "../Interfaces/User";

const useStyles = makeStyles(() => ({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00008b",
        },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00008b",
        },
        "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00008b",
        },
    }
}));

const UserForm = (parentProps: any) => {
    const classes = useStyles();

    const userFormInitialValues: UserInterface = {
        id: parentProps.formData.id ? parentProps.formData.id : "",
        firstName: parentProps.formData.firstName ? parentProps.formData.firstName : "",
        lastName: parentProps.formData.lastName ? parentProps.formData.lastName : "",
        email: parentProps.formData.email ? parentProps.formData.email : "",
        phone: parentProps.formData.phone ? parentProps.formData.phone : "",
        active: parentProps.formData.active ? parentProps.formData.active : true
    };

    const formik = useFormik({
        initialValues: userFormInitialValues,
        validationSchema: UserSchema,
        onSubmit: (values, props) => {
            parentProps.onSaveData(values);
            props.resetForm({
                values: userFormInitialValues,
            });
        },
    });
    
    return (
        <Box className="user-modal">
            <form onSubmit={formik.handleSubmit} className="user-form">
                <FormLabel className="label-text">First Name</FormLabel>
                <TextField 
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    name="firstName"
                    id="firstName" 
                    variant="outlined" 
                    margin="dense" 
                    className={classes.root + ' input-text'}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                />

                <FormLabel className="label-text">Last Name</FormLabel>
                <TextField 
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    name="lastName"
                    id="lastName" 
                    variant="outlined" 
                    margin="dense" 
                    className={classes.root + ' input-text'}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                />

                <FormLabel className="label-text">Email</FormLabel>
                <TextField 
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    name="email"
                    id="email" 
                    variant="outlined" 
                    margin="dense" 
                    className={classes.root + ' input-text'}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                <FormLabel className="label-text">Phone Number</FormLabel>
                <TextField 
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    name="phone"
                    id="phone" 
                    variant="outlined" 
                    margin="dense" 
                    className={classes.root + ' input-text'}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                />

                <Button type="submit" variant="contained" className="submit-user-btn">Submit</Button>
            </form>
        </Box>
    );
};

export default UserForm;