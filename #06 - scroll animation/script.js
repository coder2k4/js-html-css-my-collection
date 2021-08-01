/**
 * @description
 * Animate blocks with Animate css library or other ...
 * No throttle, nice performance
 * Easy setup - const agA = new AgAnimate()
 *
 * Add data-ag-s-animate="animate__bounce, 5, 2" for enter animation
 * Add data-ag-e-animate="animate__zoomOut" for exit animation
 *
 * you can skip params and add only [data-ag-s-animate]
 *
 * @example
 * <div class="box" data-ag-s-animate="animate__bounce, 5, 2" data-ag-e-animate="animate__zoomOut">Box 1</div>
 *
 * data-ag-s-animate="animate__bounce, 5, 2"
 * animate__bounce      - enter animation class
 * 5                    - animation duration
 * 2                    - animation delay
 *
 * data-ag-e-animate="animate__zoomOut, 0.7, .1"
 * animate__zoomOut     - exit animation class
 * 5                    - animation duration
 * 2                    - animation delay
 *
 * @author Glazyrin Alexey Sergeevich
 * @version 1.0.0 07/2021
 *
 * @constructor
 * @param selector - node selector
 * @param bottomStartOffset - offset from bottom
 * @param topStartOffset - offset from top
 * @param defaultClass - default class adding for all selected elements
 */
class AgAnimate {

    constructor(
        selector = '[data-ag-s-animate]',
        bottomStartOffset,
        topStartOffset,
        defaultClass
    ) {

        this.topStartOffset = (topStartOffset || 50);
        this.bottomStartOffset = (bottomStartOffset || 50);


        this.defaultClass = (defaultClass || 'animate__animated')


        const $elements = document.querySelectorAll(selector)
        this.objects = [] // Массив будущих распаршенных объектов

        if (!$elements.length) return

        this.#setup($elements) // Распаршиваем данные по анимации из объектов

    }

    // Собираем наши объекты
    #setup($elements) {

        // Парсим элементы
        $elements.forEach($element => {


            let startData = []


            if ($element.dataset.agSAnimate)
                startData = $element.dataset.agSAnimate.replaceAll(' ', '').split(',')

            const start = {
                animation: startData[0] ? startData[0] : 'animate__fadeIn',
                duration: startData[1],
                delay: startData[2],
                started: false
            }

            let endData = []

            if ($element.dataset.agEAnimate)
                endData = $element.dataset.agEAnimate.replaceAll(' ', '').split(',')


            const end = {
                animation: endData[0] ? endData[0] : 'animate__fadeOut',
                duration: endData[1],
                delay: endData[2],
                started: false
            }


            const object = {
                $node: $element,
                start,
                end
            }

            $element.classList.add(this.defaultClass) // Добавлем дефонтный класс, если задан


            this.addAnimationOnLoad(object)
            this.objects.push(object)

        })


        this.scrollHandler = this.scrollHandler.bind(this)
        // Добавляем событие скрола
        window.addEventListener('scroll', this.#throttleStop(this.scrollHandler, 50))

    }


    addAnimationOnLoad(object) {
        const objectTopPosition = object.$node.getBoundingClientRect().top
        if (objectTopPosition < this.bottomStartPosition && objectTopPosition > this.topStartPostion)
            object.$node.classList.add(object.start.animation)
    }


    #throttleStop(callback, wait) {
        let time = Date.now();
        return function (e) {
            if ((time + wait - Date.now()) < 0) {
                callback(e);
                time = Date.now();
            }
        }
    }


    checkVisible(elm) {
        const rect = elm.getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        // console.log('rect:', rect)
        // console.log('rect.bottom:', rect.bottom)
        // console.log('rect.top - viewHeight:', rect.top - viewHeight)
        // console.log('this.bottomStartPosition:', this.bottomStartOffset)
        // console.log('this.topStartOffset:', this.topStartOffset)
        return !(rect.bottom - this.topStartOffset < 0 || rect.top - viewHeight + this.bottomStartOffset >= 0);
    }


    scrollHandler(event) {


        if (!this.objects) return


        this.objects.forEach(object => {


            if (this.checkVisible(object.$node)) {

                // console.log('object.top:', object.top)
                // console.log('this.bottomStartPosition:', this.bottomStartPosition)
                // console.log('this.topStartPostion:', this.topStartPostion)
                // console.log('object.top:', object.$node.getBoundingClientRect().top)
                // console.log('object.bottom:', object.$node.getBoundingClientRect().bottom)

                if (object.start.started) return;

                object.$node.classList.remove(object.end.animation)

                object.$node.style.animationDuration = object.start?.duration + 's'
                object.$node.style.animationDelay = object.start?.delay + 's'

                let timeout = Number.parseFloat(object.start.duration) + Number.parseFloat(object.start.delay) * 1100
                if (!timeout)
                    timeout = 2000

                object.$node.classList.add(object.start.animation)
                object.start.started = true

                setTimeout(() => {
                    object.start.started = false
                }, timeout)


            } else {


                if (object.end.started) return;

                object.$node.classList.remove(object.start.animation)

                object.$node.style.animationDuration = object.end?.duration + 's'
                object.$node.style.animationDelay = object.end?.delay + 's'

                let timeout = Number.parseFloat(object.end.duration) + Number.parseFloat(object.end.delay) * 1100
                if (!timeout)
                    timeout = 2000

                object.$node.classList.add(object.end.animation)
                object.end.started = true

                setTimeout(() => {
                    object.end.started = false
                }, timeout)

            }

        })


    }

}

const aga = new AgAnimate()

window.aga = aga