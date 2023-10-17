const httpStatus = require("http-status");
const ApiError = require("../helpers/ApiError");
const { admin, db } = require("../../config/firebase");

const loginUserService = async (firebaseUser) => {
  try {
    const { uid } = firebaseUser;
    const userRef = await db.ref("users/" + uid);
    const userSnapshot = await userRef.once("value");
    if (!userSnapshot.exists()) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User does not exists");
    }
    await userRef.update({ isLogin: true });
    const user = await userSnapshot.val();
    user.isLogin = "true";
    return user;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
};

const signupUserService = async (firebaseUser) => {
  try {
    const { username, email, uid } = firebaseUser;
    const userRef = await db.ref("users/" + uid);
    const userSnapshot = await userRef.once("value");
    if (userSnapshot.exists()) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User already exists");
    }
    await userRef.set({
      username,
      email,
      uid,
      isRegistered: "true",
      isLogin: "false",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const newUserSnapshot = await userRef.once("value");
    const newUser = await newUserSnapshot.val();
    return newUser;
  } catch (err) {
    throw err;
  }
};

const getAllUsersService = async (firebaseUser) => {
  try {
    const usersRef = await db.ref("users");
    const usersSnapshot = await usersRef
      .once("value");
    const users = []
    usersSnapshot.forEach((a)=>{
      const user = a.val();
      if(user.uid != firebaseUser.uid)
        users.push(a.val())
    })
    return users
  } catch (err) {
    throw err;
  }
};

// const convertListOfUserSnapshotsToArrayOfUsers = (userSnapshots) => {
//   return new Promise((resolve,reject)=>{
//     const users = [];
//     userSnapshots.forEach(async userSnapshot => {
//         const user = await userSnapshot.val();
//         user.push(Object.values(user));
//     })
//   })
// }

module.exports = {
  loginUserService,
  signupUserService,
  getAllUsersService,
};
