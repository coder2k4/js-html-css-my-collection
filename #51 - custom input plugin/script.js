import Select from "./select";

const select = new Select('.select', {
    placeholder: "Выберити язык программирования",
    icon: "<i>#</i>",
    items: [
        {id:1 , text: "C++"},
        {id:2 , text: "Assembler"},
        {id:3 , text: "Java"},
        {id:4 , text: "JavaScript"},
        {id:5 , text: "PHP"},
        {id:6 , text: "Python"},
    ],
    useHiddenInput: true,
    customInputSelector: '.myHiddenInput',
    onSelect(item) {
        console.log(item)
    }
});

window.s = select;