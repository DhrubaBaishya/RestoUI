import { LOGIN, LOGOUT } from "./authTypes";
import AuthService from "../../service/AuthService";

const initialState = {
  user: AuthService.getCurrentUser(),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: AuthService.getCurrentUser(),
      };
    case LOGOUT:
      return {
        ...state,
        user: undefined,
      };
    default:
      return state;
  }
};

export default authReducer;
