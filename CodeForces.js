function createTag(obj){
    const tag = document.createElement(obj.tag);
    if ('class' in obj){ tag.className = obj.class; }
    if ('html' in obj){ tag.innerHTML = obj.html; }
    if ('width' in obj){ tag.style.width = obj.width; }
    return tag;
}

const pn = 6

function CodeForcesEdit(){
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
        for (let pi = 0; pi < pn; pi++){
            let ps = String.fromCharCode(pi+65);
            tr.appendChild( createTag({
                tag: 'th',
                html: '<span>' + String.fromCharCode(pi+65) + '<sup class="small">' + (pi+2)*400 + '</sup></span>' + '<br>'
                    + '<span class="small">' + (pi+1)*500 + '</span>',
                class: 'top', width: '5em'
            }) );
        }
        tr.appendChild( createTag({ tag: 'th', html: 'Perf.', class: 'top', width: '4em' }) );
        tr.appendChild( createTag({ tag: 'th', html: 'Delta', class: 'top', width: '4em' }) );
        tr.appendChild( createTag({ tag: 'th', html: 'Rating', class: 'top right', width: '8em' }) );

        thead.appendChild(tr);
    }

    scoreboard.appendChild(thead);
    scoreboard.appendChild(tbody);
} CodeForcesEdit();