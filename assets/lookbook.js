document.addEventListener('DOMContentLoaded', () => {
    const lookbookBtn = document.querySelectorAll('.lookbook-button');
    const lookbookModal = document.querySelectorAll('.lookbook-modal');
    const closeModal = document.querySelectorAll('.close-modal');
    const addToCartForms = document.querySelectorAll('.lookbook-modal form[action="/cart/add"]');
    const addToCartInputs = document.querySelectorAll('.lookbook-modal form[action="/cart/add"] input[name="id"]');
    const oldPrices = document.querySelectorAll('.lookbook-modal .modal-item .oldprice-item');
    const prices = document.querySelectorAll('.lookbook-modal .modal-item .price-item');



    lookbookBtn.forEach((item, index) => {
        item.addEventListener('click', () => {
            lookbookModal[index].classList.add('active');
            closeModal[index].classList.add('active');
        });
    });

    closeModal.forEach((item, index) => {
        item.addEventListener('click', () => {
            lookbookModal[index].classList.remove('active');
            closeModal[index].classList.remove('active');
        });
    });

    const modalItems = document.querySelectorAll('.lookbook-modal .modal-item');

    modalItems.forEach((item, index) => {
        item.addEventListener('change', () => {

            let id = event.target.value;
            let price = document.querySelector(`.modal-item .variant-select option[value="${event.target.value}"]`).getAttribute('data-price');
            let oldprice = document.querySelector(`.modal-item .variant-select option[value="${event.target.value}"]`).getAttribute('data-oldprice');
            // productImg[i].setAttribute('src', img);
            oldPrices[index].innerHTML = oldprice;
            prices[index].innerHTML = price;
            addToCartInputs[index].setAttribute("value", id);
        });
    })

    addToCartForms.forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            await fetch("/cart/add", {
                method: "post",
                body: new FormData(form)
            });


            const cart = await fetch('/cart.js');
            const cartObject = await cart.json();
            if (document.querySelector('.cart-count-bubble span')) {
                document.querySelector('.cart-count-bubble span').innerHTML = cartObject.item_count;
            } else {
                document.querySelector('#cart-icon-bubble').insertAdjacentHTML('beforeend', `<div class="cart-count-bubble"><span aria-hidden="true">${cartObject.item_count}</span><span class="visually-hidden">${cartObject.item_count} item</span>
                 </div>`);
            }


            const resCartItems = await fetch('/?section_id=cart-drawer');
            const cartItems = await resCartItems.text();
            const htmlItems = new DOMParser().parseFromString(cartItems, 'text/html');
            if (document.querySelector('.cart-items')) {
                document.querySelector('.cart-items').innerHTML = htmlItems.querySelector('.cart-items').innerHTML;
            } else {
                document.querySelector('.drawer__inner ').innerHTML = htmlItems.querySelector('.drawer__inner').innerHTML;
                document.querySelector('cart-drawer').classList.toggle('is-empty');
            }



        });
    });

});