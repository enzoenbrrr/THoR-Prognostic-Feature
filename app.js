// Liste de toutes les matières
// document.getElementsByClassName('tab-pane fade active show')[0].querySelectorAll('tbody')

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
        }else if(row.querySelector('.enzoenbrrr-input-style')){
            totalPoints += getNote(row.querySelector('.enzoenbrrr-input-style').value) * pourcent
        }
    })
    return Math.round(1000*(totalPoints * onPoints / 100)) / 1000
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
                    let style_enzoenbrrr = "border: none;background-color: #7f75df;font-size: 0.8rem;font-weight: 700;color: white;border-radius: 0.375rem;padding: 0px px;width: 4rem;text-align: center;outline: none;"
                    input.setAttribute('style', style_enzoenbrrr);
                    input.setAttribute('maxlength', '7');
                    input.classList.add('enzoenbrrr-input-style');
                    input.addEventListener('input', ()=>{updateNote(subject)});
                    row.children[1].appendChild(input);
                }
            })
        }
    })
})();

function updateNote(subject){
    subject.lastChild.children[1].innerHTML = `${setPredictedMark(subject)}/${pointOfSubject(subject)} - ${Math.round(1000*(setPredictedMark(subject)*20/pointOfSubject(subject)))/1000}/20<br>Après pronostic.`
}