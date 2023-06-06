import { UserInterface } from "../Interfaces/User";
import { ADD_USER, CLEAR_STORE, DELETE_USER, UPDATE_USER, USER_STATUS } from "./UserType";

const addUser = (payload: UserInterface) => {
    return {
        type: ADD_USER,
        payload
    }
}

const updateUser = (payload: UserInterface) => {
    return {
        type: UPDATE_USER,
        payload
    }
}

const deleteUser = (payload: UserInterface | null) => {
    return {
        type: DELETE_USER,
        payload
    }
}

const userStatus = (payload: string[], status: string) => {
    return {
        type: USER_STATUS,
        payload: {...{Ids: payload}, status}
    }
}

const clearStore = () => {
    return {
        type: CLEAR_STORE
    }
}

export  {
    addUser,
    updateUser,
    clearStore,
    deleteUser,
    userStatus
};