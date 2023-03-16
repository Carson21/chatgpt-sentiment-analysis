const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const passport = require("passport")

// Gives access to variables in the .env file
require("dotenv").config()

const app = express()

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require("./config/database")

// Load Mongoose Models
require("./models/user")

// Pass the global passport object into the configuration function
require("./config/passport")(passport)

// Middleware
app.use(helmet())
app.use(cors())

// This will initialize the passport object on every request
app.use(passport.initialize())

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(require("./routes"))

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
