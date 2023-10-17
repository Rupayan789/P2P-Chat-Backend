const httpStatus = require("http-status");

const { catchAsync } = require("../helpers/catchAysnc");
const ApiError = require("../helpers/ApiError");
const { admin } = require("../../config/firebase");



const getAuthToken = catchAsync(async (req, res, next) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      req.authToken = req.headers.authorization.split(" ")[1];
      next();
    } else
      next(
        new ApiError(httpStatus.UNAUTHORIZED, "Authorization token not found")
      );
  });
  
const getFirebaseUid = catchAsync(async (req, res, next) => {
    const { authToken } = req;
    const user = await admin.auth().verifyIdToken(authToken);

    req.firebaseUser = user;
    next();
});
  
const checkIfAuthenticated = catchAsync(async (req, res, next) => {
    // search using the firebaseUid
    // const { firebaseUser } = req;
    // const { uid: firebaseUid } = firebaseUser;

    // const existingUserInDb = await Users.findOne({
    //     firebaseUid,
    // });

    // if (!existingUserInDb)
    //     next(new ApiError(httpStatus.UNAUTHORIZED, "User not authorized"));

    // req.user = existingUserInDb;
    // next();
});

module.exports = {
    getAuthToken,
    getFirebaseUid,
    checkIfAuthenticated
}