const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const leftBox = $('#root .left')
const resultBox = $('#root .result')
const inputBox = $('#root .left .input')

const spinButton = $('#root .left .btn .spin')
const resetButton = $('#root .left .btn .reset')
const spaceBox = $('#root .space')
// import spinnerData from './data.json' assert {type: 'json'}
let spinnerData
function getData() {
	fetch('https://spinner-uto.vercel.app/data.json').then(res => res.json()).then(data => spinnerData = data)
}
function randomCustom(length) {
	return Math.floor(Math.random() * length)
}
function Replace(text) {
	let result = {
		origin: '',
		replace: ''
	}
	let replaceText = text
	let originText = text
	spinnerData.forEach(array => {
		array.some((string, i, strings) => {
			var pretext = replaceText
			replaceText = replaceText.replace(string, `<span class="hn">${strings[randomCustom(strings.length)]}</span>`)
			originText = originText.replace(string, `<span class="hn">${string}</span>`)
			if (pretext !== replaceText) return true
		})
	})
	replaceText = replaceText.replace(/\n/gi, "<br />")
	result.replace = replaceText

	originText = originText.replace(/\n/gi, "<br />")
	result.origin = originText
	return result
}
function Replace2(text) {
	let result = {
		origin: '',
		replace: ''
	}
	let replaceText = text
	let originText = text

	SpinData.forEach(array => {
		array.some((string, i, strings) => {
			var pretext = replaceText
			// get all word matching
			let wordList = [
				{
					word: " " + string + " ",
					sign: " "
				},
				{
					word: " " + string + ".",
					sign: "."
				},
				{
					word: " " + string + ",",
					sign: ","
				}
			]
			// change word
			wordList.map((word, index) => {
				replaceText = replaceText.replace(word.word, '<span>' + " " + strings[randomCustom(strings.length)] + word.sign + '</span>')
				originText = originText.replace(word.word, '<span>' + word.word + '</span>')
			})

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
	let r = Math.floor(Math.random() * 56 + 200)
	let g = Math.floor(Math.random() * 56 + 200)
	let b = Math.floor(Math.random() * 56 + 200)
	return `rgb(${r},${g},${b})`
}
function handleReset() {
	resetButton.onclick = function () {
		const currentInput = $('#root .left .input')
		const currentResult = $('#root .right .result')
		if (!currentResult.hasChildNodes() && !currentInput.hasChildNodes())
			return
		let text = "Thao tác này sẽ làm mất những lần spin trước đó.\n Nhấn OK để tiếp tục."
		if (confirm(text)) {
			currentInput.innerHTML = ''
			currentResult.innerHTML = ''
		}
	}
}
function handleTextNode(originElement) {
	const originList = originElement.querySelectorAll('*')
	originList.forEach(element => {
		if (element.childNodes.length > 1) {
			element.childNodes.forEach(child => {
				if (child.nodeName === '#text') {
					const newSpanElement = document.createElement('span')
					newSpanElement.innerText = child.nodeValue
					element.replaceChild(newSpanElement, child)
				}
			})
		}
	})
}
function highlightWord(originElement, replaceElement) {
	const originList = originElement.querySelectorAll('*')
	const replaceList = replaceElement.querySelectorAll('*')
	originList.forEach((element, i) => {
		if (element.nodeName !== 'IMG' && element.childNodes[0].nodeName === '#text' && element.childNodes.length === 1) {
			const text = Replace(element.innerText)
			element.innerHTML = text.origin
			replaceList[i].innerHTML = text.replace
		}
	})
}
function handleSpin() {
	const x = $('#root .left .input')
	x.onfocus = function () {
	}
	x.onblur = function () {
	}
	spinButton.onclick = function () {
		if (!inputBox.textContent) {
			alert('Nhập nội dung trước khi khi spin')
			return
		}
		const currentInputBox = $('#root .left .input')
		const currentResultBox = $('#root .right .result')
		handleTextNode(currentInputBox)
		currentResultBox.innerHTML = ''
		resultBox.append(currentInputBox.cloneNode(true))
		highlightWord(currentInputBox, resultBox.childNodes[0])
		currentInputBox.scrollTop = 0
	}
}
function handleDragging() {
	$$('.result .child').forEach(child => {
		child.addEventListener('dragstart', function () {
			child.classList.add('dragging')
		})
		child.addEventListener('dragend', function () {
			child.classList.remove('dragging')
		})
	})
	const currentResultBox = $('.result')
	currentResultBox.addEventListener('dragover', function (e) {
		e.preventDefault()
		const afterElement = getDragAfterElement(currentResultBox, e.clientY)
		const child = $('.dragging')
		if (afterElement == undefined) {
			currentResultBox.append(child)
		} else {
			currentResultBox.insertBefore(child, afterElement)
		}
	})
}
function getDragAfterElement(child, y) {
	const childs = [...child.querySelectorAll('.result .child:not(.dragging)')]
	return childs.reduce((closest, current) => {
		const box = current.getBoundingClientRect()
		const offset = y - box.top - box.height / 2
		if (offset < 0 && offset > closest.offset) {
			return { offset: offset, element: current }
		} else {
			return closest
		}
	}, { offset: Number.NEGATIVE_INFINITY }).element
}
function handleScroll() {
	function handleScrollInputBox() {
		resultBox.scrollTop = inputBox.scrollTop
	}
	function handleScrollResultBox() {
		inputBox.scrollTop = resultBox.scrollTop
	}
	inputBox.onmouseenter = function (e) {
		e.target.addEventListener('scroll', handleScrollInputBox)
	}
	inputBox.onmouseleave = function (e) {
		e.target.removeEventListener('scroll', handleScrollInputBox)
	}
	resultBox.onmouseenter = function (e) {
		e.target.addEventListener('scroll', handleScrollResultBox)
	}
	resultBox.onmouseleave = function (e) {
		e.target.removeEventListener('scroll', handleScrollResultBox)
	}
}
getData()
handleReset()
handleScroll()
handleSpin()