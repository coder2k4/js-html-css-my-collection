/**
 * @description
 * Автоматический плагин для создания popup окон, с возможность фиксировать (отключать скролл) и предотвращать дергание экрана
 * Возможно вызывать попап из попапа, при этом можно управлять, что будет происходить с родителем
 * Полностью настраиваемые переходы, через настройки или технические классы
 *
 * Создайте контент блок со своими стилями и настройками
 * Создайте указатель кнопку на него, добавив selector='selectorContent', по молчанию data-ag-popup.
 * Все, попап автоматически пропишет всё необходимое, все стили, оверлей и события.
 *
 * @example (1)
 * <a href="#" class="header__phone popup-link" data-ag-popup="#box1">Попап №1</a>
 *
 * <div class="box green" id="box1">
 *  <h2>Привет, я контент #1</h2>
 *  <p data-ag-popup-close>Кликни по мне или по изображению, чтобы закрыть</p>
 *  <img src="https://via.placeholder.com/250x200" alt="" data-ag-popup-close>
 * </div>
 *
 *
 *
 * @author Glazyrin Alexey Sergeevich
 * @version 1.0.0 08/2021
 *
 * @constructor
 * @param {boolean} settings.closePopupsParents Закрывать радительский попап, если активирован попап из другого попапа
 * @param {boolean} settings.lockScrollBar Блокировать ли scrollbar
 * @param {boolean} settings.stopShutteEffect Нужно ли отменять shutter effect для элементов в асолютом и фикседом
 * @param {object} settings Настройки для конструктора.
 * @param {string} settings.selector Селектор активаторов, должен сожержать селектор на контент
 * @param {string} settings.overlayTransition Транзишн для оверлея
 * @param {string} settings.contentTransition Транзишн для контента
 * @param {string} settings.contentTranformStart Начальная анимация контента
 * @param {string} settings.contentTranformEnd Конечная анимация контента
 * @param {string} settings.zIndex Z-index
 * @param {string} settings.overlayBackgroundColor Фон оверлея
 * @param {string} settings.contentBackgroundColor Фон контентного блока, если не установлен в стилях, будет прозрачным по умолчанию
 * @param {string} settings.overlayClass Технический класс при открытии попапа на оверлее
 * @param {string} settings.contentClass Технический класс при открытии попапа на контенте
 * @param {string} settings.contentCloseButtonSelector Селектор кнопки закрыть в контенте
 */
class AgPopup {

    constructor(settings = {

        closePopupsParents: true,  // Закрывать радительский попап, если активирован попап из другого попапа
        lockScrollBar: true,       // Блокировать ли scrollbar
        stopShutteEffect: true,    // Нужно ли отменять shutter effect для элементов в асолютом и фикседом
        selector: '[data-ag-popup]',   // Селектор активаторов, должен сожержать селектор на контент
        overlayTransition: '.8s ease', // Транзишн для оверлея
        contentTransition: '.8s ease .2s', // Транзишн для контента
        contentTranformStart: 'perspective(600px) translateY(-100%) rotateX(45deg)',
        contentTranformEnd: 'perspective(600px) translateY(0%) rotateX(0deg)',
        zIndex: '1000',            // Z-index
        overlayBackgroundColor: 'rgba(0, 0, 0, 0.6)', //  Фон оверлея
        contentBackgroundColor: 'white', // Фон контентного блока, если не установлен в стилях, будет прозрачным по умолчанию
        overlayClass: '_open', // Технический класс при открытии попапа на оверлее
        contentClass: '_open', // Технический класс при открытии попапа на контенте
        contentCloseButtonSelector: '[data-ag-popup-close]', // Селектор кнопки закрыть в контенте

    }) {
        // Настройки
        this.selector = (settings.selector || '[data-ag-popup]')   // Селектор активаторов, должен сожержать селектор на контент
        this.overlayTransition = (settings.overlayTransition || '.8s ease') // Транзишн для оверлея
        this.contentTransition = (settings.contentTransition || '.8s ease .2s') // Транзишн для контента
        this.contentTranformStart = (settings.contentTranformStart || 'perspective(600px) translateY(-100%) rotateX(45deg)')
        this.contentTranformEnd = (settings.contentTranformEnd || 'perspective(600px) translateY(0%) rotateX(0deg)')
        this.zIndex = (settings.zIndex || '1000')            // Z-index
        this.overlayBackgroundColor = (settings.overlayBackgroundColor || 'rgba(0, 0, 0, 0.6)') //  Фон оверлея
        this.contentBackgroundColor = (settings.contentBackgroundColor || 'white') // Фон контентного блока, если не установлен в стилях, будет прозрачным по умолчанию
        this.overlayClass = (settings.overlayClass || '_open') // Технический класс при открытии попапа на оверлее
        this.contentClass = (settings.contentClass || '_open') // Технический класс при открытии попапа на контенте
        this.contentCloseButtonSelector = (settings.contentCloseButtonSelector || '[data-ag-popup-close]') // Селектор кнопки закрыть в контенте
        this.closePopupsParents = settings.closePopupsParents  // Закрывать радительский попап, если активирован попап из другого попапа
        this.lockScrollBar = settings.lockScrollBar      // Блокировать ли scrollbar
        this.stopShutteEffect = settings.stopShutteEffect    // Нужно ли отменять shutter effect для элементов в асолютом и фикседом


        this.scrollBarIsOpen = true  // Технические данные об статусе скроллбара
        this.$popupActivators = document.querySelectorAll(this.selector)
        this.popups = [] // Хранилище окон
        this.uniquePopups = [] // Уникальные попапы
        this.$fixedPositionNodes = [] // Тут содержатся все ноды с позицией fixed или absolute, отменяем для них shutter effect
        this.shiftIndent = 0 // Техническое значение смещение на ширину скролла


        // Если нет элементов, то ничего не делаем
        if (!this.$popupActivators || !this.$popupActivators.length) return

        this.#setup()
    }

    #setup() {

        // .replace(/[\[\]]/g, "")) // Убираем скобки из селектора
        this.selector = this.selector.replace(/[\[\]]/g, "");


        // Создаем попап объекты
        Array.from(this.$popupActivators).forEach(($popupActivator, index) => {

            const popupContentSelector = $popupActivator.getAttribute(this.selector) // получаем селектор окна из даты

            if (!popupContentSelector) return // Если ничего не передано, выходим

            const $popupContent = document.querySelector(popupContentSelector)

            if (!$popupContent) return // Если ничего не передано, выходим

            const $contentCloseBtn = $popupContent.querySelectorAll(this.contentCloseButtonSelector)


            const popupObject = {
                index: index,
                $activator: $popupActivator,
                selector: popupContentSelector,
                $content: $popupContent,
                $closeBtn: $contentCloseBtn,
                isActive: false,
                animationStart: false,
            }

            this.popups.push(popupObject)
        })


        // Если мы хотим скрыть скроллбар и отключить шаттер эффект для остальныз блоков, парсим все элементы
        if (this.lockScrollBar && this.stopShutteEffect)
            this.parseFixedElements()


        // Рендерим найденные окна, добавляем необходимые стили
        this.#render()
    }

    #render() {

        // Найдены ли у нас попапы
        if (!this.popups || !this.popups.length) return


        /**
         * Так как ссылок на один контент может быть несколько, нам нужно отфильтровать их на уникальность
         * Фильтруем по контенту         *
         */
        this.uniquePopups = [
            ...new Map(this.popups.map(item =>
                [item['$content'], item])).values()
        ]


        /**
         * Далее мы создаем оверлей
         * и прокидываем необходимые стили
         */
        this.uniquePopups.forEach(popup => {

            // Создаем обертку контейнер (оверлей)
            const $overlay = document.createElement('div')
            $overlay.style.position = 'fixed'
            $overlay.style.top = '0'
            $overlay.style.left = '0'
            $overlay.style.width = '100%'
            $overlay.style.height = '100%'
            $overlay.style.backgroundColor = this.overlayBackgroundColor

            // Курсор указателя
            // $overlay.style.cursor = 'not-allowed'

            // Вижим всегда наше окошечко
            $overlay.style.zIndex = this.zIndex

            // Внутренний контент располагаем по центру
            $overlay.style.display = 'flex'
            $overlay.style.alignItems = 'center'
            $overlay.style.justifyContent = 'center'

            // Внутренний оступ безопасности при малых разрешениях
            $overlay.style.padding = '30px'

            // Защита при анимации
            $overlay.style.overflowX = 'hidden'
            $overlay.style.overflowY = 'auto'

            // Изначально окно невидимо и скрыто
            $overlay.style.opacity = '0'
            $overlay.style.visibility = 'hidden'

            // Скорость и стиль анимации
            $overlay.style.transition = this.overlayTransition

            // Получаем цвет из стилей фона
            const $contentBgColor = window.getComputedStyle(popup.$content, null).getPropertyValue('background-color')

            // Стили для конентной области
            // Если фон прозрачный (не задан/сток), то присваиваем цвет из параметров
            if ($contentBgColor === 'rgba(0, 0, 0, 0)') {
                popup.$content.style.backgroundColor = this.contentBackgroundColor
            }

            popup.$content.style.transform = this.contentTranformStart
            popup.$content.style.transition = this.contentTransition


            // Добавляем нашему объекту поле-ссылку на ноду оверлея
            popup.$overlay = $overlay


            // Добавляем в оверлей контент найденный по селектору
            $overlay.insertAdjacentElement('afterbegin', popup.$content);

            // Добавляем созданный оверлей с контентом в конец body
            document.body.insertAdjacentElement('beforeend', $overlay)
        })


        /**
         * Интересный момент, прокинуть созданный оверлей дублям
         * Поэтому каждому дублю прокидываем оверлей из никальный попапов
         */
        this.popups = this.popups.map(popup => {

            const uPopUp = this.uniquePopups.find(uniqPopup => uniqPopup.$content === popup.$content)

            if (uPopUp) {
                popup.$overlay = uPopUp.$overlay
            }

            return popup
        })

        // Настраиваем события
        this.#setupEvents()
    }

    #setupEvents() {

        // пробрасываем по всем попапам евент по активатору
        this.popups.forEach(popup => {

            popup.$activator.addEventListener('click', this.activatorClickHandler(popup))
            popup.$overlay.addEventListener('click', this.overlayClickHandler(popup))
            // popup.$overlay.addEventListener('keydown', this.keyboardEventHandler)
            //todo добавить закрытие по клавише ESC!
        })

        // Закрываем все попапы если пользователь нажал ESC
        document.body.addEventListener('keydown', this.keyboardEventHandler)

        // this.uniquePopups.forEach(popup => {
        //     popup.$overlay.addEventListener('click', this.overlayClickHandler(popup))
        // })
    }

    // Нажатие на активатор
    activatorClickHandler = (popup) => {
        return (event) => {


            event.preventDefault() // Отменяем переходы, если это ссылка
            event.stopPropagation()

            if (this.closePopupsParents)
                this.closeAll()

            this.open(popup)
        }
    }

    // При нажатии на оверлей или кнопку закрытия - закрываем
    overlayClickHandler = (popup) => {
        return (event) => {

            console.log(event)
            if (event.key === "Escape") {
                console.log("Escape")
            }

            if (event.target === popup.$overlay || Array.from(popup.$closeBtn).find($btn => $btn === event.target) || event.which === 27) {
                event.preventDefault() // Отменяем переходы, если это ссылка
                this.close(popup)
            }

        }
    }

    keyboardEventHandler = (event) => {
        if (event.key === "Escape") {
            this.closeAll()
        }
    }

    // Закрываем все popup
    closeAll() {
        this.popups.forEach(popup => this.close(popup))
    }

    // Стили для открытия окна
    open(popup) {


        //Скипаем если уже активен
        if (popup.isActive) return

        //Если идет какая-то анимация
        if (popup.animationStart) return

        //Работ со скроллбаром
        this.scrollBarClose()

        // Если мы не хотим закрывать родителя, то нам нужно найти все открытые и найти максимальный z-index
        if (!this.closePopupsParents) {

            let zIndexMax = this.zIndex

            this.popups.forEach(popup => {

                if (!popup.isActive) return

                const zIndex = Number.parseInt(popup.$overlay.style.zIndex)
                zIndexMax = Math.max(zIndex, zIndexMax)
                zIndexMax++
            })

            popup.$overlay.style.zIndex = zIndexMax;
        }

        // При нажатии на активатор
        popup.$overlay.style.opacity = '1'
        popup.$overlay.style.visibility = 'visible'

        // Эффект появления контента
        popup.$content.style.transform = this.contentTranformEnd

        // Добавляем технические классы
        popup.$overlay.classList.add(this.overlayClass)
        popup.$content.classList.add(this.contentClass)

        // Попап активен
        popup.isActive = true

        // Анимация началась
        popup.animationStart = true

        // Хитро вы***ный код
        // Создаем стрелочную функцию, у которой сохраняется контекст класса и функции в которой была вызвана
        // Цепляем на нее евент, передаем event.propertyName и сверяем его со свойством opacity, если ОНО, тогда убираем скролл
        // Далее ремовим евент с popup.$overlay, доступен из скоупа с привязкой текущей функции.
        const transitionendHandler = (event) => {
            this.transitionComplete(event.propertyName, popup);
            popup.$overlay.removeEventListener('transitionend', transitionendHandler);
        };

        // Событие на завершения транзишена.
        popup.$overlay.addEventListener('transitionend', transitionendHandler, false);


    }


    // Стили для закрытия окна
    close(popup) {


        //Скипаем если не активен
        if (!popup.isActive) return

        //Если идет какая-то анимация
        if (popup.animationStart) return

        //Скрываем окошко
        popup.$overlay.style.opacity = '0'
        popup.$overlay.style.visibility = 'hidden'

        // Если вдруг мы его изменяли - возвращаем базовый
        popup.$overlay.style.zIndex = this.zIndex

        // Эффект появления контента
        popup.$content.style.transform = this.contentTranformStart

        //Удаляем технические классы
        popup.$overlay.classList.remove(this.overlayClass)
        popup.$content.classList.remove(this.contentClass)

        // Попап не активен
        popup.isActive = false

        // Анимация началась
        popup.animationStart = true

        // Хитро вы***ный код
        // Создаем стрелочную функцию, у которой сохраняется контекст класса и функции в которой была вызвана
        // Цепляем на нее евент, передаем event.propertyName и сверяем его со свойством opacity, если ОНО, тогда убираем скролл
        // Далее ремовим евент с popup.$overlay, доступен из скоупа с привязкой текущей функции.
        const transitionendHandler = (event) => {
            this.transitionComplete(event.propertyName, popup);
            popup.$overlay.removeEventListener('transitionend', transitionendHandler);
        };

        // Событие на завершения транзишена.
        popup.$overlay.addEventListener('transitionend', transitionendHandler, false);


    }

    transitionComplete(propertyName, popup) {
        // if (propertyName === 'opacity') {
        // Анимация закончилась
        popup.animationStart = false

        if (!this.popups.find(popup => popup.isActive)) {
            //Работ со скроллбаром
            this.scrollBarOpen()
        }
        // }
    }

    scrollBarOpen() {
        // Если мы не хотим скрывать скроллбар, то выходим
        // И скролбар еще не скрыт
        if (!this.lockScrollBar && this.scrollBarIsOpen)
            return

        this.scrollBarIsOpen = true

        // Сдвигаем все!
        this.shiftAll()

        document.body.style.overflowY = 'auto'
    }

    scrollBarClose() {

        if (!this.lockScrollBar && !this.scrollBarIsOpen)
            return

        this.scrollBarIsOpen = false

        // Сдвигаем все!
        this.shiftAll()

        document.body.style.overflowY = 'hidden'
    }

    shiftAll() {
        this.shiftIndent = this.calcScrollbarWidth


        // Добавляем оступ на ширину равную ширине скролла
        this.shiftElement(document.body)

        //Добавляем отступы ко всем элементам с позицией fixed
        Array.from(this.$fixedPositionNodes).forEach($fixed => {
            this.shiftElement($fixed, 'paddingRight')
        })
    }

    // Делаем оступ в стилях на ширину скролла
    shiftElement($node, option = 'marginRight') {

        if (this.scrollBarIsOpen)
            $node.style[option] = '0'
        else {
            $node.style[option] = `${this.shiftIndent}px`
        }
    }


    // Получаем ширину скролла
    get calcScrollbarWidth() {
        return window.innerWidth - document.body.offsetWidth
    }


    // Получаем все элементы с ползицией fixed
    parseFixedElements() {

        let classes = '';
        Array.from(document.styleSheets).forEach(styleSheet => {
            Array.from(styleSheet.cssRules || styleSheet.rules).forEach(rule => {

                if (!rule.style) return;

                if (rule.style.position === 'fixed')
                    classes += rule.selectorText + ','
            })
        })

        classes = classes.slice(0, -1); // Удаляем запятую вконце

        const $fixedElements = document.querySelectorAll(classes)

        if ($fixedElements && $fixedElements.length)
            this.$fixedPositionNodes = $fixedElements

    }


}

export default AgPopup
