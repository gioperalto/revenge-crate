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

  static fieldsAreValid() {
    var errorElement = document.querySelector('.error');
    var formShippingName = document.forms["payment_form"]["shipping_name"].value;
    var formShippingLine1 = document.forms["payment_form"]["shipping_line1"].value;
    var formShippingCity = document.forms["payment_form"]["shipping_city"].value;
    var formShippingPostalCode = document.forms["payment_form"]["shipping_postal_code"].value;
    var formEmail = document.forms["payment_form"]["email"].value;
    var formTermsCheckbox = document.forms["payment_form"]["terms_checkbox"].value;
    var formPrivacyCheckbox = document.forms["payment_form"]["privacy_checkbox"].value;
    var fieldsAreValid = true;

    errorElement.classList.remove('visible');

    if(formShippingName == null || formShippingName == "") {
      errorElement.textContent = 'Victim name not specified.';
      errorElement.classList.add('visible');
      fieldsAreValid = false;
    } else if(formShippingLine1 == null || formShippingLine1 == "") {
      errorElement.textContent = 'Address not specified.';
      errorElement.classList.add('visible');
      fieldsAreValid = false;
    } else if(formShippingCity == null || formShippingCity == "") {
      errorElement.textContent = 'City not specified.';
      errorElement.classList.add('visible');
      fieldsAreValid = false;
    } else if(formShippingPostalCode == null || formShippingPostalCode == "") {
      errorElement.textContent = 'ZIP not specified.';
      errorElement.classList.add('visible');
      fieldsAreValid = false;
    } else if(formEmail == null || formEmail == "") {
      errorElement.textContent = 'Email not specified.';
      errorElement.classList.add('visible');
      fieldsAreValid = false;
    } else if(formTermsCheckbox == null || formTermsCheckbox == "") {
      errorElement.textContent = 'Terms of Service unchecked.';
      errorElement.classList.add('visible');
      fieldsAreValid = false;
    } else if(formPrivacyCheckbox == nul || formPrivacyCheckbox == "") {
      errorElement.textContent = 'Privacy Policy unchecked.';
      errorElement.classList.add('visible');
      fieldsAreValid = false;
    }

    return fieldsAreValid;
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

      if(StripeHandler.fieldsAreValid()) {
        button.className += 'submit-payment';
        button.disabled = true;
        stripe.createToken(card).then(StripeHandler.setOutcome);
      }
    });
  }
}