document.addEventListener('DOMContentLoaded', function () {


    const [$progress] = document.getElementsByClassName('progress');
    const $circles = document.querySelectorAll('.scroll-to-top-btn')
    const [$prevBtn] = document.getElementsByClassName('prev');
    const [$nextBtn] = document.getElementsByClassName('next');

    console.log($prevBtn)


    let currentActiveLen = 1

    $prevBtn.addEventListener('click', function (e) {

        currentActiveLen--;
        checkLen();
        update();

    })


    $nextBtn.addEventListener('click', function (e) {

        currentActiveLen++;
        checkLen();
        update();

    })


    function checkLen() {

        if( currentActiveLen >= $circles.length) {
            currentActiveLen = $circles.length
            $nextBtn.setAttribute("disabled", true);
        }
        else  {
            $nextBtn.removeAttribute("disabled");
        }

        if( currentActiveLen <= 1) {
            currentActiveLen = 1
            $prevBtn.setAttribute("disabled", true);
        }
        else  {
            $prevBtn.removeAttribute("disabled");
        }

    }


    function update() {

        Array.from($circles).forEach(($circle, id) => {

            if(id < currentActiveLen)
                $circle.classList.add('active')
            else {
                $circle.classList.remove('active')
            }

        })

        $progress.style.width = `${ (currentActiveLen-1) / ($circles.length - 1) * 100 }%`

    }

})

