const {
  loginUser,
  signUpUser,
  getAllUsers
} = require("./auth.controller");

module.exports = {
  authController: {
    loginUser,
    signUpUser,
    getAllUsers
  }
}
