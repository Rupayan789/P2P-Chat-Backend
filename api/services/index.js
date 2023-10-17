const { loginUserService  ,signupUserService, getAllUsersService } = require("./auth.service");

module.exports = { 
    authService: {
        loginUserService,
        signupUserService,
        getAllUsersService
    },
}