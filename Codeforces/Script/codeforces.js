function ratingToRank(rating){
    if      (3000 <= rating){ return 'LGM'; }
    else if (2600 <= rating){ return 'IGM'; }
    else if (2400 <= rating){ return 'GM'; }
    else if (2300 <= rating){ return 'IM'; }
    else if (2100 <= rating){ return 'M'; }
    else if (1900 <= rating){ return 'CM'; }
    else if (1600 <= rating){ return 'X'; }
    else if (1400 <= rating){ return 'S'; }
    else if (1200 <= rating){ return 'P'; }
    else                    { return 'N'; }
}
const rankToClass = {
    'LGM': 'user-legendary',
    'IGM': 'user-red',
    'GM': 'user-red',
    'IM': 'user-orange',
    'M': 'user-orange',
    'CM': 'user-violet',
    'X': 'user-blue',
    'S': 'user-cyan',
    'P': 'user-green',
    'N': 'user-gray'
}
const rankFirstLetter = {
    'LGM': '#000000',
    'IGM': '#990000',
    'IM': '#995500'
}



const sleep = ms => new Promise(r => setTimeout(r, ms));
async function callAPI(link, param){
    let apiLink = "https://codeforces.com/api/" + link + "?";
    for (let key of Object.keys(param)){ apiLink += key + "=" + param[key] + "&"; }
    apiLink = apiLink.substring(0, apiLink.length-1);

    console.info("API Called:", apiLink); await sleep(2002);
    const res = await( await fetch(apiLink) ).json();
    console.info("API Returned:", res);
    if (res.status == "OK"){ return res.result; } else{ return {}; }
}

function copyObject(tar, obj){ // console.log("copyObject:", tar, obj);
    for (let key of Object.keys(obj)){
        if (typeof obj[key] === 'object'){ tar[key] = {}; copyObject(tar[key], obj[key]); }
        else{ tar[key] = obj[key]; }
    }
}

function createTag(type, attr){
    const tag = document.createElement(type);
    if (attr != undefined){ copyObject(tag, attr); }
    return tag;
}

function appendTag(parent, type, attr){
    const tag = createTag(type, attr);
    parent.appendChild(tag); return tag;
}



function getContestID(){
    const url = window.location.href.substring( 'https://codeforces.com/contest/'.length );
    let res = "";
    for (let i = 0; ; i++){
        if ('0' <= url[i] && url[i] <= '9'){ res += url[i]; } else{ break; }
    }
    return parseInt(res);
}



function ratingToHTML(rating){
    if (rating == Infinity){ return '<span class="user-legendary" style="font-weight: bold; display: inline-block; color: #000000">∞</span>'; }
    if (rating == -Infinity){ return '<span class="user-gray" style="font-weight: bold; display: inline-block">-∞</span>'; }
    const rank = ratingToRank(rating);
    const str = rating.toString();
    if (rank in rankFirstLetter){
        return '<span class="' + rankToClass[rank] + '" style="font-weight: bold; display: inline-block">'
             + '<span style="color: ' + rankFirstLetter[rank] + '">' + str[0] + '</span>'
             + str.substr(1)
             + '</span>'
    }
    else{
        return '<span class="' + rankToClass[rank] + '" style="font-weight: bold; display: inline-block">' + str + '</span>'
    }
}



async function CodeforcesEdit(){ const contestID = getContestID();
    const table = document.getElementsByClassName('standings')[0];
    table.innerHTML = "";
    
    const contestStanding = await callAPI('contest.standings', { contestId: contestID, showUnofficial: true });
    const contestProblems = contestStanding.problems; const contestProblemCount = contestProblems.length;

    const thead = appendTag(table, 'thead');
    {
        const tr = appendTag(thead, 'tr');

        appendTag(tr, 'th', { innerHTML: "Rank", className: 'top left', style: { width: '4em' } });
        appendTag(tr, 'th', { innerHTML: "User", className: 'top' });
        appendTag(tr, 'th', { innerHTML: "Score", className: 'top', style: { width: '4em' } });
        appendTag(tr, 'th', { innerHTML: "Hacks", className: 'top', style: { width: '4em' } });
        for (let i = 0; i < contestProblemCount; i++){
            const problem = contestProblems[i];
            const th = appendTag(tr, 'th', { innerHTML: '<span>' + problem.index + '</span>', className: 'top', style: { width: '5em' } });
            if (problem.rating != undefined){ th.innerHTML += '<sup class="small">' + ratingToHTML(problem.rating) + '</sup>'; }
            if (problem.points != undefined){ th.innerHTML += '<br><span class="small">' + problem.points + '</span>'; }
        }
        appendTag(tr, 'th', { innerHTML: "Perf.", className: 'top', style: { width: '4em' } });
        appendTag(tr, 'th', { innerHTML: "Delta", className: 'top', style: { width: '4em' } });
        appendTag(tr, 'th', { innerHTML: "Rating", className: 'top right', style: { width: '8em' } });
    }

    const tbody = appendTag(table, 'tbody');
} CodeforcesEdit();