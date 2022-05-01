import SpinData from './data.json' assert { type: "json" }
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const inputBox = $('#root .input')
const resultBox = $('#root .result')
const textArea = $('#root .input .container > textarea')
const backDrop = $('#root .input .container .backdrop')
const spinButton = $('#root .spin')
const resetButton = $('#root .reset')
const spaceBox = $('#root .space')

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
	let r = Math.floor(Math.random() * 56 + 200)
	let g = Math.floor(Math.random() * 56 + 200)
	let b = Math.floor(Math.random() * 56 + 200)
	return `rgb(${r},${g},${b})`
}
function handleReset() {
	resetButton.onclick = function () {
		const currentResult = $('#root .result')
		const currentTextArea = $('#root .input .container > textarea')
		const currentBackdrop = $('#root .input .container .backdrop')
		if (!currentResult.hasChildNodes()
			&& !currentTextArea.value
			&& !currentBackdrop.hasChildNodes())
			return
		let text = "Thao tác này sẽ làm mất những lần spin trước đó.\n Nhấn OK để tiếp tục."
		if (confirm(text)) {
			$('#root .input .container > textarea').value = ''
			$('#root .input .container .backdrop').innerHTML = ''
			$('#root .result').innerHTML = ''
		}
	}
}
function createElementCustom(typeElement, classValue = null, text = '', srcValue = null, draggableValue = null) {
	let x = document.createElement(typeElement)
	classValue && x.setAttribute('class', classValue)
	srcValue && x.setAttribute('src', srcValue)
	draggableValue && x.setAttribute('draggable', draggableValue)
	x.innerHTML = text
	return x
}
function handleChangeTextare() {
	textArea.oninput = function () {
		const text = Replace($('#root textarea').value)
		backDrop.innerHTML = text.origin
	}
}
handleChangeTextare()
function handleSpin() {
	let spinNumber = 0;
	spinButton.onclick = function () {
		if (!textArea.value) {
			alert('Nhập nội dung trước khi khi spin')
			return
		}
		const text = Replace($('#root textarea').value)
		backDrop.innerHTML = text.origin
		let titleChild = createElementCustom('div', 'title')
		titleChild.append(createElementCustom('img', 'left', '', './grip-dots.svg'))
		titleChild.append(createElementCustom('span', 'mid', `Spin ${spinNumber + 1}`))
		spinNumber++
		titleChild.append(createElementCustom('button', 'right bd93f9', 'Toggle'))
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
		backDrop.scrollTop = textArea.scrollTop
	}
}
function handleScroll() {
	textArea.onscroll = function (e) {
		backDrop.scrollTop = textArea.scrollTop
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
				const rectInputBox = inputBox.getBoundingClientRect()
				const rectResultBox = resultBox.getBoundingClientRect()
				inputBox.style.height = rectInputBox.height + newY + 'px'
				resultBox.style.height = rectResultBox.height - newY + 'px'
				prevY = e.clientY
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
handleScroll()
handleReset()
handleRowResize()
handleSpin()