const httpStatus = require("http-status");
const { catchAsync } = require("../helpers/catchAysnc");
const { authService } = require("../services");

const loginUser = catchAsync(async (req, res, next) => {
  const { firebaseUser } = req;
  const user = await authService.loginUserService(firebaseUser);

  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    status: httpStatus[httpStatus.OK],
    message: "User logged in successfully",
    data: user,
  });
});

const signUpUser = catchAsync(async (req, res, next) => {
  const { firebaseUser } = req;
  const payload = req.body;
  firebaseUser.username = payload.username;
  const signedUpUser = await authService.signupUserService(firebaseUser);

  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    status: httpStatus[httpStatus.CREATED],
    message: "User created succesfully",
    data: signedUpUser,
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const { firebaseUser } = req;
  const users = await authService.getAllUsersService(firebaseUser);
  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    status: httpStatus[httpStatus.CREATED],
    message: "All active users fetched successfully",
    data: users,
  });
});

module.exports = {
  loginUser,
  signUpUser,
  getAllUsers,
};
