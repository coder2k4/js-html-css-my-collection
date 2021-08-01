const $progressbar = document.getElementById('progressbar')
const totalHeight = document.body.scrollHeight - window.innerHeight;

// Не забыть про тротлинг (20мс работает идально)

window.onscroll = function () {
    let progressHeight = (window.pageYOffset / totalHeight) * 100
    $progressbar.style.width = progressHeight + '%'
}