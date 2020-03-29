const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const TPLink = require('./TPLink');
const authentication = require('./auth');

const app = express();
const port = 1423;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
app.use(authentication);
app.use(express.json());
app.use(express.static(path.resolve(__dirname, './dist')));

app.post('/light/off', (req, res) => {
  TPLink.bulbOff();
  res.end();
});

app.post('/light/hsb', (req, res) => {
  const { hue, saturation } = req.body;
  TPLink.bulbOnHSB(hue, saturation, 100);
  res.end();
});

app.post('/plug/on', (req, res) => {
  TPLink.plugOn();
  res.end();
});

app.post('/plug/off', (req, res) => {
  TPLink.plugOff();
  res.end();
});

app.listen(port, '0.0.0.0');
