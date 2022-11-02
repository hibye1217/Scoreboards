function getAttribute(obj, attr, val){
    if (typeof obj !== "object"){ return val; }
    if (attr in obj){ return obj[attr]; } else{ return val; }
}

function getURL(){ return window.location.href; }

const sleep = ms => new Promize(r => setTimeout(r, ms));
async function callAPI(link, param){
    link = "https://codeforces.com/api/" + link + "?";
    for (let key of Object.keys(param)){ link += param[key] + '&'; }
    link = link.substring( 0, link.length - 1 );

    console.info("API Called:", link); sleep(2002);
    const res = await( await fetch(link) ).json();
    console.info("API Returned:", res);

    if (res.status == "OK"){ return res.result; } else{ return {}; }
}