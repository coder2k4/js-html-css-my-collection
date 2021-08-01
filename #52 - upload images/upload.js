// Перевод байтов в КB...
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}


class AGUploadImages {

    constructor(selector, options = {}) {

        // Получаем инпут, который будет отвечать за загрузку файлов
        this.input = document.querySelector(selector)
        if (!this.input) return // если инпута нет, выходим
        this.options = options
        this.#setup()
    }




    // Настраиваем наш инпут
    #setup() {
        // Если установлен параметр на передачу множественных файлов
        if (this.options.multi) {
            this.input.setAttribute('multiple', true)
        }

        // Обрабатываем список поддерживаемых форматов, если такие есть
        if (this.options.accept && Array.isArray(this.options.accept)) {
            this.input.setAttribute('accept', this.options.accept.join(','))
        }

        // Рендерим необходимые элементы
        this.preview = this.#renderElement('div', ['preview'])
        this.open = this.#renderElement('button', ['btn'], 'Открыть')
        this.upload = this.#renderElement('button', ['btn', 'primary'], 'Загрузить')

        // Добавляем наши ноды в дом
        this.input.insertAdjacentElement('afterend', this.preview)
        this.input.insertAdjacentElement('afterend', this.upload)
        this.input.insertAdjacentElement('afterend', this.open)

        this.upload.style.display = 'none'

        // Привязываем контекст класса
        this.inputClickHandler = this.inputClickHandler.bind(this)
        this.open.addEventListener('click', this.inputClickHandler)

        this.inputChangeHandler = this.inputChangeHandler.bind(this)
        this.input.addEventListener('change', this.inputChangeHandler)

        this.previewRemoveHandler = this.previewRemoveHandler.bind(this)
        this.preview.addEventListener('click', this.previewRemoveHandler)

        if(this.options.onUpload && typeof this.options.onUpload === 'function')
        {
            this.uploadHandler = this.uploadHandler.bind(this)
            this.upload.addEventListener('click', this.uploadHandler)
        }

    }





    #renderElement(element, classes = [], content) {
        const el = document.createElement(element)

        if (Array.isArray(classes) && classes.length)
            classes.forEach(cl => el.classList.add(cl))

        if (content)
            el.textContent = content

        return el
    }

    #renderUploadProgress(element) {
        element.style.bottom = '4px'
        element.innerHTML = '<div class="preview-info-progress"></div>'
    }




    inputClickHandler(event) {
        this.input.click();
    }


    // Обрабатываем переданные файлы
    inputChangeHandler(event) {
        if (!event.target.files.length) {
            this.upload.style.display = 'none'
            return
        }


        this.files = Array.from(event.target.files)
        this.preview.innerHTML = ''
        this.upload.style.display = 'inline'


        this.files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()

            reader.onload = ev => {
                const src = ev.target.result
                this.preview.insertAdjacentHTML('afterbegin', `
                  <div class="preview-image">
                    <div class="preview-remove" data-name="${file.name}">&times;</div>
                    <img src="${src}" alt="${file.name}" />
                    <div class="preview-info">
                      <span>${file.name}</span>
                      ${bytesToSize(file.size)}
                    </div>
                  </div>
                `)
            }

            reader.readAsDataURL(file)
        })
    }


    // Клик по кнопку удалить файл
    previewRemoveHandler(event) {

        if(!event.target.dataset.name)
            return

        const {name} = event.target.dataset
        this.files = this.files.filter(file => file.name !== name)

        if (!this.files.length) {
            this.upload.style.display = 'none'
        }

        const block = this.preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image')

        block.classList.add('removing')
        setTimeout(() => block.remove(), 300)

    }


    uploadHandler(event) {
        // Удаляем кнопки удаления превью
        this.preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
        const previewInfo = this.preview.querySelectorAll('.preview-info')
        previewInfo.forEach(this.#renderUploadProgress)
        this.options.onUpload(this.files, previewInfo)
    }

    destroy() {
        this.open.removeEventListener('click', this.inputClickHandler)
        this.input.removeEventListener('change', this.inputChangeHandler)
        this.preview.removeEventListener('click', this.previewRemoveHandler)
        this.upload.removeEventListener('click', this.uploadHandler)
        this.input.closest('.card').remove()
    }


}

export default AGUploadImages