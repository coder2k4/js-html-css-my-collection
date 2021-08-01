/**
 * @description
 * Media spoiler with props *
 * Easy setup - const agSpoilers = new AgSpoilers()
 *
 * ===========================================
 *
 * Constructor settings:
 *
 * spoilerContainerSelector: '[data-ag-spoilers]',     // по какому селектору будем искать все наши спойлеры
 *
 * spoilerTitleSelector: '[data-ag-spoiler-title]',    // селектор заголовков-триггеров в нашем спойлере
 *
 * containerClass: '_spoiler',                         // технический класс при инициализации спойлера, например если нужно изменить стиль и задан медиа для инициализации спойлера
 *
 * titleClass: '_show',                                // технический класс по которому будет происходить проверка открытия / закрытия спойлера
 *
 * animationDuration: 500,                             // продолжительность анимация спойлера
 *
 * ===========================================
 *
 * spoilerContainerSelector settings:
 *
 * data-ag-spoilers="accordion, 1200, max"
 *
 * accordion - if u need,
 *
 * 1200 - resolution
 *
 * max | min - max-width | min-width
 *
 * @example
 * <div data-ag-spoilers="false,1400,max" class="wrapper deepblue">
 *
 * @example
 *  <div data-ag-spoilers="accordion" class="accordion">
 *      <div class="spoiler">
 *          <div class="spoiler__title" data-ag-spoiler-title>
 *              <h4>Врач предупредила о вреде отбеливания зубов</h4>
 *              <span></span>
 *          </div>
 *          <div class="spoiler_data">
 *              Безвредных способов отбеливания зубов не существует, эта процедура повреждает эмаль и повышает риск
 *              развития кариеса, рассказала челюстно-лицевой хирург, кандидат медицинских наук Амина Кибишева.
 *          </div>
 *      </div>
 *  </div>
 *
 *
 * @author Glazyrin Alexey Sergeevich
 * @version 1.0.0 07/2021
 *
 * @constructor
 * @param {{
 *     spoilerContainerSelector: '[data-ag-spoilers]',
 *     spoilerTitleSelector: '[data-ag-spoiler-title]',
 *     containerClass: '_spoiler',
 *     titleClass: '_show',
 *     animationDuration: 500,
 * }} settings - node selector

 */

class AgSpoilers {

    constructor(settings = {

        spoilerContainerSelector: '[data-ag-spoilers]',     // по какому селектору будем искать все наши спойлеры
        spoilerTitleSelector: '[data-ag-spoiler-title]',    // селектор заголовков-триггеров в нашем спойлере
        containerClass: '_spoiler',                         // технический класс при инициализации спойлера, например если нужно изменить стиль и задан медиа для инициализации спойлера
        titleClass: '_show',                                // технический класс по которому будет происходить проверка открытия / закрытия спойлера
        animationDuration: 500,                             // продолжительность анимация спойлера

    }) {


        this.settings = {

            spoilerContainerSelector : (!settings.spoilerContainerSelector && '[data-ag-spoilers]'),
            spoilerTitleSelector : (!settings.spoilerTitleSelector && '[data-ag-spoiler-title]'),
            containerClass : (!settings.containerClass && '_spoiler'),
            titleClass : (!settings.titleClass && '_show'),
            animationDuration : (!Number.parseInt(settings.animationDuration) && 500),
        }

        console.log(this.settings)

        const $nodes = document.querySelectorAll(this.settings.spoilerContainerSelector)
        if (!$nodes && !$nodes.length) return

        this.spoilers = {
            withMedia: [],      // c медиазапросами
            withOutMedia: []    // без медиа запросов
        }

        this.screens = []       // matchMedia экраны, для возможности убирать прослушку
        this.mediaQueryes = []  // массив уникальных строк медиа запросов вида (max-width: 768px | min-width: 768px)


        this.#setup($nodes)
    }


    #setup($nodes) {

        // Перебираем все спойлеры с медиазапросами, парсим селекторы, разрешение
        $nodes.forEach($node => {

            // .replace(/[\[\]]/g, "")) // Убираем скобки из селектора, чтобы добраться до настроек
            const [accordion, breakpoint, mediaType = 'max'] =
                $node.getAttribute(this.settings.spoilerContainerSelector.replace(/[\[\]]/g, ""))
                    .replaceAll(' ', '')// Убираем все пробелы
                    .split(',') // Разбиваем на массив

            // Создаем объект из настроек
            const spoiler = {
                $node,
                $titles: $node.querySelectorAll(this.settings.spoilerTitleSelector), // Получаем все заголовки спойлера
                accordion,
                breakpoint,
                mediaType,
            }

            if (spoiler.breakpoint && spoiler.breakpoint.length)
                this.spoilers.withMedia.push(spoiler)
            else
                this.spoilers.withOutMedia.push(spoiler)
            // Добавляем в массив


        })


        // Подготавливаем все меди запросы
        this.#prepareMediaQueries()

        // Инициализируем спойлеры, без медизапросов
        this.spoilers.withOutMedia.forEach(spoiler => this.initSpoiler(spoiler))

    }


    // Создаем строку вида: (max-width: 768px), фильтруем все разрешения и оставляем уникальные
    #prepareMediaQueries() {

        // media : (max-width: 768px) , breakpoint : 768
        this.mediaQueryes = this.spoilers.withMedia.map(spoiler => ({
            // Если у нашего спойлера заданы настройки брейкпоинта
            media: `(${spoiler.mediaType}-width: ${spoiler.breakpoint}px)`,
            breakpoint: spoiler.breakpoint
        }))

        // Проверка на уникальность
        this.mediaQueryes = [...new Map(this.mediaQueryes.map(item =>
            [item['media'], item])).values()];


        // Вешаем события по брейкпоинту на все совпадающие элементы
        this.mediaQueryes.forEach(mediaQuery => {

            const mediaSpoilers = this.spoilers.withMedia.filter(spoiler => spoiler.breakpoint === mediaQuery.breakpoint) // список элементов с текущим брейкпоинтом

            if (matchMedia) {
                screen = window.matchMedia(mediaQuery.media) // (max-width: 768px)
                const event = this.screenHandler(mediaSpoilers)
                screen.addListener(event)
                event(screen)
                this.screens.push({mMedia: screen, event}) // для снятия события при дестрое
            }

        })
    }


    // Обработчик на изменение размера экрана
    screenHandler(mediaSpoilers) {
        return (screen) => {
            if (!mediaSpoilers && !mediaSpoilers.length) return

            if (screen.matches) {
                mediaSpoilers.forEach(spoiler => this.initSpoiler(spoiler))
            } else {
                // Удаляем наши спойлеры O_O
                mediaSpoilers.forEach(spoiler => this.destroy(spoiler))
            }
        }
    }


    // Инициализируем наш спойлер, раздаем необходимые классы и вешаем прослушку
    initSpoiler(spoiler) {
        // Добавляем технический стиль к контейнеру спойлера
        spoiler.$node.classList.add(this.settings.containerClass)

        // Todo разработать логику инициализации открытых и закрытых спойлеров при старте

        spoiler.$titles.forEach($title => {

            if (this.checkClass($title, this.settings.titleClass))
                this.activate($title)
            else
                this.deactivate($title, true)

        })

        spoiler.eventClick = this.spoilerClickHandler(spoiler)
        spoiler.$node.addEventListener('click', spoiler.eventClick)

    }


    spoilerClickHandler(spoiler) {

        let time = Date.now();

        return (event) => {

            // Предотвращаем тротлин или быстрые прокликивание и не правильную анимацию
            if ((time + this.settings.animationDuration - Date.now()) >= 0) return;
            time = Date.now();

            // Если у спойлера нет заголовков - выходим
            if (!spoiler.$titles && !spoiler.$titles.length) return


            Array.from(spoiler.$titles).forEach($title => {

                    // Проверяем, если мы кликнули по заголовку или родителем элемента является заголовок с селектором spoilerTitleSelector

                    if (
                        spoiler.accordion === 'accordion'
                        && event.target !== $title   // Если элемент не является текущим заголовком спойлера
                        && event.target.closest(this.settings.spoilerTitleSelector) !== $title // Если родительский элемент не является текущим заголовком спойлера
                        && (event.target.matches(this.settings.spoilerTitleSelector) || event.target.closest(this.settings.spoilerTitleSelector)) // Закрытие только по заголовку
                    ) {
                        this.deactivate($title)
                    }

                    // Если мы кликнули по заголовку
                    if (event.target === $title || event.target.closest(this.settings.spoilerTitleSelector) === $title) {
                        this.toggle($title)
                    }

                }
            )

        }
    }


    checkClass(element, className) {
        return element.classList.contains(className)
    }

    toggle($title) {
        if (this.checkClass($title, this.settings.titleClass))
            this.deactivate($title)
        else
            this.activate($title)
    }


    activate($title) {
        const $spoilerContent = $title.nextElementSibling // Content
        $title.classList.add(this.settings.titleClass)
        this._slideDown($spoilerContent).then(() => {

        })
    }


    deactivate($title, init = false) {
        // Нам не нужно проводить анимацию если итак нету класса
        if (!this.checkClass($title, this.settings.titleClass) && !init) return

        const $spoilerContent = $title.nextElementSibling // Content
        $title.classList.remove(this.settings.titleClass)
        this._slideUp($spoilerContent).then(() => {

        })
    }


    destroy(spoiler) {
        // Удаляем технический стиль к контейнеру спойлера
        spoiler.$node.classList.remove(this.settings.containerClass)
        spoiler.$node.removeEventListener('click', spoiler.eventClick)
    }


// Классы для анимации
    _slideUp = (target, duration = 500) =>
        new Promise(resolve => {
                target.classList.add('_slide');
                target.style.transitionProperty = 'height, margin, padding';
                target.style.transitionDuration = duration + 'ms';
                target.style.height = target.offsetHeight + 'px';
                target.offsetHeight;
                target.style.overflow = 'hidden';
                target.style.height = 0;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                window.setTimeout(() => {
                    target.hidden = true;
                    target.style.removeProperty('height');
                    target.style.removeProperty('padding-top');
                    target.style.removeProperty('padding-bottom');
                    target.style.removeProperty('margin-top');
                    target.style.removeProperty('margin-bottom');
                    target.style.removeProperty('overflow');
                    target.style.removeProperty('transition-duration');
                    target.style.removeProperty('transition-property');
                    target.classList.remove('_slide');

                    resolve(); // промис выполнен
                }, duration);
            }
        )


    _slideDown = (target, duration = 500) =>
        new Promise((resolve) => {
            target.classList.add('_slide');
            if (target.hidden) {
                target.hidden = false;
            }
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');

                resolve(); // промис выполнен
            }, duration);

        })


}


export default AgSpoilers