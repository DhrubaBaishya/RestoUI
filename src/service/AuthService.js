import axios from "axios";
import Cookies from "universal-cookie";
import { urls } from "../properties/properties";

class AuthService {
  async login(username, password) {
    const response = await axios.post(urls.login, {
      username,
      password,
    });
    console.log("RESPONSE");
    console.log(response);
    if (response.data.token) {
      const cookies = new Cookies();
      cookies.set("user", response.data, { path: "/" });
    }
    return response.data;
  }

  logout() {
    const cookies = new Cookies();
    cookies.remove("user", { path: "/" });
  }

  getCurrentUser() {
    const cookies = new Cookies();
    return cookies.get("user");
  }

  getRole() {
    const cookies = new Cookies();
    return cookies.get("user").roles[0];
  }

  checkOrderAccess() {
    return ["ROLE_MANAGER", "ROLE_ADMIN"].includes(this.getRole());
  }

  checkReservationAccess() {
    return ["ROLE_RECEPTION", "ROLE_MANAGER", "ROLE_ADMIN"].includes(
      this.getRole()
    );
  }

  checkSettingsAccess() {
    return ["ROLE_ADMIN"].includes(this.getRole());
  }
}

export default new AuthService();
