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
function handleSpin() {
	let spinNumber = 0;
	spinButton.onclick = function () {
		if (!textArea.value) {
			alert('Nhập nội dung trước khi khi spin')
			return
		}
		const _text = $('#root textarea')
		const text = Replace(_text.value)
		backDrop.innerHTML = text.origin

		let titleChild = document.createElement('div')
		titleChild.setAttribute('class', 'title')
		titleChild.innerHTML = 'Spin' + (spinNumber + 1)
		spinNumber++

		let contentChild = document.createElement('div')
		contentChild.setAttribute('class', 'content')
		contentChild.innerHTML = text.replace

		let newChild = document.createElement('div')
		newChild.setAttribute('class', 'child')
		newChild.style.backgroundColor = randomColor()
		newChild.append(titleChild, contentChild)

		resultBox.prepend(newChild)

		let btnResult = document.createElement('button')
		btnResult.setAttribute('class', 'toggleBtn')
		btnResult.textContent = 'toggle'
		$('.result .child').append(btnResult)
		$$('.result .child .toggleBtn').forEach((element, i) => {
			element.onclick = function () {
				$$('.result .child')[i].classList.toggle('set-height')
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

handleScroll()
handleReset()
handleRowResize()
handleSpin()