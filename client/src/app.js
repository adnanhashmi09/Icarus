const express = require('express');
const path = require('path');
const { data } = require('./DB/realEstate.json');
const { mintTokens, mintFractions, mintComplete, TransferTokens, getTokenDetails } = require('./controls/ContractControls');
const { pinNFTToIPFS } = require('./controls/IPFSControls');

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

app.get('/estate/:id', async (req, res) => {
  const _id = '' + req.params.id;
  const propertyData = data.filter((d) => d.id == _id);
  const details = await getTokenDetails(req.params.id);
  propertyData[0]["tokens-available"] = details['4'];
  res.render('estate', { prop: propertyData[0] });
});

app.post('/estate/:id', (req,res) => {
  const tokenId = req.params.id;
  const amount = req.body.token;
  const user = req.body.account;
  console.log(tokenId, amount, user);
  TransferTokens(user, tokenId, amount);
  res.redirect('/');
})

app.listen(port, () => {
  console.log('Running on port ' + port);
});
