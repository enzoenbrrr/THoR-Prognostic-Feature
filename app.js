function areNotesWaiting(subject){
    waiting = false;

    allNotes = Array.from(subject.childNodes)
    allNotes.pop()

    allNotes.forEach(note => {
        if(note.childNodes[1].innerText == '-'){
            waiting = true;
        }
    });
    return waiting
}

function pointOfSubject(subject){
    return parseFloat(subject.lastChild.children[1].innerText.split(" ")[0].split('/')[1])
}

function getNote(note){
    return Math.round(1000 * parseFloat(note.split("/")[0])/parseFloat(note.split("/")[1]))/1000
}

function findPercentage(row) {
    set = 0;
    const elements = row.querySelectorAll('*');
    if(Array.from(elements).find(element => element.innerText.includes('%'))){
        set = parseFloat(Array.from(elements).find(element => element.innerText.includes('%')).innerText.split('%')[0])
    }

    return set;
}

function setPredictedMark(subject){
    onPoints = pointOfSubject(subject);
    totalPoints = 0;

    subject.childNodes.forEach(row => {
        pourcent = findPercentage(row);
        if(row.querySelector('.badge')){
            totalPoints += getNote(row.querySelector('.badge').innerText) * pourcent
        }else if(row.querySelector('.enzoenbrrr-input')){
            totalPoints += getNote(row.querySelector('.enzoenbrrr-input').value) * pourcent
        }
    })
    return Math.round(1000*(totalPoints * onPoints / 100)) / 1000
}

function updateNote(subject){
    str = `${setPredictedMark(subject)}/${pointOfSubject(subject)} - ${Math.round(1000*(setPredictedMark(subject)*20/pointOfSubject(subject)))/1000}/20<br>Après pronostic.`
    if(subject.lastChild.classList.contains('table-danger')){
        subject.children[subject.childrenCount - 2].children[1].innerHTML = str
    }else{
        subject.lastChild.children[1].innerHTML = str
    }
    
}

function updateFinale(){
    const rows = Array.from(document.getElementsByClassName('tab-pane fade show active')[0].querySelectorAll("tr"));
    const totalSemestreRows = rows.filter(e => e.innerText.includes('Total'));
    u = totalSemestreRows.pop();
    total = 0;
    totalSemestreRows.forEach(row => {
        total += Math.round(1000 * parseFloat(row.children[1].innerText.split('/')[0]))/1000
    })
    max = u.children[1].innerText.split("/")[1].split(" ")[0]
    i = parseFloat(document.getElementsByClassName('enzoenbrrr-btn')[0].id);
    if(i ==0){
        t = "Après pronostic."
    }else{
        total += i;
        t = `Après pronostic et ajout de ${i} points.`	
    }
    total = Math.round(1000 * total) / 1000;
    str = `${total}/${max} (${Math.round(1000*(total*20/max))/1000}/20)<br>${t}`;
    u.children[1].innerHTML =  str;
}

function inputIsValid(input){
    
    if(parseFloat(input.value.split('/')[0]) != 0 && isNaN(parseFloat(input.value.split('/'))/parseFloat(input.value.split('/')))){
        
        input.style.backgroundColor = 'grey';
    }else{
        input.style.backgroundColor = '#7f75df';
    }
}

function addToTotal(){
    val = prompt("Nombre de points à rajouter au semestre : ", 0);
    document.getElementsByClassName('enzoenbrrr-btn')[0].id = val;
    updateFinale();
}

(()=>{
    document.getElementsByClassName('tab-pane fade active show')[0].querySelectorAll('tbody').forEach(subject => {
        if(areNotesWaiting(subject)){
            Array.from(subject.children).slice(0, subject.children.length-1).forEach(row => {
                if(row.children[1].innerText == '-'){
                    row.children[1].innerText = "";
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = "0 / 20";
                    input.setAttribute('maxlength', '10');
                    input.classList.add('enzoenbrrr-input');
                    input.addEventListener('input', ()=>{inputIsValid(input);updateNote(subject);updateFinale()});
                    row.children[1].appendChild(input);
                }
            })
        }
    })

    function addStyle(text){
        sty = document.createElement('style')
        sty.innerHTML = text;
        document.head.appendChild(sty)
    }
    fetch('https://raw.githubusercontent.com/enzoenbrrr/THoR-Prognostic-Feature/refs/heads/main/style.css').then(r => r.text()).then(f => addStyle(f))

    const bootstrap = document.createElement('link');
    bootstrap.rel = 'stylesheet';
    bootstrap.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
    document.head.appendChild(bootstrap);

    btn = document.createElement('button')
    btn.innerHTML = '<i class="bi bi-plus-square-dotted"></i>'
    btn.addEventListener('click', addToTotal);
    btn.classList.add('enzoenbrrr-btn');
    btn.id = '0';
    document.querySelector("body > div").appendChild(btn);
})();

(()=>{
    console.clear()
    console.log('Script loaded.')
})()


