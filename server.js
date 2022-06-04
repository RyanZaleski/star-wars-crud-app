const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const _dirname = '/Users/ryanzaleski/Desktop/crud';
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://yoda:yoda@cluster0.0k18k.mongodb.net/?retryWrites=true&w=majority'
// Make sure you place body-parser before your CRUD handlers!




MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {

    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    app.use(express.static('public'))
    

    app.get('/', (req, res) => {
      quotesCollection.find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
          console.log(results)
        })
        .catch(error => console.error(error))
        
  })

    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })

      app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
          { name: 'Yoda', },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote
            }
          },
          {
            upsert: true
          }
        )
        .then(result => {
          res.json('Success')
         })
        .catch(error => console.error(error))
      })

      app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
          { name: req.body.name }
        )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json(`Deleted Darth Vadar's quote`)
        })
        .catch(error => console.error(error))
      })


    app.listen(3000, function() {
        console.log('listening on 3000')
      })


  })

console.log('May Node be with you')