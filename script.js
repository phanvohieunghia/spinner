const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const resultBox = $('#root .result')
const inputBox = $('#root .left .input')
const spinButton = $('#root .left .btn .spin')
const resetButton = $('#root .left .btn .reset')
const spellCheckerButton = $('#root .right .btn .spellcheck')
// import spinnerData from './replace-data.json' assert {type: 'json'}
import spinnerData from './replace-data.json' assert {type: 'json'}
import spellcheckData from './spellcheck-data.json' assert {type: 'json'}
// let spinnerData
// let spellcheckData

function getReplaceData() {
	fetch('https://spinner-uto.vercel.app/replace-data.json')
		.then(res => res.json()).then(data => spinnerData = data)
		.catch(error => console.log('Lỗi: ', error))
}
function getSpellcheckData() {
	fetch('https://spinner-uto.vercel.app/spellcheckerData.json')
		.then(res => res.json()).then(data => spellcheckData = data)
		.catch(error => console.log('Lỗi: ', error))
}
function randomCustom(length) {
	return Math.floor(Math.random() * length)
}
function superReplace(text) {
	let result = {
		origin: '',
		replace: ''
	}
	let replaceText = text
	let originText = text
	spinnerData.forEach(array => {
		array.some((string, i, strings) => {
			const preText = replaceText
			let symbolList = [" ", ",", ".", "?", "!"]
			symbolList.some(symbol => {
				const preText = replaceText
				replaceText = replaceText.replace(` ${string}${symbol}`, ` <span class="hn">${strings[randomCustom(strings.length)]}</span>${symbol}`)
				originText = originText.replace(` ${string}${symbol}`, ` <span class="hn">${string}</span>${symbol}`)
				return preText !== replaceText
			})
			return preText !== replaceText
		})
	})
	replaceText = replaceText.replace(/\n/gi, "<br />")
	result.replace = replaceText

	originText = originText.replace(/\n/gi, "<br />")
	result.origin = originText
	return result
}
function normalReplace(text) {
	let replaceText = text
	spinnerData.forEach(array => {
		array.some((string, i, strings) => {
			let pretext = replaceText
			if (replaceText === string) {
				replaceText = strings[randomCustom(strings.length)]
			}
			return pretext !== replaceText
		})
	})
	return replaceText
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
		if (element.childNodes[0]) {
			if (element.nodeName !== 'IMG' && element.childNodes[0].nodeName === '#text' && element.childNodes.length === 1) {
				const text = superReplace(element.innerText)
				element.innerHTML = text.origin
				replaceList[i].innerHTML = text.replace
			}
		}
	})
}
function handleSpinResultBox(replaceElement) {
	const replaceList = replaceElement.querySelectorAll('.hn')
	replaceList.forEach((element, i) => {
		if (element.nodeName !== 'IMG' && element.childNodes[0].nodeName === '#text' && element.childNodes.length === 1) {
			element.innerHTML = normalReplace(element.innerText)
		}
	})
}
function handleSpin() {
	let numberClick = 0
	spinButton.onclick = function () {
		if (!inputBox.textContent) {
			alert('Nhập nội dung trước khi khi spin')
			return
		}
		const currentInputBox = $('#root .left .input')
		if (!numberClick) {
			handleTextNode(currentInputBox)
			resultBox.innerHTML = ''
			resultBox.append(currentInputBox.cloneNode(true))
			highlightWord(currentInputBox, resultBox.childNodes[0])
			// handleHighlightWord(currentInputBox)
		} else {
			handleSpinResultBox(resultBox.childNodes[0])
		}
		currentInputBox.scrollTop = resultBox.scrollTop = 0
		numberClick++
	}
}
function handleWordCounter() {
	const x = $('#root .left .input').innerText
	const total = x.split(/[\n\r\s]+/g).filter(function (word) {
		return word.length > 0;
	}).length;
	$('.word-counter').innerText = total + ' words'
}
function handleHighlightWord(inputElement) {
	inputElement.querySelectorAll('.hn').forEach(element => {
		const newChild = document.createElement('div')
		newChild.setAttribute('class', 'hn-child')
		newChild.textContent = 'Một Hai Ba'
		element.appendChild(newChild)
	})
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
function handleInput() {
	handleWordCounter()
	inputBox.oninput = function () {
		handleWordCounter()
		const wordList = getWrongWordList()
		highlightWrongWord(wordList)
	}
}
function compareWord(wordList, index, data) {
	if (data[wordList[index]] === undefined) {
		return false
	}
	else if (index === wordList.length - 1 && data[wordList[index]]["_"] === '') {
		return true
	}
	else {
		index++
		return compareWord(wordList, index, data[wordList[index - 1]])
	}
}
function getWrongWordList() {
	const currentInputBox = $('#root .left .input').innerText
	const words = currentInputBox
		.split(/[^a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ]+/gi)
		.map(word => word.toLowerCase())
		.slice(0, -1)
	const wrongWords = []
	words.forEach((word, i) => {
		const characters = word.split('')
		const isCheck = compareWord(characters, 0, spellcheckData)
		if (!isCheck) {
			if (wrongWords.indexOf(word) < 0) {
				wrongWords.push(word);
			}
		}
	})
	return wrongWords
}
function highlightWrongWord(wrongWords) {
	let currentInputBox = $('#root .left .input').innerHTML
	wrongWords.forEach(word => {
		let re = new RegExp(word, 'gi')
		currentInputBox = currentInputBox
			.replace(re, `<span class="pv">${word}</span>`)
	})
	$('#root .left .input').innerHTML = currentInputBox
}

// getReplaceData()
handleSpin()
handleReset()
handleScroll()

// getSpellcheckData()
handleInput()