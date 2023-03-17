const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("mongoose").model("User")
const utils = require("../lib/utils")

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  algorithms: ["HS256"],
}

const strategy = new JwtStrategy(options, (payload, done) => {
  // We will assign the `sub` property on the JWT to the database ID of user
  User.findOne({ _id: payload.sub })
    .then((user) => {
      // The `user` variable here is the information from the database
      if (user) {
        // If we found a user, return null (for error) and the user
        return done(null, utils.sanitizeUser(user))
      } else {
        // If no user was found, return false (for authentication failed)
        return done(null, false)
      }
    })
    .catch((err) => {
      // If there was an error, return the error
      return done(err, false)
    })
})

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => passport.use(strategy)
