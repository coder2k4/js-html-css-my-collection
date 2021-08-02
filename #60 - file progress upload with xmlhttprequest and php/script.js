const $select_file = document.getElementById('select_file')
const $uploaded_image = document.getElementById('uploaded_image')
const $progess_bar = document.getElementById('progess_bar')
const $progess_bar_process = document.getElementById('progess_bar_process')


$select_file.addEventListener('change', function (event) {


    const form_data = new FormData()

    let image_number = 1;
    let error = '';

    for (let i = 0; i < event.target.files.length; i++) {

        if (!['image/jpeg', 'image/png', 'video/mp4'].includes(event.target.files[i].type)) {
            error += `<div class="alert alert-danger"><b>${image_number}</b> Загрузить можно только [ .jpg .png .mp4 ]</div>`
        } else {
            form_data.append('images[]', event.target.files[i])
        }

        image_number++;
    }

    if (error !== '') {
        $uploaded_image.insertAdjacentHTML('afterbegin', error)
        $select_file.value = ''
    } else {
        $progess_bar.style.display = 'block'

        /// XMLHttpRequest
        const ajax_request = new XMLHttpRequest()

        ajax_request.open('POST', 'upload.php')
        ajax_request.upload.addEventListener('progress', function (event) {

            const percent_complete = Math.round((event.loaded / event.total) * 100)

            $progess_bar_process.style.width = percent_complete + '%'
            $progess_bar_process.innerHTML = `${percent_complete}% завершено`

        })
        ajax_request.addEventListener('load', function (event) {
            console.log(event)
            $uploaded_image.insertAdjacentHTML('afterbegin', '<div class="alert alert-success">Файлы загружены!</div>')
            $uploaded_image.insertAdjacentHTML('afterbegin', `<div class="alert alert-success">Ответ от сервера: ${event.target.response}</div>`)
            $select_file.value = ''
        })

        ajax_request.send(form_data)
    }


})


