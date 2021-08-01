// Не тротлим!
function throttleStop(callback, wait) {
    let time = Date.now();
    return function (e) {
        if ((time + wait - Date.now()) < 0) {
            callback(e);
            time = Date.now();
        }
    }
}


{
    const $crollToTopButton = document.getElementById('scroll-to-top')
    function scrollToTopHandler() {
        if (!$crollToTopButton) return
        $crollToTopButton.classList.toggle("active", window.scrollY > 500)
        $crollToTopButton.addEventListener('click', scrollToTop)
    }
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }


    window.addEventListener('scroll', throttleStop(scrollToTopHandler, 50))
}