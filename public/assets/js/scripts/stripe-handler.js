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

  static setOutcome(result) {
    var successElement = document.querySelector('.success');
    var errorElement = document.querySelector('.error');

    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');

    if (result.token) {
      successElement.querySelector('.token').textContent = result.token.id;
      successElement.classList.add('visible');
    } else if (result.error) {
      errorElement.textContent = result.error.message;
      errorElement.classList.add('visible');
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
      var form = document.querySelector('form');
      var extraDetails = {
        name: form.querySelector('input[name=cardholder-name]').value,
      };
      stripe.createToken(card, extraDetails).then(StripeHandler.setOutcome);
    });
  }
}