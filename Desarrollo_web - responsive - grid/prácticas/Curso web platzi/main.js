const menu = document.querySelector('.menu-list-container')
const burguerButton = document.querySelector('.icon-menu')

burguerButton.addEventListener('click', hideShow)

function hideShow() {
    if (menu.classList.contains("is-active")) {
        menu.classList.remove("is-active")
    } else {
        menu.classList.add("is-active")
    }
}