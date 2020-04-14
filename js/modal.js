const showModal = modalId => {
    document.querySelector('#' + modalId).classList.remove('hide')
    document.body.classList.add('modal-open')
}

const hideModal = modal => {
    if (typeof modal == 'string') {
        modal = document.querySelector('#' + modal)
    }
    modal.classList.add('hide')
    document.body.classList.remove('modal-open')
}

const toggleModal = modalId => {
    document.querySelector('#' + modalId).classList.toggle('hide')
    document.body.classList.toggle('modal-open')
}

document.querySelectorAll('.modal .close').forEach(btn => {
    btn.addEventListener('click', () => {
        hideModal(document.querySelector('.modal:not(.hide)'))
    })
})