const $btn = document.querySelector('.btn')

$btn.addEventListener('click', (event) => {
    $btn.parentNode.classList.toggle('active')
    $btn.previousElementSibling.focus()
})
