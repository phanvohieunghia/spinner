const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const resultBox = $('#root .result')
const inputBox = $('#root .left .input')
const spinButton = $('#root .left .btn .spin')
const resetButton = $('#root .left .btn .reset')
const spellcheckButton = $('#root .left .btn .spellcheck')

// import spinnerData from './replace-data.json' assert {type: 'json'}
// import spellcheckData from './spellcheck-data.json' assert {type: 'json'}
let spinnerData
let spellcheckData
let spinClick = false
let spellcheckClick = false

function getReplaceData() {
	fetch('https://spinner-uto.vercel.app/replace-data.json')
		.then(res => res.json()).then(data => spinnerData = data)
		.catch(error => console.log('Lỗi: ', error))
}
function getSpellcheckData() {
	fetch('https://spinner-uto.vercel.app/spellcheck-data.json')
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
				replaceText = replaceText.replace(` ${string}${symbol}`, ` <span class="hn" contentEditable="true">${strings[randomCustom(strings.length)]}</span>${symbol}`)
				originText = originText.replace(` ${string}${symbol}`, ` <span class="hn" contentEditable="true">${string}</span>${symbol}`)
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
	replaceList.forEach(element => {
		if (element.nodeName !== 'IMG' && element.childNodes[0].nodeName === '#text' && element.childNodes.length === 1) {
			element.innerHTML = normalReplace(element.innerText)
		}
	})
}
function handleSpin() {
	spinButton.onclick = function () {
		if (!inputBox.textContent) {
			alert('Nhập nội dung trước khi khi spin')
			return
		}
		const currentInputBox = $('#root .left .input')
		if (!spinClick) {
			handleTextNode(currentInputBox)
			resultBox.innerHTML = ''
			resultBox.append(currentInputBox.cloneNode(true))
			highlightWord(currentInputBox, resultBox.childNodes[0])
			spinClick = true
			// handleHighlightWord(currentInputBox)
		} else {
			const currentResultBox = $('#root .right .result')
			currentResultBox.innerHTML = $('#root .left .input').outerHTML
			const replaceResultBox = $('#root .right .result')
			handleSpinResultBox(replaceResultBox.childNodes[0])
		}
		currentInputBox.scrollTop = resultBox.scrollTop = 0
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
			spinClick = false
			spellcheckClick = false
		}
	}
}
function handleInput() {
	handleWordCounter()
	inputBox.oninput = function () {
		handleWordCounter()
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
	let words = currentInputBox
		.split(/[^a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ]+/g)
		.map(word => word.toLowerCase())
	if (words[words.length - 1].length == 0) {
		words = words.slice(0, -1)
	}
	const wrongWords = []
	words.forEach(word => {
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
	const re = new RegExp('<[a-z0-9 !;":\.,\-:=()/%]+>', 'gi')
	const textArray = currentInputBox.split(re).filter(text => text !== '&nbsp;' && text && text.search('http') === -1)
	const replaceTextArray = []
	textArray.forEach(text => {
		let filterTextArray = text
		wrongWords.forEach((word => {
			const re2 = new RegExp(word, 'gi')
			const searchIndex = text.search(re2)
			if (searchIndex != -1) {
				const originWord = text.substring(searchIndex, searchIndex + word.length)
				filterTextArray = filterTextArray
					.replace(originWord, `<span class="pv">${originWord}</span>`)
			}
		}))
		replaceTextArray.push(filterTextArray)
	})
	replaceTextArray.forEach((text, i) => {
		currentInputBox = currentInputBox.replace(textArray[i], text)
	})
	$('#root .left .input').innerHTML = currentInputBox
}
function removeHighlightWrongWord() {
	let currentInputBox = $('#root .left .input').innerHTML
	const filterSpanElement = []
	const spanElement = currentInputBox.match(/<span class="pv">[a-zA-Z&; _ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ]+<\/span>/gi)
	if (spanElement) {
		spanElement.forEach(element => {
			if (filterSpanElement.indexOf(element) < 0) {
				filterSpanElement.push(element);
			}
		})
		filterSpanElement.forEach(element => {
			let re = new RegExp(`${element}`, 'gi')
			const temp = element.replace('<span class="pv">', '').replace('</span>', '')
			currentInputBox = currentInputBox.replace(re, temp)
		})
		$('#root .left .input').innerHTML = currentInputBox
	}
}
function handleSpellcheck() {
	spellcheckButton.onclick = () => {
		const wordList = getWrongWordList()
		if (spellcheckClick) {
			removeHighlightWrongWord()
		} else {
			spellcheckClick = true
		}
		highlightWrongWord(wordList)
	}
}

getReplaceData()
handleSpin()
handleReset()
handleScroll()

getSpellcheckData()
handleInput()
handleSpellcheck()