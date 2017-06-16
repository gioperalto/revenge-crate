class StripeHandler {
  constructor(token) {
    this.stripe = Stripe(token);
    this.style = {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '15px',

        '::placeholder': {
          color: '#CFD7E0',
        },
      }
    };
  }

  static stripeTokenHandler(token) {
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    form.submit();
  }

  static populateForm(target) {
    const FIRST = 0;
    var card = target.parentNode.parentNode.parentNode,
        id = card.getElementsByClassName('selected_item_id')[FIRST],
        name = card.getElementsByClassName('selected_item_name')[FIRST],
        price = card.getElementsByClassName('selected_item_price')[FIRST];
    var form = document.getElementById('payment-form'),
        formItemId = document.getElementById('selected_item_id'),
        formItemName = document.getElementById('selected_item_name'),
        formItemPrice = document.getElementById('selected_item_price');

    formItemId.setAttribute('value', id.textContent);
    formItemName.setAttribute('value', name.textContent);
    formItemPrice.textContent = price.textContent;
  }

  static setOutcome(result) {
    var successElement = document.querySelector('.success');
    var errorElement = document.querySelector('.error');

    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');

    if (result.error) {
      errorElement.textContent = result.error.message;
      errorElement.classList.add('visible');
    } else {
      StripeHandler.stripeTokenHandler(result.token);
      successElement.classList.add('visible');
    }
  }

  setup() {
    var stripe = this.stripe;
    var elements = this.stripe.elements();
    var card = elements.create('card', { style: this.style });
    var form = document.getElementById('payment-form');
    var products = document.getElementsByClassName('modal-trigger');

    card.mount('#card-element');
    card.addEventListener('change', function(event) {
      StripeHandler.setOutcome(event);
    });
    for(var i = 0; i < products.length; i++) {
      products[i].addEventListener('click', function(event) {
        StripeHandler.populateForm(event.target);
      });
    }
    form.addEventListener('submit', function(event) {
      var button = event.target.getElementsByTagName('button')[0];
      
      event.preventDefault();
      button.className += 'submit-payment';
      button.disabled = true;
      stripe.createToken(card).then(StripeHandler.setOutcome);
    });
  }
}