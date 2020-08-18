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
}

export default new AuthService();
