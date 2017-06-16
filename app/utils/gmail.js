'use strict'

let gmail = require('../../config/creds').gmail;

module.exports = {
  setSubject: function(order) {
    let order_number = order.id.replace('or_','');

    return 'Order ' + order_number + ' confirmed';
  },

  formatEmail: function(order) {
    let line2 = order.shipping.line2 ? order.shipping.line2 + ', ' : '',
        message = order.metadata.message ? order.metadata.message : 'None.',
        emailHtml = '<h1>Order Confirmation</h1>'
              + '<p>Thank you for placing an order at Revenge Crate.</p>'
              + '<p><h3><b>Order details:<b></h3><br />'
              + '<b>Your Victim</b><br />'
              + 'Death By: ' + order.metadata.product + '<br />'
              + 'Name: ' + order.shipping.name + '<br />'
              + 'Shipping to: ' + order.shipping.address.line1+ line2 + ', ' 
              + order.shipping.address.city + ', ' + order.shipping.address.state 
              + ' ' + order.shipping.address.postal_code + '<br />'
              + 'Message: ' + message
              + '</p>';

    return emailHtml;
  },

  sendEmail: function(to_email, order) {
    let send = require('gmail-send')({
      user: gmail.from_email,
      pass: gmail.app_pass,
      to: to_email,
      subject: module.exports.setSubject(order),
      html: module.exports.formatEmail(order)
    })();
  } 
}