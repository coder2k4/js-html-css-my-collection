document.addEventListener('DOMContentLoaded', function (e) {


    // Получаем все табы
    const $pannels = document.querySelectorAll('.panel')

    Array.from($pannels).forEach($pannel => {

        $pannel.addEventListener('click', (e) => {
            removeClass($pannels, 'active')
            $pannel.classList.add('active')
        })


        /**
         * функция убирает со элемента или массива элементов класс
         * @param elements : HTMLElement
         * @param className : string
         */
        function removeClass(elements, className) {

            if(Array.isArray(Array.from(elements))) {
                elements.forEach(element => {
                    element.classList.remove(className)
                })
            }
            else {
                elements.classList.remove(className)
            }

        }

    })

})
