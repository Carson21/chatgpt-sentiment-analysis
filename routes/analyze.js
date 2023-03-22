const router = require("express").Router()
const passport = require("passport")

router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (!req.body.reviews) res.status(400).json({ success: false, errors: [{ msg: "Reviews are required.", code: 1 }] })
  if (!Array.isArray(req.body.reviews))
    res.status(400).json({ success: false, errors: [{ msg: "Reviews must be an array.", code: 2 }] })

  let reviews = ""

  for (let i = 0; i < req.body.reviews.length; i++) {
    if (!req.body.reviews[0].rating)
      res.status(400).json({ success: false, errors: [{ msg: "Rating is required for each review.", code: 3 }] })
    if (!req.body.reviews[0].date)
      res.status(400).json({ success: false, errors: [{ msg: "Date is required for each review.", code: 4 }] })
    if (!req.body.reviews[0].snippet)
      res.status(400).json({ success: false, errors: [{ msg: "Snippet is required for each review.", code: 5 }] })

    reviews += `Review ${i + 1}:\nRating - ${req.body.reviews[i].rating}\nDate: ${req.body.reviews[i].date}\nSnippet: ${
      req.body.reviews[i].snippet
    }\n\n`
  }

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Your job is to take apartment reviews that the user will input, figure out the pros and cons of the apartment, " +
            "and respond back to the user with a 200 to 300 word long summary in paragraph form" +
            "about the apartment and its various pros and cons. Provide a rating of the apartment based on the reviews.",
        },
        { role: "user", content: reviews },
      ],
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } else {
        res.status(500).json({
          success: false,
          errors: [{ msg: "ChatGPT API response error. status = " + response.status, code: 6 }],
        })
      }
    })
    .then((data) => {
      res.json({ success: true, data: data })
    })
    .catch((error) => {
      res.status(500).json({ success: false, errors: [{ msg: "Internal Server Error: " + error.message, code: 7 }] })
    })
})

module.exports = router
