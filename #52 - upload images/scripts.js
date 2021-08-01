import AGUploadImages from "./upload";


const upload = new AGUploadImages('#file',
    {
        multi: true,
        accept: ['.png', '.jpg', '.jpeg', '.gif'],
        onUpload(files, blocks) {
            files.forEach((file, index) => {
                const ref = storage.ref(`images/${file.name}`)
                const task = ref.put(file)

                task.on('state_changed', snapshot => {
                    const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                    const block = blocks[index].querySelector('.preview-info-progress')
                    block.textContent = percentage
                    block.style.width = percentage
                }, error => {
                    console.log(error)
                }, () => {
                    task.snapshot.ref.getDownloadURL().then(url => {
                        console.log('Download URL', url)
                    })
                })
            })
        }
    }
)

window.upl = upload