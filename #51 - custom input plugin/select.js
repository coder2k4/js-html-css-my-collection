/**
 * Контейнеру добавить атрибут data-ga-select, чтобы применились необходимыес стили
 * Передать в конструктор:
 *  1 - selector, по нему будет производиться поиск контейнера (например selector: '.select')
 *  2 - options, набор параметров:
 *      {
 *          placeholder - текст заглушки
 *          icon - иконка
 *          items : [   - массивы элементов, для выпадабщего списка
 *              {id: 1, text: 'Текст для выбора'}
 *          ]
 *      }
 */
class Select {
    constructor(selector, options) {
        this.$el = document.querySelector(selector)

        if(!this.$el) return

        this.options = options
        this.selectedId = null

        this.#render() // Рендерим наш шаблон
        this.setup() // Добавляем прослушку
    }


    // Отображаем шаблон (приватный метод)
    #render() {
        const {placeholder, icon, items} = this.options
        this.$el.innerHTML = this.getTemplate(placeholder,icon, items)
    }

    // События
    setup() {
        this.clickHandler = this.clickHandler.bind(this) // привязываем контекст и позволяем пользоваться this в openHandler
        this.$el.addEventListener('click', this.clickHandler)
        this.$select = this.$el.querySelector('[data-type="value"]') // Дом селекта
    }

    // Проверка на открытие
    get isOpen() {
        return this.$el.classList.contains('open')
    }

    // Управляет открытием и закрытием
    toggle() {
        this.isOpen ? this.close() : this.open()
    }

    // Обработчик нажатия
    clickHandler(e) {
        const {type} = e.target.dataset

        if(type === 'item') {
            const id = e.target.dataset.id;
            this.select(id)
        }
        else if(type === 'backdrop') {
            console.log(type)
            this.close()
        }
        else {
            this.toggle()
        }
    }

    get getCurrent() {
        return this.options.items.find(item => item.id == this.selectedId)
    }

    select(id) {
        this.selectedId = id
        this.$select.innerText = this.getCurrent.text


        // Удаляем стили со всех селектов выбранные элементы
        const $items = this.$el.querySelectorAll('[data-type="item"]')
        Array.from($items).forEach(item => item.classList.remove('selected'))

        this.$el.querySelector(`[data-id="${this.selectedId}"]`).classList.add('selected') // получаем выбранный элемент

        this.options.onSelect && this.options.onSelect(this.getCurrent)

        this.close() // Закрываем окно после выбора
    }


    open() {
        this.$el.classList.add('open')
    }    // Открываем окно
    close() {
        this.$el.classList.remove('open')
    }   // Закрываем окно
    destroy() {
        this.$el.removeEventListener('click', this.clickHandler)
        this.$el.innerHTML = ''
    } // Убираем наш инпут


    //Шаблон input
    getTemplate = (placeholder,icon, data = []) => {

        placeholder = placeholder ?? 'Выберите'
        icon = icon ?? '<img src="https://img.icons8.com/ios/452/down-squared--v2.png">'

        const items = data.map(({id, text}) => {
            return `<li data-type="item" data-id="${id}">${text}</li>`
        }).join('')

        return `
            <div class="ga-select__backdrop" data-type="backdrop"></div>

            <div class="ga-select__input" data-type="input">
                    <span data-type="value">${placeholder}</span>
                    <span>${icon}</span>
            </div>
        
            <div class="ga-select__dropdown">
                <ul class="ga-select__list">
                    ${items}
                </ul>
            </div>
    `
    }

}

export default Select