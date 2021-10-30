document.addEventListener('DOMContentLoaded', () => {
    const btnCollapse = document.querySelector('#collapseBtnFoot'),
        footer = document.querySelector('.foot-collapse')

    btnCollapse.addEventListener('click',  e => {
        e.preventDefault()

        show = footer.classList.contains('show') ? false : true

        show
            ? footer.classList.add('show')
            : footer.classList.remove('show')
    })

    // Set year at footer
    const spanYear = document.querySelector('#footYear'),
    date = new Date(),
    year = date.getFullYear()
    spanYear.textContent = year
})