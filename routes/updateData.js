const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

updateData = async (req) => {
  try {
    let url = `https://api.nomics.com/v1${req.path}`;

    url += `?key=${process.env.NOMICS_API_KEY}`;

    Object.keys(req.query).forEach(
      (key) => (url += `&${key}=${req.query[key]}`)
    );

    let result = await fetch(url);
    let json = await result.json();

    // console.log("updateData");
    return json;
  } catch (e) {
    console.log(e);

    return [];
  }
};

module.exports = updateData;
