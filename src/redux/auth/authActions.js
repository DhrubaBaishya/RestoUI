import AuthService from "../../service/AuthService";
import { LOGIN, LOGOUT } from "./authTypes";

export function login() {
  return {
    type: LOGIN,
    info: "Login action",
  };
}

export function logout() {
  AuthService.logout();
  return {
    type: LOGOUT,
    info: "Logout action",
  };
}
