require('dotenv').config('../.env')

const cors = require('cors') 
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(cors())

// welcome page
// app.get('/', (req, res) => {
//     res.json({ message: 'Welcome to Articles-Categories Interface'} )
// })

const articlesRouter = require('./routes/article-router')
app.use('/articles', articlesRouter)

const categoriesRouter = require('./routes/category-router')
app.use('/categories', categoriesRouter)

const api_port = (process.env.API_PORT) || 3000;
app.listen(api_port, () => console.log(`Server Started on port ${api_port}`))