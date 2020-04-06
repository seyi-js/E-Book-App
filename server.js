const express = require('express');
const bodyParser = require( 'body-parser' );
const keys = require('./config/keys')
const PORT = process.env.PORT || 2000;
const app = express();
const path = require( 'path' );
const expressLayouts = require( 'express-ejs-layouts' );
const stripe = require( 'stripe' )(keys.stripeSecretKey);


//EJS CONFIG
app.use(expressLayouts);
app.set('veiws', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

//SERVING STATIC FILES
app.use(express.static('static'));
app.use('/static', express.static('static'));
app.use(express.static(__dirname + '/static'));


//BODY PARSER CONFIG
app.use(bodyParser.urlencoded({
    extended: false
}));
//Landing Page
app.get( '/', ( req, res ) => {
    res.render( 'index', {
        keys: keys.stripePublishableKey
    })
})

// Charge Route
app.post('/charge', (req, res) => {
  const amount = 2500;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'The After Life',
    currency: 'USD',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});


app.listen(PORT, console.log(`Server started on port ${PORT}`));