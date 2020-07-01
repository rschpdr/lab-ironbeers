const express = require('express');
const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ********* TO USE PARTIALS, WE HAVE TO REGISTER THEM: *********
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(express.static(path.join(__dirname, 'public')));

// add the partials here:

// add the routes here:
app.get('/', (req, res) => res.render('index'));

// **********************************************************************
// ROUTE FOR GETTING ALL THE BEERS AND IT'S RENDERED ON "/BEERS"
// **********************************************************************

app.get('/beers', async (req, res, next) => {
  try {
    const responseFromDB = await punkAPI.getBeers(); // .getBeers() is the method provided by punkAPI
    // console.log("Response is:",  responseFromDB);
    // beers is the hbs file that's gonna be rendered, it comes from "views" folder
    //  ^
    //  |-------------- |          "beers" is the name of a variable we will use in hbs file
    //                  |             |
    res.render('beers/beers.hbs', { beers: responseFromDB });
  } catch (err) {
    console.log(err);
  }
});

// **********************************************************************
// ROUTE FOR GETTING A RANDOM BEER AND IT'S RENDERED ON "/RANDOM-BEER"
// **********************************************************************

app.get('/random-beer', async (req, res, next) => {
  try {
    const responseFromApi = await punkAPI.getRandom(); // .getRandom() is the method provided by punkAPI
    // other way could be extracting this one beers from the array and
    // sending it as object to the random-beers view
    // but in that case we wouldn't be able to use partial, and we are aiming to use it later
    // res.render('beers/random-beer', { beer: responseFromApi[0] });

    res.render('beers/random-beer', { beers: responseFromApi });
  } catch (err) {
    console.log(err);
  }
});

// **********************************************************************
// ROUTE FOR GETTING DETAILS OF A SPECIFIC BEER AND IT'S RENDERED ON "/BEERS/someBeerIdGoesHere"
// **********************************************************************

// Parâmetros de URL (Ou de rota)
// http://localhost:3000/beers/34

// Query Strings
// http://localhost:3000/beers?s=onde+comprar+cerveja

app.get('/beers/:beerId', async (req, res) => {
  // console.log('params:', req.params);

  try {
    const responseFromApi = await punkAPI.getBeer(req.params.beerId);
    res.render('beers/beer-details.hbs', { beers: responseFromApi });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
