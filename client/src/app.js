const express = require('express');
const path = require('path');
const { data } = require('./DB/realEstate.json');

const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { data });
});

app.get('/estate/:id', (req, res) => {
  const _id = '' + req.params.id;
  const propertyData = data.filter((d) => d.id == _id);
  res.render('estate', { prop: propertyData[0] });
});

app.listen(port, () => {
  console.log('Running on port ' + port);
});
