import { ADD_USER, CLEAR_STORE, DELETE_USER, UPDATE_USER, USER_STATUS } from "./UserType";

type initialStateType = {
    addUser: string[];
}

const initialState: initialStateType = {
    addUser: []
}

const UserReducer = (state = initialState, action: any) => {
    switch(action.type) {
        case CLEAR_STORE: 
            return {
                ...state,
                addUser: []
            }
            
        case ADD_USER: 
            return {
                ...state,
                addUser: [...state.addUser, action.payload]
            }

        case UPDATE_USER:
            const userIndex = state.addUser.findIndex((i: any) => i.id === action.payload.id);
            state.addUser[userIndex] = action.payload;
            return {
                ...state,
                addUser: state.addUser
            }

        case DELETE_USER:
            const userList = state.addUser.filter((i: any) => i.id !== action.payload.id);
            return {
                ...state,
                addUser: userList
            }
    
        case USER_STATUS:
            let userStatus = action.payload.status;
            if (userStatus === 'Active') {
                userStatus = true;
            } else {
                userStatus = false;
            }

            const usersList = state.addUser.map((i: any) => {
                const checkBoxId = action.payload.Ids.find((item: any) => item === i.id);
                if (checkBoxId) {
                    i.active = userStatus;
                }
                return i;
            });
            
            return {
                ...state,
                addUser: usersList
            }
    
        default: return state
    }
};

export default UserReducer;