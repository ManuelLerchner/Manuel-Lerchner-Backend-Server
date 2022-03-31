const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

updateData = async (req) => {
    let result;
    try {
        let url = `https://api.nomics.com/v1${req.path}`;

        url += `?key=${process.env.NOMICS_API_KEY}`;

        Object.keys(req.query).forEach(
            (key) => (url += `&${key}=${req.query[key]}`)
        );

        result = await fetch(url);

        if (result.status === 200) {
            let json = await result.json();

            return json;
        }
    } catch (e) {
        console.log("Nomics Error: " + e);
    }
    console.log(result.statusText);

    return [];
};

module.exports = updateData;
