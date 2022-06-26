const APPROXIMATE = 0, ACCURATE = 1;
const HIDE_PERFORMANCE = 0, SHOW_PERFORMANCE = 1;
const EXCLUDE_VIRTUAL = 0, PARTIAL_VIRTUAL = 1, INCLUDE_VIRTUAL = 2;

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



function copyObject(tar, obj){
    for (let key of Object.keys(obj)){
        if (typeof obj[key] === 'object'){
            tar[key] = {}; copyObject(tar[key], obj[key]);
        }
        else{ tar[key] = obj[key]; }
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function callAPI(link){
    console.info("API Called:", link)
    await sleep(2002);
    const res = await( await fetch(link) ).json();
    console.info("API Returned:", res)
    if (res.status == "OK"){ return res.result; }
    else{ return {}; }
}

function createTag(tagName, obj){
    let tag = document.createElement(tagName);
    if (obj != undefined){ copyObject(tag, obj); }
    return tag;
}

function eloWinProbability(r1, r2){
    return 1 / ( 1 + Math.pow(10, (r2-r1)/400) );
}



function getContestIdFromURL(){
    const url = window.location.href.substring( 'https://codeforces.com/contest/'.length );
    let res = "";
    for (let i = 0; ; i++){
        if ('0' <= url[i] && url[i] <= '9'){ res += url[i]; }
        else{ break; }
    }
    return parseInt(res);
}

function numberToPMString(num){
    if (num > 0){ return "+" + num; }
    else if (num < 0){ return "" + num; }
    else{ return "±0"; }
}

function resultCount(waCount, accepted){
    if (accepted){
        if (waCount == 0){ return "+"; }
        else{ return "+" + waCount; }
    }
    else{
        if (waCount == 0){ return "-"; }
        else{ return "-" + waCount; }
    }
}

function timeToScore(maxScore, endTime, submitTime, waCount){
    let endMinute = Math.floor(endTime / 60), submitMinute = Math.floor(submitTime / 60);
    let val1 = Math.ceil( maxScore - (120*maxScore*submitMinute) / (250*endMinute) - 50*waCount );
    let val2 = Math.ceil( maxScore * 3/10 );
    return Math.max(val1, val2);
}

function frontZero(num, len){
    let res = "" + num;
    while (res.length < len){ res = '0' + res; }
    return res;
}

function secondToTime(second){
    let minute = Math.floor(second / 60); second %= 60;
    let hour = Math.floor(minute / 60); minute %= 60;
    let res = frontZero(hour, 2) + ":" + frontZero(minute, 2) + ":" + frontZero(second, 2);
    while (res.length > 4){
        if ('1' <= res[0] && res[0] <= '9'){ break; }
        else{ res = res.substring(1); }
    }
    return res;
}

function countMinus(count){
    if (count >= 6){ return 0; }
    if (count == 5){ return 50; }
    if (count == 4){ return 50+100; }
    if (count == 3){ return 50+100+150; }
    if (count == 2){ return 50+100+150+250; }
    if (count == 1){ return 50+100+150+250+350; }
    return 50+100+150+250+350+500;
}



function ratingHTML(rating){
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

function userRatingHTML(handle, rating){
    const rank = ratingToRank(rating);
    if (rank in rankFirstLetter){
        return '<span class="rated-user ' + rankToClass[rank] + '">'
             + '<span style="color: ' + rankFirstLetter[rank] + '">' + handle[0] + '</span>'
             + handle.substr(1)
             + '</span>'
    }
    else{
        return '<span class="rated-user ' + rankToClass[rank] + '">' + handle + '</span>'
    }
}

function deltaHTML(value){
    if (value > 0){ return '<span style="color: #008000; font-weight: bold">' + numberToPMString(value) + '</span>'; }
    else if (value < 0){ return '<span style="color: #808080; font-weight: bold">' + numberToPMString(value) + '</span>'; }
    else{ return '<span style="color: #000000; font-weight: bold">' + numberToPMString(value) + '</span>'; }
}

function hackHTML(successful, unsuccessful){
    let res = "";
    if (successful > 0){ res += '<span class="successfulChallengeCount">+' + successful + '</span>'; }
    if (successful > 0 && unsuccessful > 0){ res += ' : '; }
    if (unsuccessful > 0){ res += '<span class="unsuccessfulChallengeCount">-' + unsuccessful + '</span>'; }
    const score = 100*successful - 50*unsuccessful;
    if (successful > 0 || unsuccessful > 0){ res += '<br>' + deltaHTML(score); }
    return res;
}



async function CodeForcesEdit(showType, performanceColumn, virtualParticipation){
    console.log("Editing Codeforces Scoreboard with...");

    if (performanceColumn == SHOW_PERFORMANCE){
        console.log("- Showing Performance Column");
        if (showType == ACCURATE){ console.log("    - with Accurate Performance"); }
        if (showType == APPROXIMATE){ console.log("    - with Approximated Performance"); }
        if (virtualParticipation == INCLUDE_VIRTUAL){ console.log("    - with virtual participants"); }
        if (virtualParticipation == PARTIAL_VIRTUAL){ console.log("    - without virtual participants") }
    }
    if (performanceColumn == HIDE_PERFORMANCE){ console.log("- Hiding Performance Column"); }

    if (virtualParticipation == EXCLUDE_VIRTUAL){ console.log("- Not showing virtual participants"); }
    if (virtualParticipation == PARTIAL_VIRTUAL || virtualParticipation == INCLUDE_VIRTUAL){ console.log("- Showing virtual participants"); }

    const contestID = getContestIdFromURL();
    const contest = await callAPI('https://codeforces.com/api/contest.standings?contestId=' + contestID + '&showUnofficial=true')

    const allScoreboard = [];
    contest.rows.forEach(row => {
        if (row.party.participantType == "CONTESTANT" || row.party.participantType == "OUT_OF_COMPETITION"
         || row.party.participantType == "VIRTUAL" && (virtualParticipation == PARTIAL_VIRTUAL || virtualParticipation == INCLUDE_VIRTUAL) ){
            allScoreboard.push(row);
        }
    });
    const allUserCount = allScoreboard.length;

    const contestList = await callAPI('https://codeforces.com/api/contest.list');
    let contestIndex = 0, oldRated = false, newRated = true;

    while (contestList[contestIndex].id != contestID){
        if (contestList[contestIndex].id == 1360){ newRated = false; }
        if (contestList[contestIndex].id == 590){ oldRated = true; }
        contestIndex += 1;
    }

    const ratedScoreboard = [];
    if (showType == ACCURATE){
        for (let rowIndex = 0; rowIndex < allUserCount; rowIndex++){
            const row = allScoreboard[rowIndex];
            const handle = row.party.members[0].handle;
            const history = await callAPI('https://codeforces.com/api/user.rating?handle=' + handle);
            
            row.isRated = false;

            let pointer = history.length - 1;
            for (let j = 0; j <= contestIndex; j++){
                if (pointer < 0){ break; }
                if (history[pointer].contestId == contestList[j].id){
                    if (j == contestIndex){
                        row.isRated = true;
                        row.beforeRating = history[pointer].oldRating;
                        row.afterRating = history[pointer].newRating;
                        if (pointer == 0){
                            if (newRated){ row.beforeRating = 100; }
                            else{ row.beforeRating = 1500; }
                        }
                    }
                    pointer -= 1;
                }
            }

            row.contestCount = pointer+1;
            if (pointer >= 0){
                row.rating = history[pointer].newRating;
                if (newRated){ row.rating += countMinus(row.contestCount); }
            }
            else{
                if (newRated){ row.rating = 1400; }
                else{ row.rating = 1500; }
            }

            if (row.isRated){ ratedScoreboard.push(row); }
        }
    }
    if (showType == APPROXIMATE){
        const ratedList = await callAPI('https://codeforces.com/api/contest.ratingChanges?contestId=' + contestID);
        for (let rowIndex = 0; rowIndex < allUserCount; rowIndex++){
            const row = allScoreboard[rowIndex];
            const handle = row.party.members[0].handle;
            row.isRated = false; row.rating = undefined;
            for (let ratedIndex = 0; ratedIndex < ratedList.length; ratedIndex++){
                if (ratedList[ratedIndex].handle == handle){
                    row.isRated = true; ratedScoreboard.push(row);
                    row.beforeRating = ratedList[ratedIndex].oldRating;
                    row.afterRating = ratedList[ratedIndex].newRating;
                    row.rating = row.beforeRating;
                    break;
                }
            }
        }
    }
    const ratedUserCount = ratedScoreboard.length;

    let allRank = 0, ratedRank = 0;
    if (ratedUserCount >= 1){
        let pointer = 0, score = ratedScoreboard[0].points;
        for (let ratedUserIndex = 0; ratedUserIndex < ratedUserCount; ratedUserIndex++){
            if (ratedScoreboard[ratedUserIndex].points != score){
                for (let i = pointer; i < ratedUserIndex; i++){ ratedScoreboard[i].ratedRank = i; }
                pointer = ratedUserIndex; score = ratedScoreboard[ratedUserIndex].points;
            }
        }
        for (let i = pointer; i < ratedUserCount; i++){ ratedScoreboard[i].ratedRank = ratedUserCount; }
    }
    if (showType == ACCURATE){
        let pointer = 0, score = allScoreboard[0].points;
        for (let allUserIndex = 0; allUserIndex < allUserCount; allUserIndex++){
            if (allScoreboard[allUserIndex].points != score){
                for (let i = pointer; i < allUserIndex; i++){ allScoreboard[i].allRank = i; }
                pointer = allUserIndex; score = allScoreboard[allUserIndex].points;
            }
        }
        for (let i = pointer; i < allUserCount; i++){ allScoreboard[i].allRank = allUserCount; }
    }

    if (ratedUserCount >= 1){
        for (let ratedUserIndex = 0; ratedUserIndex < ratedUserCount; ratedUserIndex++){
            const row = ratedScoreboard[ratedUserIndex];
            row.ratedSeed = 1;
            for (let i = 0; i < ratedUserCount; i++){
                if (i == ratedUserIndex){ continue; }
                row.ratedSeed += eloWinProbability(ratedScoreboard[ratedUserIndex].rating, row.rating);
            }
        }
    }
    if (showType == ACCURATE){
        // Calculate All Seeds
    }

    for (let ratedUserIndex = 0; ratedUserIndex < ratedUserCount; ratedUserIndex++){
        if (ratedUserIndex%100 == 0){ console.log(ratedUserIndex, ratedUserCount); }
        const row = ratedScoreboard[ratedUserIndex];
        let st = -10000, ed = 10001;
        while (st+1 <= ed-1){
            let mid = Math.floor( (st+ed)/2 );
            let seed = 1;
            for (let i = 0; i < ratedUserCount; i++){
                if (i == ratedUserIndex){ continue; }
                seed += eloWinProbability(ratedScoreboard[i].rating, mid);
            }
            if (seed < row.rank){ ed = mid; } else{ st = mid; }
        }
        let res = st;
        if (res == -10000){ row.ratedPerformance = -Infinity; }
        else if (res == 10000){ row.ratedPerformance = Infinity; }
        else{ row.ratedPerformance = res; }
    }

    if (showType == ACCURATE){
        // Calculate All Performance
    }
    if (showType == APPROXIMATE){
        for (let allUserIndex = 0; allUserIndex < allUserCount; allUserIndex++){
            let st = allUserIndex, ed = allUserIndex;
            while (0 <= st){
                if (allScoreboard[st].ratedPerformance != undefined){ break; }
                else{ st -= 1; }
            }
            while (ed < allUserCount){
                if (allScoreboard[ed].ratedPerformance != undefined){ break; }
                else{ ed += 1; }
            }
            if (0 <= st && allScoreboard[st].rank == allScoreboard[allUserIndex].rank){
                allScoreboard[allUserIndex].allPerformance = allScoreboard[st].ratedPerformance;
            }
            else if (ed < allUserCount && allScoreboard[ed].rank == allScoreboard[ed].rank){
                allScoreboard[allUserIndex].allPerformance = allScoreboard[ed].ratedPerformance;
            }
            else{
                if (st < 0){ allScoreboard[allUserIndex].allPerformance = Infinity; }
                else if (allUserCount <= ed){ allScoreboard[allUserIndex].allPerformance = -Infinity; }
                else{
                    let p1 = allScoreboard[st].ratedPerformance, p2 = allScoreboard[ed].ratedPerformance;
                    let r1 = allScoreboard[st].allRank, r2 = allScoreboard[ed].allRank;
                    let r = allScoreboard[allUserIndex].allRank;
                    allScoreboard[allUserIndex].allPerformance = Math.round( (r-r1) * (p2-p1)/(r2-r1) + p1 );
                }
            }
        }
    }

    const problemCount = contest.problems.length;
    let problemConverter = {};
    for (let i = 0; i < problemCount; i++){
        problemConverter[ contest.problems[i].index ] = i;
    }

    let showArray = [];
    {
        const scoreboard = document.getElementsByClassName('standings')[0].children[0];
        const rowCount = scoreboard.childElementCount;
        for (let rowIndex = 1; rowIndex < rowCount-1; rowIndex++){
            const handle = scoreboard.children[rowIndex].children[1].getElementsByTagName('a')[0].innerText;
            if ( !showArray.includes(handle) ){ showArray.push(handle); }
        }
    }
    const showCount = showArray.length;

    allRank = 1;
    for (let rowIndex = 0; rowIndex < allUserCount; rowIndex++){
        if (rowIndex != 0 && allScoreboard[rowIndex-1].points != allScoreboard[rowIndex].points){ allRank = rowIndex+1; }
        allScoreboard[rowIndex].allRank = allRank;
    }
    ratedRank = 1;
    for (let rowIndex = 0; rowIndex < ratedUserCount; rowIndex++){
        if (rowIndex != 0 && ratedScoreboard[rowIndex-1].points != ratedScoreboard[rowIndex].points){ ratedRank = rowIndex+1; }
        ratedScoreboard[rowIndex].ratedRank = ratedRank;
    }

    const scoreboard = document.getElementsByClassName('standings')[0];
    scoreboard.innerHTML = "";

    const thead = createTag('thead');
    {
        const tr = createTag('tr');

        tr.appendChild( createTag('th', { innerHTML: "Rank", className: 'top left', style: { width: '4em' } }) );
        tr.appendChild( createTag('th', { innerHTML: "User", className: 'top' }) );
        tr.appendChild( createTag('th', { innerHTML: "Score", className: 'top', style: { width: '4em' } }) );
        tr.appendChild( createTag('th', { innerHTML: "Hacks", className: 'top', style: { width: '4em' } }) );
        for (let problemIndex = 0; problemIndex < problemCount; problemIndex++){
            const problem = contest.problems[problemIndex];
            const th = createTag('th', { innerHTML: '<span>' + problem.index + '</span>', className: 'top', style: { width: '5em' } });
            if (problem.rating != undefined){ th.innerHTML += '<sup class="small">' + ratingHTML(problem.rating) + '</sup>'; }
            if (problem.points != undefined){ th.innerHTML += '<br>' + '<span class="small">' + problem.points + '</span>'; }
            tr.appendChild(th);
        }
        if (performanceColumn == SHOW_PERFORMANCE){
            tr.appendChild( createTag('th', { innerHTML: "Perf.", className: 'top', style: { width: '4em' } }) );
            tr.appendChild( createTag('th', { innerHTML: "Delta", className: 'top', style: { width: '4em' } }) );
            tr.appendChild( createTag('th', { innerHTML: "Rating", className: 'top right', style: { width: '8em' } }) );
        }

        thead.appendChild(tr);
    }
    scoreboard.appendChild(thead);

    const tbody = createTag('tbody');
    for (let i = 0; i < showCount; i++){
        const handle = showArray[i];
        const tr = createTag('tr');
        const dark = (i%2 == 0) ? 'dark' : 'light';
        console.log("Showing:", handle);

        let ratedData = {}, rated = false;
        let allData = {}, all = false;
        ratedScoreboard.forEach(row => {
            if (row.party.members[0].handle == handle){ ratedData = row; rated = true; }
        });
        allScoreboard.forEach(row => {
            if (row.party.members[0].handle == handle){ allData = row; all = true; }
        });
        if (!all){ continue; }

        if (showType == APPROXIMATE){
            const history = await callAPI('https://codeforces.com/api/user.rating?handle=' + handle);
            let historyPointer = history.length - 1;
            for (let historyIndex = 0; historyIndex <= contestIndex; historyIndex++){
                if (historyPointer < 0){ break; }
                if (history[historyPointer].contestId == contestList[historyIndex].id){ historyPointer -= 1; }
            }
            if (newRated){ allData.rating = 100; } else{ allData.rating = 1500; }
            if (historyPointer >= 0){ allData.rating = history[historyPointer].newRating; }
            allData.beforeRating = allData.rating;
        }

        const submissions = await callAPI('https://codeforces.com/api/contest.status?contestId=' + contestID + '&handle=' + handle);
        const result = Array(problemCount);
        for (let problemIndex = 0; problemIndex < problemCount; problemIndex++){ result[problemIndex] = []; }
        submissions.forEach(submit => {
            if (submit.author.participantType == "CONTESTANT" || submit.author.participantType == "OUT_OF_COMPETITION"
             || submit.author.participantType == "VIRTUAL" && (virtualParticipation == PARTIAL_VIRTUAL || virtualParticipation == INCLUDE_VIRTUAL) ){
                result[ problemConverter[ submit.problem.index ] ].push(submit);
            }
        });

        if (rated){
            tr.appendChild( createTag('td', {
                className: 'left ' + dark,
                innerHTML: ratedData.ratedRank + '<br>' + '<small style="color: #BBBBBB">' + '(' + allData.allRank + ')' + '</small>'
            }) );
            tr.appendChild( createTag('td', {
                className: 'contestant-cell ' + dark,
                innerHTML: userRatingHTML(handle, ratedData.beforeRating),
                style: { textAlign: 'left', paddingLeft: '1em' }
            }) );
        }
        else{
            tr.appendChild( createTag('td', {
                className: 'left ' + dark,
                innerHTML: '-' + '<br>' + '<small style="color: #BBBBBB">' + '(' + allData.allRank + ')' + '</small>'
            }) );
            if (allData.party.participantType == "OUT_OF_COMPETITION"){
                tr.appendChild( createTag('td', {
                    className: 'contestant-cell ' + dark,
                    innerHTML: '<small>*</small> ' + userRatingHTML(handle, allData.beforeRating),
                    style: { textAlign: 'left', paddingLeft: '1em' }
                }) );
            }
            if (allData.party.participantType == "VIRTUAL"){
                tr.appendChild( createTag('td', {
                    className: 'contestant-cell ' + dark,
                    innerHTML: '<small>#</small> ' + userRatingHTML(handle, allData.beforeRating),
                    style: { textAlign: 'left', paddingLeft: '1em' }
                }) );
            }
        }
        tr.appendChild( createTag('td', { className: dark, innerHTML: allData.points, style: { fontWeight: 'bold' } }) );
        tr.appendChild( createTag('td', {
            className: dark, innerHTML: hackHTML(allData.successfulHackCount, allData.unsuccessfulHackCount),
            style: { fontSize: '9px' }
        }) );
        for (let problemIndex = 0; problemIndex < problemCount; problemIndex++){
            let acceptedSubmit = {}, accepted = false, acceptedWACount = 0;
            let systestSubmit = {}, systest = false, systestWACount = 0;
            let hackedSubmit = {}, hacked = false, hackedWACount = 0;
            let finalSubmit = {}, submitted = false, waCount = 0;
            result[problemIndex].forEach(submit => {
                if (submit.verdict == "OK" && !accepted){ acceptedSubmit = submit; accepted = true; }
                else if (submit.testset == "TESTS" && !systest){ systestSubmit = submit; systest = true; }
                else if (submit.verdict == "CHALLENGED" && !hacked){ hackedSubmit = submit; hacked = true; }
                if (!submitted){ finalSubmit = submit; submitted = true;}
                if (submit.passedTestCount > 0){
                    if (accepted){ acceptedWACount += 1; }
                    if (systest){ systestWACount += 1; }
                    if (hacked){ hackedWACount += 1; }
                    if (submitted){ waCount += 1; }
                }
            });
            if (accepted){
                tr.appendChild( createTag('td', { className: dark, innerHTML: '<span class="cell-passed-system-test">' + timeToScore(contest.problems[problemIndex].points, contest.contest.durationSeconds, acceptedSubmit.relativeTimeSeconds, waCount) + '</span>'
                + '<span class="cell-time">' + secondToTime(acceptedSubmit.relativeTimeSeconds) + ', ' + resultCount(acceptedWACount-1, true) + '</span>' }) )
            }
            else if (systest){
                tr.appendChild( createTag('td', { className: dark, innerHTML: '<span class="cell-failed-system-test" style="text-decoration-line: line-through">' + timeToScore(contest.problems[problemIndex].points, contest.contest.durationSeconds, systestSubmit.relativeTimeSeconds, systestWACount) + '</span>'
                + '<span class="cell-time">' + secondToTime(systestSubmit.relativeTimeSeconds) + ', ' + resultCount(systestWACount, false) + '</span>' }) );
            }
            else if (hacked){
                tr.appendChild( createTag('td', { className: dark, innerHTML: '<span class="cell-challenged" style="text-decoration-line: line-through">' + timeToScore(contest.problems[problemIndex].points, contest.contest.durationSeconds, hackedSubmit.relativeTimeSeconds, hackedWACount) + '</span>'
                + '<span class="cell-time">' + secondToTime(hackedSubmit.relativeTimeSeconds) + ', ' + resultCount(waCount, false) + '</span>' }) );
            }
            else if (submitted){
                tr.appendChild( createTag('td', { className: dark, innerHTML: '<span class="cell-rejected">' + resultCount(waCount, false) + '</span>'
                + '<span class="cell-time">' + secondToTime(finalSubmit.relativeTimeSeconds) + '</span>' }) );
            }
            else{
                tr.appendChild( createTag('td', { className: dark }) );
            }
        }
        if (performanceColumn == SHOW_PERFORMANCE){
            if (allData.isRated){ // Rated (RatingChange = true)
                if (showType == ACCURATE){ // Rated Performance + All Performance
                    tr.appendChild( createTag('td', { className: dark, innerHTML: ratingHTML(allData.ratedPerformance)
                     + '<br><span class="small">' + ratingHTML(allData.allPerformance) + '</span>' }) )
                }
                if (showType == APPROXIMATE){ // Rated Performance
                    tr.appendChild( createTag('td', { className: dark, innerHTML: ratingHTML(allData.ratedPerformance) }) );
                }
                tr.appendChild( createTag('td', { className: dark, innerHTML: deltaHTML(allData.afterRating - allData.beforeRating) }) );
                if (ratingToRank(allData.beforeRating) != ratingToRank(allData.afterRating)){
                    tr.appendChild( createTag('td', { className: dark, innerHTML: ratingHTML(allData.beforeRating)
                     + (allData.beforeRating < allData.afterRating ? ' ↗ ' : ' ↘ ') + ratingHTML(allData.afterRating) }) );
                }
                else{
                    tr.appendChild( createTag('td', { className: dark, innerHTML: ratingHTML(allData.beforeRating) + ' → ' + ratingHTML(allData.afterRating) }) );
                }
            }
            else{ // Unrated (RatingChange = false)
                if (showType == ACCURATE){ // All Performance
                    tr.appendChild( createTag('td', { className: dark, innerHTML: "-"
                        + '<br><span class="small">' + ratingHTML(allData.allPerformance) + '</span>' }) );
                }
                if (showType == APPROXIMATE){ // Approximated Performance using Rated Performance
                    tr.appendChild( createTag('td', { className: dark, innerHTML: '<span class="small">' + ratingHTML(allData.allPerformance) + '</span>' }) );
                }
                tr.appendChild( createTag('td', { className: dark, innerHTML: '<span style="font-weight: bold; color: lightgrey;" class="small">Unrated</span>' }) )
                tr.appendChild( createTag('td', { className: dark, innerHTML: ratingHTML(allData.beforeRating) }) );
            }
        }
        tbody.appendChild(tr);
    }
    scoreboard.appendChild(tbody);
} CodeForcesEdit(APPROXIMATE, SHOW_PERFORMANCE, PARTIAL_VIRTUAL);