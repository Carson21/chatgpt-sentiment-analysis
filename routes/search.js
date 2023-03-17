const router = require("express").Router()
const passport = require("passport")
const serp = require("../lib/serp")

router.get("/places", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (!req.query.q) res.status(400).json({ success: false, errors: [{ msg: "Query is required.", code: 1 }] })

  serp
    .getPlaces(req.query.q)
    .then((data) => {
      res.json({ success: true, data: data })
    })
    .catch((err) => {
      res.status(400).json({ success: false, errors: [{ msg: err.message, code: 2 }] })
    })
})

router.get("/reviews", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (!req.query.id) res.status(400).json({ success: false, errors: [{ msg: "ID is required.", code: 1 }] })

  serp
    .getReviews(req.query.id)
    .then((data) => {
      res.json({ success: true, data: data })
    })
    .catch((err) => {
      res.status(400).json({ success: false, errors: [{ msg: err.message, code: 2 }] })
    })
})

module.exports = router
