const mongoose = require("mongoose")
const router = require("express").Router()
const User = mongoose.model("User")
const passport = require("passport")
const utils = require("../lib/utils")

router.get("/info", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ success: true, user: req.user })
})

router.post("/login", (req, res) => {
  let errors = []

  // checks if fields are present in post request
  if (!req.body.email) errors.push({ msg: "Email is required.", code: 1 })
  if (!req.body.password) errors.push({ message: "Password is required.", code: 2 })

  // responds with errors pertaining post request fields
  if (errors.length > 0) return res.status(400).json({ success: false, errors: errors })

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          success: false,
          errors: [{ msg: "Account does not exist", code: 3 }],
        })
      } else {
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt)

        if (isValid) {
          const sanitized_user = utils.sanitizeUser(user)
          const jwt = utils.issueJWT(user)

          res.status(200).json({ success: true, user: sanitized_user, token: jwt.token, expiresIn: jwt.expires })
        } else {
          res.status(401).json({
            success: false,
            errors: [{ msg: "Incorrect password", code: 4 }],
          })
        }
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        success: false,
        errors: [{ msg: err, code: 10 }],
      })
    })
})

router.post("/register", (req, res) => {
  let errors = []

  // checks if fieilds are present in post request
  if (!req.body.email) errors.push({ msg: "Email is required.", code: 1 })
  if (!req.body.password) errors.push({ msg: "Password is required.", code: 2 })
  if (!req.body.first) errors.push({ msg: "First name is required.", code: 3 })
  if (!req.body.last) errors.push({ msg: "Last name is required.", code: 4 })

  /*
   * TODO: Should sanitize / make sure email, password, first, and last
   *       do not contain potentially harmful javascript code. Make sure
   *       that the email is a valid email. Make sure that the password
   *       is a valid password. If input is not santized, then the user
   *       could potentially be able to run javascript on front end application
   *       if the front end application does not sanitize the input.
   */

  // responds with errors pertaining post request fields
  if (errors.length > 0) return res.status(400).json({ success: false, errors: errors })

  User.countDocuments({ email: req.body.email })
    .then((count) => {
      // Checks to see if email is already in use
      if (count > 0) {
        res.json({
          success: false,
          errors: [{ msg: "Account already exists", code: 5 }],
        })
      } else {
        const { salt, hash } = utils.genPassword(req.body.password)

        const newUser = new User({
          email: req.body.email,
          first: req.body.first,
          last: req.body.last,
          hash: hash,
          salt: salt,
        })

        newUser
          .save()
          .then((user) => {
            const sanitized_user = utils.sanitizeUser(user)

            const jwt = utils.issueJWT(user)
            res.json({ success: true, user: sanitized_user, token: jwt.token, expiresIn: jwt.expires })
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              errors: [{ msg: err, code: 10 }],
            })
          })
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        errors: [{ msg: err, code: 10 }],
      })
    })
})

module.exports = router
