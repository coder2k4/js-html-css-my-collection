const $labels = document.querySelectorAll('label')

if($labels && $labels.length) {
    Array.from($labels).forEach($label => {

        $label.innerHTML = $label.innerText
            .split('')
            .map((letter, indx) => `<span style="transition-delay: ${0.1*indx}s">${letter}</span>`)
            .join('')


    })
}
