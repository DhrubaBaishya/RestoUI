const host = "http://localhost:8710";

export const urls = {
  login: host + "/auth-service/api/auth/login",
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
  order: host + "/app-service/api/v1/order",
  completeOrder: host + "/app-service/api/v1/order/complete",
};

export const errorMessages = {
  emptyUsername: "Please provide a username",
  emptyPassword: "Please provide a password",
  checkService: "Please make sure the services are running and try again.",
  loginInvalid: "The username or password is incorrect",
  emptyTableName: "Please enter table name",
  tryAgain: "Something went wrong. Please try again!",
  fieldEmpty: "Please fill in all the fields",
  categoryExists: "Category name already exists",
  invalidValue: " is invalid",
};

export const general = {
  pageSize: 5,
};

export const businessDetails = {
  name: "The Jeves Corner",
  address: "Don Bosco, Laitumkhrah",
  city: "Shillong-793001",
  phoneNumber: "9876543210",
};
