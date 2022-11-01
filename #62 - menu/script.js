document.addEventListener('DOMContentLoaded', function (e) {

    {
        const $menu = document.querySelector('.menu-main')
        const $subMenu = document.querySelector('.menu-sub')
        const $more = document.querySelector('.menu-more')

        const trimMenu = () => {

            // Нужно получишь чистую ширину без бордера и паддинга

            // Получаем доступ к стилям меню
            const menuStyles = getComputedStyle($menu);

            // Бордеры
            const borderRightWidth = parseInt(menuStyles.borderRightWidth) || 0;
            const borderLeftWidth = parseInt(menuStyles.borderLeftWidth) || 0;

            // Паддинги
            const paddingRightWidth = parseInt(menuStyles.paddingRight) || 0;
            const paddingLeftWidth = parseInt(menuStyles.paddingLeft) || 0;

            const fullMenuWidth = $menu.clientWidth;
            const cleanMenuWidth = fullMenuWidth - borderRightWidth - borderLeftWidth - paddingRightWidth - paddingLeftWidth

            console.log(cleanMenuWidth);

            const elementWithSubMenu = document.createElement('li')
            elementWithSubMenu.classList.add('menu__item')
            elementWithSubMenu.insertAdjacentHTML('afterbegin', `               
                 <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                 y="0px" viewBox="0 0 426.667 426.667" style="width: 30px;">
                    <g>
                        <g>
                            <circle cx="40" cy="213.333" r="30" />
                        </g>
                    </g>
                    <g>
                        <g>
                            <circle cx="140" cy="213.333" r="30" />
                        </g>
                    </g>
                    <g>
                        <g>
                            <circle cx="240" cy="213.333" r="30" />
                        </g>
                    </g>
                </svg>
                <ul class="menu-sub menu">
    
                </ul>            
            `)


            // Получаем длину дочерних элементов
            const $menuItems = $menu.querySelectorAll('li');


            let menuSiblingsWidth = 0
            const itemsForRemplace = []

            Array.from($menuItems).forEach($item => {
                menuSiblingsWidth += $item.offsetWidth

                if (menuSiblingsWidth > cleanMenuWidth) {
                    itemsForRemplace.push($item)
                }
            })

            if (itemsForRemplace.length > 0) {
                const $subMenu = elementWithSubMenu.querySelector('ul')

                itemsForRemplace.forEach(item => {
                    $subMenu.insertAdjacentElement('beforeend', item)
                })

                $menu.appendChild(elementWithSubMenu)

            }

        }

        trimMenu()
    }


    // const nextAll = element => {
    //     const nextElements = [];
    //
    //     while (element.nextElementSibling) {
    //         nextElements.push(element.nextElementSibling);
    //         element = element.nextElementSibling;
    //     }
    //
    //     return nextElements;
    // }
    //
    // const menu = document.querySelector('.menu-main'),
    //     more = document.querySelector('.menu-more'),
    //     subMenu = document.querySelector('.menu-sub'),
    //     parent = document.querySelector('.menu-wrapper'),
    //     root = document.documentElement,
    //     moreWidth = getComputedStyle(root).getPropertyValue('--more-width'),
    //     moreMargin = getComputedStyle(root).getPropertyValue('--more-margin'),
    //     menuMargin = getComputedStyle(root).getPropertyValue('--menu-margin');
    //
    // let windowWidth = window.innerWidth;
    //
    // console.log(parent.offsetWidth, parent.innerWidth)
    //
    // const contract = () => {
    //     let w = 0,
    //         outerWidth = parent.offsetWidth - (parseInt(moreWidth) + parseInt(moreMargin) + parseInt(menuMargin) + 30);
    //
    //     console.log(parent.offsetWidth, outerWidth ,parent)
    //
    //     let menuItems = menu.querySelectorAll('li');
    //
    //     for (let i = 0; i < menuItems.length; i++) {
    //         w += menuItems[i].offsetWidth;
    //
    //         if (w > outerWidth) {
    //             let nextElements = nextAll(menuItems[i - 1]);
    //
    //             let nextReverse = nextElements.reverse();
    //
    //             nextReverse.forEach(el => {
    //                 el.remove();
    //                 subMenu.prepend(el);
    //             });
    //
    //             break;
    //         }
    //     }
    // };
    //
    // const expand = () => {
    //     let w = 0,
    //         outerWidth = parent.offsetWidth - (parseInt(moreWidth) + parseInt(moreMargin) + parseInt(menuMargin) + 30);
    //
    //     let menuItems = menu.querySelectorAll('li');
    //     menuItems.forEach(el => {
    //         w += el.offsetWidth;
    //     });
    //
    //     let submenuItems = subMenu.querySelectorAll('li');
    //     for (let i = 0; i < submenuItems.length; i++) {
    //         w += submenuItems[i].offsetWidth;
    //         if (w > outerWidth) {
    //             let a = 0;
    //
    //             while(a < i) {
    //                 submenuItems[a].remove();
    //                 menu.appendChild(submenuItems[a]);
    //
    //                 a++;
    //             }
    //
    //             break;
    //         }
    //     }
    //
    //     if (submenuItems.length > 0) {
    //         let lastOffset = submenuItems[submenuItems.length - 1].offsetWidth;
    //
    //         if ((menu.offsetWidth + lastOffset) <= outerWidth) {
    //             submenuItems[submenuItems.length - 1].remove();
    //             menu.appendChild(submenuItems[submenuItems.length - 1]);
    //         }
    //     }
    // };
    //
    // const checkActive = () => {
    //     if (subMenu.querySelectorAll('li').length) {
    //         more.classList.add('active');
    //     } else {
    //         more.classList.remove('active');
    //     }
    // };
    //
    // contract();
    // checkActive();
    //
    // window.addEventListener('resize', () => {
    //     (window.innerWidth > windowWidth) ? expand() : contract();
    //     windowWidth = window.innerWidth;
    //     checkActive();
    // });

})
