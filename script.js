import SpinData from './data.json' assert { type: "json" };

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const textArea = $('.root .input .container > textarea')
const backDrop = $('.root .input .container .backdrop')
const handleSpin = $('.root button')
const result = $('.result')
function handleScroll() {
    textArea.onscroll = function (e) {
        backDrop.scrollTop = textArea.scrollTop;
    }
}
function randomCustom(length) {
    let randomNumber = Math.floor(Math.random() * length)
    return randomNumber
}
function Replace(text) {
    let result = {
        origin: '',
        replace: ''
    }
    let replaceText = text
    let originText = text
    SpinData.forEach(array => {
        array.some((string, i, strings) => {
            var pretext = replaceText
            replaceText = replaceText.replace(string, '<span>' + strings[randomCustom(strings.length)] + '</span>')
            originText = originText.replace(string, '<span>' + string + '</span>')
            if (pretext !== replaceText) return true
        })
    })
    replaceText = replaceText.replace(/\n/gi, "<br />")
    result.replace = replaceText

    originText = originText.replace(/\n/gi, "<br />")
    result.origin = originText
    return result
}
function randomColor() {
    let r = Math.floor(Math.random() * 56 + 200);
    let g = Math.floor(Math.random() * 56 + 200);
    let b = Math.floor(Math.random() * 56 + 200);
    return `rgb(${r},${g},${b})`
}
handleSpin.onclick = function() {
    const _text = $('.root textarea')
    const text = Replace(_text.value)
    console.log(text)
    backDrop.innerHTML = text.origin
    let newChild = document.createElement("div")
    newChild.setAttribute("class", "child")
    newChild.style.backgroundColor = randomColor()
    newChild.innerHTML = text.replace
    result.prepend(newChild)

    let btnResult = document.createElement('button')
    btnResult.setAttribute("class", "closeBtn")
    btnResult.textContent = 'toggle'
    $('.result .child').append(btnResult)
    $$('.result .child .closeBtn').forEach((element, i) => {
        element.onclick = function (e) {
            $$('.result .child')[i].classList.toggle('set-height')
        }
    })
    backDrop.scrollTop = textArea.scrollTop;
}
handleScroll()