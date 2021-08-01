class agLightBox {

    constructor(selector = '[data-ag-lightbox]') {

        this.$elements = document.querySelectorAll(selector)
        if (!this.$elements && !this.$elements.length) return

        this.objects = [] // Массив объектов с их событиями
        this.#setup()
    }

    #setup() {

        Array.from(this.$elements).forEach($element => {

            const object = {
                $node: $element
            }

            const linkClickHandler = this.linkClickHandler(object)
            object.linkClickHandler = linkClickHandler // добавляем ссылку на хендрел в объект
            object.$node.addEventListener('click', linkClickHandler)

            this.objects.push(object)

        })

    }


    linkClickHandler(object) {
        return (event) => {
            event.preventDefault() // Отменяем переход по ссылке
            this.#render(object)
        }
    }


    #render(object) {

        // Создаем обертку popup
        const $container = document.createElement("div");
        $container.style.position = 'fixed'
        $container.style.left = '0'
        $container.style.bottom = '0'
        $container.style.right = '0'
        $container.style.top = '0'
        $container.style.zIndex = '9999'
        $container.style.transition = 'all 0.3s ease-in-out'
        $container.style.cursor = 'pointer'
        $container.classList.add('ag-popup-container');


        const src = object.$node.getAttribute('href') // получаем ссылку на изображение

        // Создаем изображени
        const $image = document.createElement("img");
        $image.setAttribute('src', src)

        // Когда прогрузили узнаем оригинальные размеры и задаем свои O_O
        const loadHandler = (e) => {
            object.originalWidth = e.target.width
            object.originalHeight = e.target.height

            $image.style.width = object.$node.offsetWidth + "px"
            $image.style.height = object.$node.offsetHeight + "px"

            $image.style.position = 'relative'
            $image.style.display = 'block'
            $image.style.transition = 'all 0.3s ease-in-out'
            // $image.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
            // $image.style.width = object.$node.offsetWidth + "px"
            // $image.style.height = object.$node.offsetHeight + "px"
            $image.style.left = object.$node.getBoundingClientRect().left + "px"
            $image.style.top = object.$node.getBoundingClientRect().top + "px"
            $image.classList.add('ag-popup-image');


            object.$container = $container // Добавляем к объктру привязку к контейнеру
            object.$image = $image // Добавляем к объктру привязку к изображению


            // Добавляем к контейнеру изображение
            $container.insertAdjacentElement('afterbegin', $image)
            //Добавляем наш контейнер к боди, вконец
            document.body.insertAdjacentElement('beforeend', $container);


            object.closeEventHandler = this.close(object)
            $container.addEventListener('click', object.closeEventHandler)

            this.popup(object)
        }

        $image.addEventListener('load', loadHandler)
        object.loadHandler = loadHandler;
    }


    destroyAll() {

        if (!this.objects || !this.objects.length) return

        this.objects.forEach(object => {
            //object.$node.removeEventListener('click', object.linkClickHandler)
            //object.$container.removeEventListener('click', object.closeEventHandler)
            //object.$image.removeEventListener('load', object.loadHandler)
        })


    }

    close(object) {
        return (event) => {
            object.$container.removeEventListener('click', object.closeEventHandler)

            object.$container.style.background = 'rgba(0, 0, 0, 0.0)'
            object.$container.style.backdropFilter = 'blur(0px)'

            object.$image.removeEventListener('load', object.loadHandler)

            object.$image.style.width = object.$node.offsetWidth + "px";
            object.$image.style.height = object.$node.offsetHeight + "px";
            object.$image.style.left = object.$node.getBoundingClientRect().left + "px";
            object.$image.style.top = object.$node.getBoundingClientRect().top + "px";
            object.$image.style.transform = "translate(0)"
            setTimeout(function () {
                object.$container.remove();
            }, 300);
        }
    }


    popup(object) {

        setTimeout(function () {

            object.$container.style.background = 'rgba(0, 0, 0, 0.4)'
            object.$container.style.backdropFilter = 'blur(10px)'
            object.$image.style.left = "50%";
            object.$image.style.top = "50%";
            object.$image.style.transform = "translate(-50%, -50%)"
            // object.$image.style.width = "auto";
            object.$image.style.maxWidth = "100%";
            // object.$image.style.height = "auto";
            object.$image.style.maxHeight = "100%";
            object.$image.style.objectFit = 'contain'
            object.$image.style.width = object.originalWidth + "px";
            object.$image.style.height = object.originalHeight + "px";
            // object.$image.style.width = window.innerWidth * 0.7 + "px";
            // object.$image.style.height = ((object.$image.height / object.$image.width) * (window.innerWidth * 0.7)) + "px";
        }, 10);

    }
}

export default agLightBox