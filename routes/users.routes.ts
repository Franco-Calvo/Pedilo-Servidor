import express, { Router } from "express";
import accountExistSignIn from "../Middlewares/Users/AccountExistSignIn.js";
import accountExistSignUp from "../Middlewares/Users/AccountExistSignUp.js";
import passwordIsOk from "../Middlewares/Users/PasswordIsOk.js";
import passport from "passport";
import validator from "../Middlewares/Validator.js";
import schema_signin from "../Schemas/Sign_in.js";
import schema_signup from "../Schemas/Sign_up.js";
import controller from "../Controllers/Auth/Auth.js";
import accountExistName from "../Middlewares/Users/AccountExistName.js";

const { sign_up, sign_in, sign_out } = controller;

const router: Router = express.Router();

router.post(
  "/signup",
  validator(schema_signup),
  accountExistSignUp,
  accountExistName,
  sign_up
);

router.post(
  "/signin",
  validator(schema_signin),
  accountExistSignIn,
  passwordIsOk,
  sign_in
);

router.post(
  "/signout",
  passport.authenticate("jwt", { session: false }),
  sign_out
);

router.get(
  "/verifytoken",
  passport.authenticate("jwt", { session: false }),
  controller.verifyToken
);

export default router;
