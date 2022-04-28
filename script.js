import SpinData from './data.json' assert { type: "json" };

function randomCustom(length) {
    let randomNumber = Math.floor(Math.random() * length)
    return randomNumber
}
function Replace(text) {
    let result = text
    SpinData.forEach(array => {
        array.some((string, i, strings) => {
            var pretext = result
            result = result.replace(string, '<span>' + strings[randomCustom(strings.length)] + '</span>')
            if (pretext !== result) return true
        })
    })
    result = result.replace(/\n/gi, "<br />")
    return result
}
function randomColor() {
    let r = Math.floor(Math.random() * 56 + 200);
    let g = Math.floor(Math.random() * 56 + 200);
    let b = Math.floor(Math.random() * 56 + 200);
    return `rgb(${r},${g},${b})`
}
document.querySelector('.root button').onclick = function() {
    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)
    let text = $('.root textarea')
    
    let newResult = document.createElement("div")
    newResult.setAttribute("class", "child")
    newResult.innerHTML = Replace(text.value)
    newResult.style.backgroundColor = randomColor()
    $('.result').prepend(newResult)

    let btnResult = document.createElement('button')
    btnResult.setAttribute("class", "closeBtn")
    btnResult.textContent = 'toggle'
    $('.result .child').append(btnResult)
    $$('.result .child .closeBtn').forEach((element, i) => {
        element.onclick = function (e) {
            $$('.result .child')[i].classList.toggle('set-height')
        }
    })
    // $$('.result .child .closeBtn').onclick = function () {
    //     $('.result .child').classList.toggle('set-height')
    // }
}
    
