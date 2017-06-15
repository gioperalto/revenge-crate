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

    card.mount('#card-element');
    card.addEventListener('change', function(event) {
      StripeHandler.setOutcome(event);
    });
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      stripe.createToken(card).then(StripeHandler.setOutcome);
    });
  }
}