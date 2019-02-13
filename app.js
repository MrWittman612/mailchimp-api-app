const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname,'public')));

// sign up route
app.post('/signup', (req, res) => {
  const {firstName, lastName, email} = req.body;

  if ( !firstName || !lastName || !email ) {
    res.redirect('/fail.html');
    return;
  }

  const data = {
    members: [
      {
        email_address: email,
        status:'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    URL: 'https://us19.api.mailchimp.com/3.0/lists/cf8600c787',
    method: 'POST',
    headers: {
      Authorization: 'auth 4bf6e23d3a0682283660009e5c1d8a72-us19'
    },
    body: postData
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect('/fail.html');
    } else {
      if (response.statusCode === 200) {
        res.redirect('/success.html');
      } else {
        res.redirect('/fail.html');
      }
    }
  });
});

app.listen(PORT, console.log(`Server started on ${PORT}`));