const host = "http://localhost:8710";

export const urls = {
  login: host + "/auth-service/api/auth/login",
  admin: host + "/auth-service/api/auth/admin",
  manager: host + "/auth-service/api/auth/manager",
  reception: host + "/auth-service/api/auth/reception",
  area: host + "/app-service/api/v1/area",
  table: host + "/app-service/api/v1/table",
  increateTableCapacity: host + "/app-service/api/v1/table/increase",
  decreaseTableCapacity: host + "/app-service/api/v1/table/decrease",
  categoryType: host + "/app-service/api/v1/category/type",
  category: host + "/app-service/api/v1/category",
  item: host + "/app-service/api/v1/item",
  person: host + "/app-service/api/v1/person",
  personActivate: host + "/app-service/api/v1/person/activate/",
  personDeactivate: host + "/app-service/api/v1/person/deactivate/",
  tax: host + "/app-service/api/v1/tax",
  tableOrder: host + "/app-service/api/v1/order/table/",
  changeTable: host + "/app-service/api/v1/order/table/change/",
  order: host + "/app-service/api/v1/order",
  completeOrder: host + "/app-service/api/v1/order/complete",
  cancelOrder: host + "/app-service/api/v1/order/cancel",
};

export const errorMessages = {
  emptyUsername: "Please provide a username",
  emptyPassword: "Please provide a password",
  checkService: "Please make sure the services are running and try again.",
  loginInvalid: "The username or password is incorrect",
  emptyAreaName: "Please enter area name",
  emptyTableName: "Please enter table name",
  areaNotSelected: "Please select an area",
  tryAgain: "Something went wrong. Please try again!",
  fieldEmpty: "Please fill in all the fields",
  categoryExists: "Category name already exists",
  invalidValue: " is invalid",
  selectTable: "Please select a table",
};

export const warnings = {
  deleteArea: "This will delete any table created under the area",
};

export const general = {
  pageSize: 40,
};

export const businessDetails = {
  name: "The Jeves Corner",
  address: "Don Bosco, Laitumkhrah",
  city: "Shillong-793001",
  phoneNumber: "9876543210",
};
