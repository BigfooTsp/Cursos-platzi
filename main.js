const ipad = window.matchMedia('screen and (max-width: 1023px)')
const menu = document.querySelector('.menu-list-container')
const burguerButton = document.querySelector('.icon-menu')

ipad.addListener(validation)

function hideShow() {
    if (menu.classList.contains("is-active")) {
        menu.classList.remove("is-active")
    } else {
        menu.classList.add("is-active")
    }
}

function validation(event) {
    if (event.matches) {
        burguerButton.addEventListener('click', hideShow)
    } else {
        burguerButton.removeEventListener('click', hideShow)
    }
}

validation(ipad);
