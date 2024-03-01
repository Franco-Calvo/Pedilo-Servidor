import dotenv from "dotenv";
import passport from "passport";
import passportJWT from "passport-jwt";
import User, { IUser } from "../Models/Users.js";

dotenv.config({ path: "env" });

passport.use(
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.secret,
    },
    async (jwt_payload: any, done: passportJWT.VerifiedCallback) => {
      try {
        const user = await User.findOne({ _id: jwt_payload.id });
        if (user) {
          user.password = "";
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error: unknown) {
        console.log(error);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
