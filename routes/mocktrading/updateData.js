const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

updateData = async (req) => {
    let result;
    try {
        //get id from req
        // id is array of strings
        const tokens = req.query.ids.split(',');

        //get data from nomics
        const results = await Promise.all(tokens.map(async (token) => {
            const url = `https://openapiv1.coinstats.app/coins/${token}?currency=EUR`;
        
            const result = await fetch(url, {
                method: "GET",
                headers: {
                accept: "application/json",
                "X-API-KEY": process.env.COINSTATS_API_KEY,
                },
            });
    
            if (result.status === 200) {
                let json = await result.json();
                return json;
            }
        }));

        result = results.filter((result) => result !== undefined);

        return result;

    } catch (e) {
        console.log("Nomics Error: " + e);
    }
    console.log(result.statusText);

    return [];
};

module.exports = updateData;
