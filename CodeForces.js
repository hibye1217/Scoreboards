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
    'IM': '#FF0000',
}



const sleep = ms => new Promise(r => setTimeout(r, ms));
async function callAPI(link){
    await sleep(3000);
    const res = await( await fetch(link) ).json();
    if (res.status == "OK"){ return res.result; }
    else{ return {}; }
}

function createTag(obj){
    const tag = document.createElement(obj.tag);
    if ('class' in obj){ tag.className = obj.class; }
    if ('html' in obj){ tag.innerHTML = obj.html; }
    if ('width' in obj){ tag.style.width = obj.width; }
    return tag;
}

function ratingHTML(rating){
    const rank = ratingToRank(rating);
    const str = rating.toString();
    if (rank in rankFirstLetter){
        return '<span class="' + rankToClass[rank] + '">'
             + '    <span style="color: ' + rankFirstLetter[rank] + '">' + str[0] + '</span>'
             + str.substr(1)
             + '</span>'
    }
    else{
        return '<span class="' + rankToClass[rank] + '">' + str + '</span>'
    }
}



async function CodeForcesEdit(){
    const url = window.location.href.substring( "https://codeforces.com/contest/".length );
    let contestID = "";
    for (let i = 0; ; i++){
        if ('0' <= url[i] && url[i] <= '9'){ contestID += url[i]; }
        else{ break; }
    }
    contestID = parseInt(contestID);

    const contest = await callAPI('https://codeforces.com/api/contest.standings?contestId=' + contestID);
    const problemCount = contest.problems.length;

    const scoreboardTag = document.getElementsByClassName('standings')[0].children[0];
    
    const scoreboard = document.getElementsByClassName('standings')[0];
    scoreboard.innerHTML = "";

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    {
        const tr = document.createElement('tr');

        tr.appendChild( createTag({ tag: 'th', html: 'Rank', class: 'top left', width: '4em' }) );
        tr.appendChild( createTag({ tag: 'th', html: 'Contestant', class: 'top' }) );
        tr.appendChild( createTag({ tag: 'th', html: 'Score', class: 'top', width: '4em' }) );
        tr.appendChild( createTag({ tag: 'th', html: 'Hacks', class: 'top', width: '4em' }) );
        for (let problemIndex = 0; problemIndex < problemCount; problemIndex++){
            const problem = contest.problems[problemIndex];
            if (problem.rating == undefined){
                tr.appendChild( createTag({
                    tag: 'th',
                    html: '<span>' + problem.index + '</span>' + '<br>'
                        + '<span class="small">' + problem.points + '</span>',
                    class: 'top', width: '5em'
                }) );
            }
            else{
                tr.appendChild( createTag({
                    tag: 'th',
                    html: '<span>' + problem.index + '<sup class="small">' + ratingHTML(problem.rating) + '</sup></span>' + '<br>'
                        + '<span class="small">' + problem.points + '</span>',
                    class: 'top', width: '5em'
                }) );
            }
        }
        tr.appendChild( createTag({ tag: 'th', html: 'Perf.', class: 'top', width: '4em' }) );
        tr.appendChild( createTag({ tag: 'th', html: 'Delta', class: 'top', width: '4em' }) );
        tr.appendChild( createTag({ tag: 'th', html: 'Rating', class: 'top right', width: '8em' }) );

        thead.appendChild(tr);
    }

    scoreboard.appendChild(thead);
    scoreboard.appendChild(tbody);
} CodeForcesEdit();