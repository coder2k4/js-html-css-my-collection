document.addEventListener('DOMContentLoaded', function (e) {

    const $copyBtn = document.querySelector('.password-generator__input span')
    const $passGenLengthBar = document.querySelector('.password-generator__length')
    const $lengthInput = $passGenLengthBar.querySelector('input')
    const $lengthText = $passGenLengthBar.querySelector('span')
    const $generateBtn = document.querySelector('.password-generator__generate')
    const $passSettingsInputs = document.querySelectorAll('.password-generator__settings-list input')
    const $passwordInput = document.querySelector('.password-generator__input input')
    const $passwordIndicator = document.querySelector('.password-generator__strength-indicator')

    let length = 15

    /*
        lowercase
        uppercase
        numbers
        symbols
        exc-dupe
        spacer
     */

    const characters = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '~!@#$%^&*()-_=+[]{}|;:"<>,"',
    }


    /**
     * @event passwordGenerator
     * Изменение длинны пароля
     */
    $lengthInput.addEventListener('input', function (e) {
        length = $lengthInput.value
        $lengthText.innerText = length
    })


    const passwordStrength = () => {
        if (length < 8)
            $passwordIndicator.id = 'weak'
        if (length > 8 && length <= 20)
            $passwordIndicator.id = 'medium'
        if (length > 20)
            $passwordIndicator.id = 'hard'
    }


    /**
     * @event passwordGenerator
     * Генерируем пароль
     */
    const genpass = () => {

        let staticPassword = ''
        let password = ''
        let passwordChar = ''
        let excludeDuplicates = false

        passwordStrength();

        $passSettingsInputs.forEach(settings => {
            if (settings.checked) {
                if (settings.id !== "exc-dupe" && settings.id !== "spacer")
                    staticPassword += characters[settings.id]
                else if (settings.id === "spacer")
                    staticPassword += `    ${staticPassword}   `
                else
                    excludeDuplicates = true
            }
        })

        for (let i = 0; i < length; i++) {
            passwordChar = staticPassword[Math.floor(Math.random() * staticPassword.length)]

            if (excludeDuplicates)
                !password.includes(passwordChar) || passwordChar === " " ? password += passwordChar : i--;
            else
                password += passwordChar
        }


        $passwordInput.value = password
    }

    $generateBtn.addEventListener('click', genpass)


    $copyBtn.addEventListener('click', (e) => {

        navigator.clipboard.writeText($passwordInput.value).then()
        e.target.innerText = 'check'
        setTimeout(()=>{
            e.target.innerText = 'copy_all'
        }, 500)
    })


})
