function getContestID(){
    const url = getURL();
    let res = url.substring( url.indexOf("contest") + "contest/".length );
    res = res.substring( 0, res.indexOf("/") );
    return parseInt(res);
}



async function main(){
    const contestID = getContestID();

    
} main();