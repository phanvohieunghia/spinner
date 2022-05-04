const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const topBox = $('#root .top')
const resultBox = $('#root .result')
const inputBox = $('#root .top .input')

const spinButton = $('#root .spin')
const resetButton = $('#root .reset')
const spaceBox = $('#root .space')

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
			replaceText = replaceText.replace(string, `<span class="bd93f9-span">${strings[randomCustom(strings.length)]}</span>`)
			originText = originText.replace(string, `<span class="bd93f9-span">${string}</span>`)
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
		const currentResult = $('#root .result')
		const currentTextArea = $('#root .top .container > textarea')
		const currentBackdrop = $('#root .top .container .backdrop')
		if (!currentResult.hasChildNodes()
			&& !currentTextArea.value
			&& !currentBackdrop.hasChildNodes())
			return
		let text = "Thao tác này sẽ làm mất những lần spin trước đó.\n Nhấn OK để tiếp tục."
		if (confirm(text)) {
			$('#root .top .container > textarea').value = ''
			$('#root .top .container .backdrop').innerHTML = ''
			$('#root .result').innerHTML = ''
		}
	}
}
function createElementCustom(typeElement, classValue = null, text = '', srcValue = null, draggableValue = null) {
	let element = document.createElement(typeElement)
	classValue && element.setAttribute('class', classValue)
	srcValue && element.setAttribute('src', srcValue)
	draggableValue && element.setAttribute('draggable', draggableValue)
	element.innerHTML = text
	return element
}
function recursiveSpin(originElement, replaceElement) {
	originElement.childNodes.forEach((childElement, i) => {
		if (childElement.nodeValue) {
			const text = Replace(childElement.nodeValue)
			originElement.innerHTML = text.origin
			replaceElement.innerHTML = text.replace
		}
		recursiveSpin(childElement, replaceElement.childNodes[i])
	})
}
function handleSpin2() {
	spinButton.onclick = function () {
		if (!inputBox.textContent) {
			alert('Nhập nội dung trước khi khi spin')
			return
		}
		const currentInputBox = $('#root .top .input')
		resultBox.append(currentInputBox.cloneNode(true))
		recursiveSpin(currentInputBox, resultBox.childNodes[0])
	}
}
function handleSpin() {
	let spinNumber = 0;
	spinButton.onclick = function () {
		if (!inputBox.textContent) {
			alert('Nhập nội dung trước khi khi spin')
			return
		}
		const text = Replace($('#root .top .input').childNodes)
		let titleChild = createElementCustom('div', 'title')
		titleChild.append(createElementCustom('img', 'left', '', './grip-dots.svg'))
		titleChild.append(createElementCustom('span', 'mid', `Spin ${spinNumber + 1}`))
		spinNumber++
		titleChild.append(createElementCustom('button', 'right bd93f9-button', 'Toggle'))
		let contentChild = createElementCustom('div', 'content', text.replace)
		let newChild = createElementCustom('div', 'child', '', null, null)
		newChild.style.backgroundColor = randomColor()
		newChild.append(titleChild, contentChild)
		newChild.firstChild.firstChild.addEventListener('mousedown', function (e) {
			e.target.parentElement.parentElement.setAttribute('draggable', 'true')
			handleDragging()
		})
		newChild.firstChild.firstChild.addEventListener('mouseup', function (e) {
			e.target.parentElement.parentElement.removeAttribute('draggable')
		})
		resultBox.prepend(newChild)

		$$('.result .child .title .right').forEach((element, i) => {
			element.onclick = function () {
				element.parentElement.parentElement.classList.toggle('set-height')
			}
		})
	}
}
function handleRowResize() {
	spaceBox.addEventListener('mousedown', mouseDown)
	function mouseDown(e) {
		window.addEventListener('mousemove', mouseMove)
		window.addEventListener('mouseup', mouseUp)
		let prevY = e.clientY
		function mouseMove(e) {
			if (prevY / window.innerHeight <= 0.9 && prevY / window.innerHeight >= 0.1) {
				let newY = e.clientY - prevY;
				const rectInputBox = topBox.getBoundingClientRect()
				const rectResultBox = resultBox.getBoundingClientRect()
				topBox.style.height = rectInputBox.height + newY + 'px'
				resultBox.style.height = rectResultBox.height - newY + 'px'
			}
			prevY = e.clientY
		}
		function mouseUp() {
			window.removeEventListener('mousemove', mouseMove)
			window.removeEventListener('mousedown', mouseUp)
		}
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
getData()
handleReset()
// handleRowResize()
handleSpin2()

function Replace2(text) {
	let result = {
		origin: '',
		replace: ''
	}
	let replaceText = text
	let originText = text

	SpinData.forEach(array => {
		array.some((string, i, strings) => {
			// console.log(strings)
			var pretext = replaceText
			// get all word matching
			let wordList = [
				{
					word: " " + string + " ",
					sign: " "
				}
				,
				{
					word: " " + string + ".",
					sign: "."
				}
				,
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
