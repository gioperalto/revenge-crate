'use strict'

let nodemailer = require('nodemailer'),
    gmail = require('../../config/creds').gmail,
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmail.from_email,
        pass: gmail.app_pass
      }
    });

module.exports = {
  setSubject: function(order) {
    let order_number = order.id.replace('or_','');

    return 'Order ' + order_number + ' confirmed ✔';
  },

  setText: function(order) {
    let line2 = order.shipping.line2 ? order.shipping.line2 + ', ' : '',
        message = order.metadata.message ? order.metadata.message : 'Nothing.',
        emailText = 'Thank you for placing an order at Revenge Crate. You have ordered '
                + order.metadata.order + ' to be sent to ' + order.shipping.name + '. '
                + 'The shipping address is ' + order.shipping.address.line1 + line2
                + ', ' + order.shipping.address.city + ', ' + order.shipping.address.state
                + ' ' + order.shipping.address.postal_code + '. The message you want to send is: '
                + message;

    return emailText;
  },

  setHtml: function(order) {
    let line2 = order.shipping.line2 ? order.shipping.line2 + ', ' : '',
        message = order.metadata.message ? order.metadata.message : 'None.',
        emailHtml = '<h1>Order Confirmation</h1>'
              + '<p>Thank you for placing an order at Revenge Crate.</p>'
              + '<p><h3><b>Order details:<b></h3><br />'
              + '<b>Their Info</b><br />'
              + 'Crate: ' + order.metadata.order + '<br />'
              + 'Name: ' + order.shipping.name + '<br />'
              + 'Shipping to: ' + order.shipping.address.line1+ line2 + ', ' 
              + order.shipping.address.city + ', ' + order.shipping.address.state 
              + ' ' + order.shipping.address.postal_code + '<br />'
              + 'Message: ' + message
              + '</p>';

    return emailHtml;
  },

  setErrorHtml: function(error, body) {
    let emailHtml = 'Crate: ' + body.selected_item_name + '<br />'
              + 'Name: ' + body.shipping_name + '<br />'
              + 'Shipping to: ' + body.shipping_line1 + ', '
              + body.shipping_line2 + ', ' + body.shipping_city
              + ', ' + body.shipping_state + ' ' + body.shipping_postal_code
              + '<br />' + 'Message: ' + body.message + '<br />'
              + 'Error: ' + error;

    return emailHtml;
  },

  sendEmail: function(to_email, order) {
    let mailOptions = {
      from: '"Revenge Crate" <' + gmail.from_email + '>',
      to: to_email,
      bcc: gmail.from_email,
      subject: module.exports.setSubject(order),
      text: module.exports.setText(order),
      html: module.exports.setHtml(order)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) { 
        console.log(error);
      }
    });
  },

  sendErrorEmail: function(err, body) {
    let mailOptions = {
      from: '"Revenge Crate" <info@revengecrate.com>',
      to: gmail.from_email,
      subject: 'Error placing order from ' + body.email,
      html: module.exports.setErrorHtml(err, body)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.log(error);
      }
    });
  }
}