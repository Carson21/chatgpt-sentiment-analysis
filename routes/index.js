const router = require("express").Router()

router.use("/api/v1/users", require("./users"))
router.use("/api/v1/search", require("./search"))
router.use("/api/v1/analyze", require("./analyze"))

module.exports = router
