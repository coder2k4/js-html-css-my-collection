document.addEventListener('DOMContentLoaded', function (e) {

    const $uploadBox = document.querySelector('.upload-box')
    const $previewImg = $uploadBox.querySelector('img')
    const $fileInput = $uploadBox.querySelector('input')
    const $widthInput = document.querySelector('#width')
    const $heightInput = document.querySelector('#height')
    const $ratio = document.querySelector('#ratio')

    //

    const $quality = document.querySelector('#quality')
    const $download = document.querySelector('#download')

    let ration = 0;

    const loadFile = (e) => {
        const file = e.target.files[0]
        if (!file) return

        $previewImg.src = URL.createObjectURL(file)
        $previewImg.addEventListener('load', () => {
            $widthInput.value = $previewImg.naturalWidth
            $heightInput.value = $previewImg.naturalHeight
            ration = $widthInput.value / $heightInput.value
            $uploadBox.classList.add('active')
        })
    }

    $widthInput.addEventListener('keyup', () => {
        const height = $ratio.checked ? Math.round($widthInput.value / ration) : $heightInput.value
        $heightInput.value = height
    })


    $heightInput.addEventListener('keyup', () => {
            const width = $ratio.checked ? Math.round($heightInput.value * ration) : $widthInput.value
            $widthInput.value = width
        }
    )

    const download = () => {
        const canvas = document.createElement('canvas')
        const a = document.createElement('a')
        const ctx = canvas.getContext('2d')

        const imgQuality = $quality ? .7 : 1;

        canvas.width = $widthInput.value
        canvas.height = $heightInput.value

        ctx.drawImage($previewImg, 0, 0, canvas.width, canvas.height)

        a.href = canvas.toDataURL('image/jpeg', imgQuality)
        a.download = new Date().getTime()
        a.click()
    }

    $fileInput.addEventListener('change', loadFile)
    $uploadBox.addEventListener('click', () => $fileInput.click())
    $download.addEventListener('click', download)
})
