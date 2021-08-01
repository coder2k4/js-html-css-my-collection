/**
 * @description
 * Lazy load images with effect and progress loading image.
 * All selected images src will be changed on the transparent 1x1.png
 * Easy setup - const agLazy = new AgLazyLoading()
 * Add data-ag-lazy="ps5.jpg" (with img scr) to image
 * Add data-ag-progress to progress bar element (like span/div/etc...)
 * @example
 * <div class="card__image-container">
 *  <img
 *  alt="Картинка с загрузкой блюра"
 *  data-ag-lazy="ps5.jpg"
 *  style="background-image: url('ps5 small.jpg');"
 *  class="card__img"
 *  >
 *
 *  <span class="card__img-state" data-ag-progress>
 *  </span>
 * </div>
 *
 * background-image     - super small img of original, for blur effect and etc...
 * data-ag-lazy         - selector and src img holder [can be changed in options]
 * data-ag-progress     - progress element elector [can be changed in options]
 *
 *
 * @author Glazyrin Alexey Sergeevich
 * @version 1.0.0 07/2021
 *
 * @constructor
 * @param selector - node selector
 * @param options {{
 *     progressSelector: '[data-ag-progress]',
 *     imagePlugUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
 *     progressCallback: null,
 *     effect: 'blur',
 *     transition: '.3s easy-in-out'
 * }} - settings

 */
class AgLazyLoading {


    constructor(selector = '[data-ag-lazy]',
                options = {
                    progressSelector: '[data-ag-progress]', // наш прогресс загрузки изображения
                    imagePlugUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // 1x1 png заглушка на изображение
                    progressCallback: null,
                    effect: 'blur', // эффект пока только блюр
                    transition: '.3s easy-in-out' // настройка перехода

                }) {


        this.$elements = document.querySelectorAll((!selector && '[data-ag-lazy]'))
        if (!this.$elements.length) return

        // Настраиваем настройки %%_%%
        this.options = {
            progressSelector: (options.progressSelector || '[data-ag-progress]'), // эффект пока только блюр
            imagePlugUrl: (options.imagePlugUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='), // 1x1 png заглушка на изображение
            progressCallback: (options.progressCallback || null), // наш прогресс загрузки изображения
            effect: (options.effect || 'blur'),
            transition: (options.transition || '.3s easy-in-out') // настройка перехода
        }
        this.observer = null // Шпион за объектами
        this.#setup();

    }


    #setup() {


        // Настраиваем обсервер
        this.#observerSetup()

        // Скармливаем на слежение наши элементы
        Array.from(this.$elements).forEach($element => {
            this.observer.observe($element)
        })

    }


    #observerSetup() {

        const observerOptions = {
            root: null, // берем весь вьюпорт устройства
            rootMargin: '0px', // оступа сверху у нас нет
            threshold: 0.25 // на 25% элемент должен показаться во вьюпорте, чтобы началась загрузка
        }


        const observerCallback = (entries, observer) => {

            if (!entries.length) return

            entries.forEach(entry => {

                const $currentElement = entry.target
                const $currentProgress = $currentElement.parentNode.querySelector(this.options.progressSelector) // Получаем текущий прогрессбар


                const imageUrl = $currentElement.dataset.agLazy // получаем ссылку на оригинальную картинку
                $currentElement.setAttribute('src', this.options.imagePlugUrl) // устанавливаем в src картинки наш 1x1 png
                this.effect = $currentElement // Настраиваем еффект для текущего элемента


                if (entry.isIntersecting) {

                    // Загружаем наше изображение, получем прогресс загрузки и подставдяем url загруженной картинки
                    this.xhrImageUrl(imageUrl, this.progressCallback($currentElement, $currentProgress)).then(
                        blobDataUrl => $currentElement.src = blobDataUrl
                    )
                    // set src to image
                    observer.unobserve(entry.target)
                }
            })
        }


        // Настройка Observer
        this.observer = new IntersectionObserver(observerCallback, observerOptions)
    }


    xhrImageUrl(imageUrl, progressCallback) {
        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            xhr.open('GET', imageUrl, true)
            xhr.responseType = 'arraybuffer'
            xhr.withCredentials = true;
            xhr.onprogress = function (event) {
                if (event.lengthComputable) {
                    progressCallback(parseInt(event.loaded / event.total * 100)) // Высчитываем процент загруженного массива байт изображения
                }
            }

            xhr.onloadend = function () {
                progressCallback(100) // 100%
                const options = {}
                const headers = xhr.getAllResponseHeaders()
                const typeMatch = headers.match(/^Content-Type\:\s*(.*?)$/mi)

                if (typeMatch && typeMatch[1]) {
                    options.type = typeMatch[1]
                }

                const blob = new Blob([this.response], options)

                resolve(window.URL.createObjectURL(blob)) // Создаем ссылку из массива байт для изображения
            }

            xhr.send();

        })
    }

    // Устанавливаем еффект для изображений и динамику анимации
    set effect(element) {

        if (this.options.effect === 'blur') {
            element.style.filter = 'blur(5px)' // Добавляем размытие на изображение
        }
        element.style.transition = this.options.transition // Задаем анимацию
    }

    // Конвертируем значения прогресса в значения нужные для эффекта
    #valueConvert(num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }


    progressCallback($currentElement, $currentProgress) {

        return this.options.progressCallback ? this.options.progressCallback : (progress) => {
            if ($currentProgress)
                progress === 100 ? $currentProgress.remove() : $currentProgress.textContent = `${progress}%`
            this.effectProgress($currentElement, progress)
        }
    }


    effectProgress($currentElement, progress) {

        switch (this.options.effect) {
            case "blur": {
                const effectValue = this.#valueConvert(progress, 0, 100, 5, 0)
                $currentElement.style.filter = `blur(${effectValue}px)` // blur(5px)
                break;
            }
            default:
                return
        }

    }

}


const agLazy = new AgLazyLoading('', {})


// export default AgLazyLoading