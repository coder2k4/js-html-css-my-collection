/**
 * @description
 * Живая фильтрация данных, может работать по классу или по внутренним стилям.
 * Внутренние стили работают по переходу от max-width (не width)
 *
 * Селектор для навигации по дефолту data-ag-filter
 *
 * Селектор для элементов по дефолту data-ag-filter-item
 *
 * Настройки:
 *
 * this.filterNavSelector = '[data-ag-filter]'
 *
 * this.filterItemSelector = '[data-ag-filter-item]'
 *
 * this.itemHideClassName = '_hide'
 *
 * this.navActiveClassName = '_active'
 *
 * this.useClassStyles = false
 *
 *
 * @example
 * <nav class="filter-nav">
 *  <a href="#" class="filter-nav__link _active" data-ag-filter="all">All</a>
 *  <a href="#" class="filter-nav__link" data-ag-filter="car">Car</a>
 *  <a href="#" class="filter-nav__link" data-ag-filter="train">Train</a>
 * </nav>
 *
 * <div class="filter-content__item" data-ag-filter-item="car" >
 *  <img src="https://source.unsplash.com/random/300x200/?car" alt="car">
 * </div>
 *
 * @author
 * Glazyrin Alexey Sergeevich
 * @version 1.0.0 08/2021
 *
 *
 * @constructor
 * @param {{
 * filterNavSelector : '[data-ag-filter]',
 * filterItemSelector : '[data-ag-filter-item]',
 * itemHideClassName : '_hide',
 * navActiveClassName : '_active',
 * useClassStyles : false,
 * }} settings - node selector
 */

class AgFilter {

    /**
     *
     * @param settings
     */
    constructor(settings) {

        this.filterNavSelector = settings?.filterNavSelector || '[data-ag-filter]'
        this.filterItemSelector = settings?.filterItemSelector || '[data-ag-filter-item]'
        this.itemHideClassName = settings?.itemHideClassName || '_hide'
        this.navActiveClassName = settings?.navActiveClassName || '_active'
        this.useClassStyles = settings?.useClassStyles !== undefined

        console.log(this.useClassStyles)

        this.$filterNavs = document.querySelectorAll(this.filterNavSelector)
        this.$filterItems = document.querySelectorAll(this.filterItemSelector)
        this.maxWidthItem = 0;
        this.marginItem = 0;
        this.heightItem = 0;
        if (!this.$filterNavs && !this.$filterItems) return

        this.#setup()
    }


    #setup() {

        Array.from(this.$filterNavs).forEach(nav => {
            this.navigationClickHandler = this.navigationClickHandler.bind(this)
            nav.addEventListener('click', this.navigationClickHandler)
        })


        // Настраиваем анимацию
        if (!this.useClassStyles) {
            // Получаем значения стиля max-width у первого элемента в сетке (если ли смысл получать у всех?)
            const first = Array.from(this.$filterItems).find(Boolean)
            this.maxWidthItem = window.getComputedStyle(first, null).getPropertyValue('max-width')
            this.marginItem = window.getComputedStyle(first, null).getPropertyValue('margin')
            this.heightItem = first.offsetHeight


            // Задаем начальные стили
            Array.from(this.$filterItems).forEach($item => this.#showNode($item))
        }

    }


    navigationClickHandler(event) {

        event.preventDefault()

        const navFilter = this.#getDataset(event.target, this.filterNavSelector)
        this.#removeClass(this.$filterNavs, '_active')
        event.target.classList.add('_active')

        if (navFilter) {

            Array.from(this.$filterItems).forEach($item => {
                const itemFilter = this.#getDataset($item, this.filterItemSelector)

                if (!itemFilter) return

                // Проверяем, на соотвествие нажатого таргета
                if (itemFilter === navFilter || navFilter === 'all') {
                    $item.classList.remove(this.itemHideClassName)

                    if (!this.useClassStyles) {
                        this.#showNode($item)
                    }

                } else {
                    $item.classList.add(this.itemHideClassName)

                    if (!this.useClassStyles) {
                        this.#hideNode($item)
                    }

                }
            })
        }
    }

    /**
     *
     * @param {HTMLElement} $node
     */
    #showNode($node, duration = 1000) {

        if (!$node) return

        return new Promise((resolve) => {

            if ($node.hidden) {
                $node.hidden = false;
            }
            let width = $node.offsetWidth;
            $node.style.overflow = 'hidden';
            $node.style.width = 0;
            $node.style.paddingTop = 0;
            $node.style.paddingBottom = 0;
            // $node.style.marginTop = 0;
            // $node.style.marginBottom = 0;
            $node.style.marginLeft = 0;
            $node.style.marginRight = 0;
            $node.offsetWidth;
            $node.style.transitionProperty = "width, margin, padding";
            $node.style.transitionDuration = duration + 'ms';
            $node.style.width = width + 'px';
            $node.style.removeProperty('padding-top');
            $node.style.removeProperty('padding-bottom');
            $node.style.removeProperty('margin-top');
            $node.style.removeProperty('margin-bottom');
            $node.style.removeProperty('margin-left');
            $node.style.removeProperty('margin-right');
            window.setTimeout(() => {
                $node.style.removeProperty('width');
                $node.style.removeProperty('overflow');
                $node.style.removeProperty('transition-duration');
                $node.style.removeProperty('transition-property');

                resolve(); // промис выполнен
            }, duration);

        })
    }

    /**
     *
     * @param {HTMLElement} $node
     */
    #hideNode($node, duration = 1000) {

        if (!$node) return

        return new Promise(resolve => {
                $node.style.transitionProperty = 'width, margin, padding';
                $node.style.transitionDuration = duration + 'ms';
                $node.style.width = $node.offsetWidth + 'px';
                $node.offsetWidth;
                $node.style.overflow = 'hidden';
                $node.style.width = 0;
                $node.style.paddingTop = 0;
                $node.style.paddingBottom = 0;
                // $node.style.marginTop = 0;
                // $node.style.marginBottom = 0;
                $node.style.marginLeft = 0;
                $node.style.marginRight = 0;
                window.setTimeout(() => {
                    $node.hidden = true;
                    $node.style.removeProperty('width');
                    $node.style.removeProperty('padding-top');
                    $node.style.removeProperty('padding-bottom');
                    // $node.style.removeProperty('margin-top');
                    // $node.style.removeProperty('margin-bottom');
                    $node.style.removeProperty('margin-left');
                    $node.style.removeProperty('margin-right');
                    $node.style.removeProperty('overflow');
                    $node.style.removeProperty('transition-duration');
                    $node.style.removeProperty('transition-property');
                    resolve(); // промис выполнен
                }, duration);
            })

    }


    #removeClass(elements, className) {
        Array.from(elements).forEach(element => element.classList.remove(className))
    }


    #getDataset(element, datasetSelector) {
        // Очищаем от скобок
        const dataset = datasetSelector.replace(/[\[\]]/g, "");
        return element.getAttribute(dataset)
    }


}

export default AgFilter