const express = require('express')
const axios = require('axios');

const app = express();

const db = require('./database');
// pour permettre la communication entre le front et le back en dev.
const cors = require('cors');

// a ajouter pour la communication entre le front et le back en dev lorsque express est instancié
app.use(cors({
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 200
}));

// Initialisation de la base avec les deux tables nécessaires (à garder)
db.init();
// exemple de requete sql à supprimer

app.get('/cities', (req, res, next) => {
    db.all('select * from city').then((rows) => {
      res.status(200).json(rows)
    }).catch(err => next(err))
});

app.get('/cities/:code/forecast', (req, res, next) => {
  const code = req.params.code;
  db.get(`select * from forecast where insee='${code}'`).then((cityForecast) => {
/*
    db.run('DELETE FROM forecast')
*/
    if(cityForecast === undefined){
      axios.get(`https://api.meteo-concept.com/api/forecast/daily?insee=${code}`, {
        headers: {
          'Authorization': `Bearer ${process.env.TOKEN_METEO}`
        }
      }).then(result => {
        const date = new Date()
        db.run(`INSERT INTO forecast (date, insee, details)
          VALUES ('${date}', '${code}', '${JSON.stringify(result.data['forecast'])}')`)

        db.get(`select details from forecast where insee='${code}'`).then((row) => {
          res.status(200).json(JSON.parse(row.details))
        })

      })



    }else{
      db.get(`select details from forecast where insee='${code}'`).then((row) => {
        res.status(200).json(JSON.parse(row.details))
      })

    }

  }).catch(err => next(err))



});


app.listen(4000, () => {
  console.log(`Server is running on: http://localhost:4000`);
});


