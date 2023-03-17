const router = require("express").Router()

router.use("/api/v1/users", require("./users"))
router.use("/api/v1/search", require("./search"))

module.exports = router
