var app = angular.module("secureApp", []);

app.controller("AuthController", function ($http) {
  var self = this;
  const apiBase = "/api/Auth";

  self.user = {};
  self.registerUser = {};
  self.token = localStorage.getItem("jwtToken");
  self.loggedUser = localStorage.getItem("loggedUser");
  self.userRole = localStorage.getItem("userRole");
  self.showRegister = false;

  // Toggle between login/register
  self.toggleRegister = function () {
    self.showRegister = !self.showRegister;
    self.error = "";
    self.success = "";
  };

  // REGISTER
  self.register = function () {
    $http.post(apiBase + "/register", self.registerUser)
      .then(function () {
        self.success = "Registration successful! Please log in.";
        self.error = "";
        self.showRegister = false;
      })
      .catch(function (err) {
        self.error = "Registration failed.";
        self.success = "";
      });
  };

  // LOGIN
  self.login = function () {
    $http.post(apiBase + "/login", self.user)
      .then(function (response) {
        const token = response.data.token;
        localStorage.setItem("jwtToken", token);
        self.token = token;
        self.decodeToken(token);
        self.error = "";
        self.success = "Login successful!";
      })
      .catch(function () {
        self.error = "Invalid username or password.";
        self.success = "";
      });
  };

  // Decode JWT token to get username/role
  self.decodeToken = function (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      self.loggedUser = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      self.userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      localStorage.setItem("loggedUser", self.loggedUser);
      localStorage.setItem("userRole", self.userRole);
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  };

  // PROTECTED CALL
  self.callProtected = function () {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      self.error = "Please log in first.";
      return;
    }

    $http.get(apiBase + "/protected", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(function (response) {
        self.protectedData = response.data;
        self.error = "";
      })
      .catch(function () {
        self.error = "Unauthorized or token expired.";
        self.protectedData = "";
      });
  };

  // ADMIN ACTION (protected + role-based)
  self.adminAction = function () {
    alert("✅ Admin-only action executed!");
  };

  // LOGOUT
  self.logout = function () {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
    self.token = null;
    self.loggedUser = null;
    self.userRole = null;
    self.success = "You have logged out successfully.";
  };

  // Auto-decode token if present on page reload
  if (self.token) {
    self.decodeToken(self.token);
  }
});
 