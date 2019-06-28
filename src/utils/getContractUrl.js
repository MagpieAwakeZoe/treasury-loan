const getContractUrl = function(params, baseUrl, url) {
    let query = [];
    Object.keys(params).forEach((key) => {
        query.push(`${key}=${params[key]}`);
    });
    query = query.join('&');
    return `${baseUrl}${url}?${query}`;
};

export default getContractUrl;