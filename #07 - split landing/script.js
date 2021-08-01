const $container = document.querySelector('.container')
const $left = $container.querySelector('.left')
const $right = $container.querySelector('.right')


$left.addEventListener('mouseenter', function () {
    $left.style.flexGrow = 2
    $left.querySelector('img').style.opacity = 0.8
})

$left.addEventListener('mouseleave', function () {
    $left.style.flexGrow = 1
    $left.querySelector('img').style.opacity = 0.3
})

$right.addEventListener('mouseenter', function () {
    $right.style.flexGrow = 2
    $right.querySelector('img').style.opacity = 0.8
})

$right.addEventListener('mouseleave', function () {
    $right.style.flexGrow = 1
    $right.querySelector('img').style.opacity = 0.3
})