/**
 * @description
 * The plugin moves through media queries dom nodes
 * Add dataset to your element : data-ag-shifter=".element-2 , 940 , afterend"
 * @example (1)
 * <div class="element-5" data-ag-shifter=".element-2 , 940 , afterend">5</div>
 *
 * ".element-2"         - selector, where you transfer current node
 * 940                  - media query, (max-width: 940px)
 * "afterend"           - position [beforebegin afterbegin beforeend afterend]
 *
 * @example (2)
 * <div class="element-4" data-ag-shifter=".element-3 , 1280 , beforeend">5</div>
 *
 * @author Glazyrin Alexey Sergeevich
 * @version 1.0.0 07/2021
 *
 * @constructor
 * @param {string} selector - global selector to search the entire dom.
 * @param {('desktop'|'mobile')} type - 'desktop' (def.) / 'mobile' first
 */
class AgDomShifter {

    constructor(selector = '[data-ag-shifter]', type = 'desktop') {

        this.type = type === 'mobile' ? 'min' : 'max'  // mobile first / desktop first
        this.objects = [];      // Хранилище наших узлов
        this.screens = []       // matchMedia экраны
        this.mediaQueryes = []  // массив уникальных строк вида (max-width: 768px)

        this.$nodes = document.querySelectorAll(selector)
        if (!this.$nodes.length) return


        this.#setup();
    }

    #setup() {

        // Перебираем все узлы, парсим селекторы, разрешение и место вставки
        this.$nodes.forEach($node => {

            const [place, breakpoint, position = "afterend"] = $node.dataset['agShifter'].replaceAll(' ', '').split(',')

            const placeElement = document.querySelector(place) // Ноды нашего назначения
            if (!placeElement || !breakpoint) return


            this.objects.push({
                $node,                                                      // Наш элемент
                $placeNode: placeElement,                                   // Место куда будем вставлять элемент
                breakpoint,                                                 // Брейпоинт
                position,                                                   // beforebegin afterbegin beforeend afterend
                $parentNode: $node.parentNode,                              // Родитель в котором находился наш dom (нужно для корректного восстановления)
                indexInParent: this.#indexInParent($node.parentNode, $node),// Индекс элемента в родителе, если их было несколько (нужно для корректного восстановления)
            })
        })

        this.#prepareMediaQueries()
    }

    // Создаем строку вида: (max-width: 768px), фильтруем все разрешения и оставляем уникальные
    #prepareMediaQueries() {

        // media : (max-width: 768px) , breakpoint : 768
        this.mediaQueryes = this.objects.map(object => ({
            media: `(${this.type}-width: ${object.breakpoint}px)`,
            breakpoint: object.breakpoint
        }))


        // Проверка на уникальность
        this.mediaQueryes = [...new Map(this.mediaQueryes.map(item =>
            [item['media'], item])).values()];


        // Вешаем события
        this.mediaQueryes.forEach(mediaQuery => {

            const mediaElements = this.objects.filter(object => object.breakpoint === mediaQuery.breakpoint) // список элементов с текущим брейкпоинтом

            if (matchMedia) {
                screen = window.matchMedia(mediaQuery.media) // (max-width: 768px)
                const event = this.screenHandler(mediaElements)
                screen.addListener(event)
                event(screen)
                this.screens.push({mMedia: screen, event}) // для снятия события при дестрое
            }

        })
    }


    // Получаем индекс элемента, если в родителе он не один.
    #indexInParent($parentNode, $node) {
        return Array.prototype.indexOf.call($parentNode.children, $node);
    }

    screenHandler(mediaElements) {
        return (screen) => {
            if (!mediaElements.length) return

            if (screen.matches) {
                const beforebegin = mediaElements.filter(element => element.position === 'beforebegin' || element.position === 'beforeend')
                beforebegin.forEach(element => this.moveTo(element))
                const beforeend = mediaElements.filter(element => element.position === 'afterbegin' || element.position === 'afterend')
                beforeend.slice().reverse().forEach(element => this.moveTo(element))
            } else {
                mediaElements.forEach(element => this.moveBack(element))
            }
        }
    }


    // Перемещение элемента
    moveTo(element = {}) {
        const {
            $node,
            $placeNode,
            $parentNode,
            position
        } = element

        // Обновляем позицию по брейкопину (вдруг у нас уже кто-то убежал из родителя)
        element.indexInParent = this.#indexInParent($parentNode, $node)

        $placeNode.insertAdjacentElement(position, $node)
    }

    // Возвращаем элемент
    moveBack(element = {}) {
        const {
            $node,
            $parentNode,
            indexInParent,
        } = element


        if($parentNode.children[indexInParent])
            $parentNode.children[indexInParent].insertAdjacentElement('beforebegin', $node)
        else
            $parentNode.insertAdjacentElement('beforeend', $node)

    }


    // Снимаем прослушку
    destroy() {
        this.screens.forEach(screen => screen.mMedia.removeListener(screen.event))
        console.log('AG DOM SHIFTER Events Destroyed!')
    }


}


export default AgDomShifter