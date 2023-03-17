async function getPlaces(query) {
  const response = await fetch(
    `https://serpapi.com/search?engine=google_maps&q=${query}&api_key=${process.env.SERP_API_KEY}`
  )
  if (response.status === 200) {
    const data = await response.json()
    return data
  } else {
    throw new Error("Serp API response error. status = " + response.status)
  }
}

async function getReviews(id) {
  const response = await fetch(
    `https://serpapi.com/search?engine=google_maps_reviews&data_id=${id}&api_key=${process.env.SERP_API_KEY}`
  )
  if (response.status === 200) {
    const data = await response.json()
    return data
  } else {
    throw new Error("Serp API response error. status = " + response.status)
  }
}

module.exports = { getPlaces, getReviews }
