const { default: Axios } = require("axios");
const { default: authHeader } = require("./authHeader");

class AccessService {
  getAdmin() {
    return Axios.get(ursl.admin, { headers: authHeader() });
  }

  getManager() {
    return Axios.get(ursl.manager, { headers: authHeader() });
  }

  getReception() {
    return Axios.get(ursl.reception, { headers: authHeader() });
  }
}
