import authReducer from "./auth/authReducer";
import { combineReducers, createStore } from "redux";

const reducers = combineReducers({
  auth: authReducer,
});

const store = createStore(reducers);
export default store;
