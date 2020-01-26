const express = require('express')
require('./src/db/mongoose')
const bodyParser = require('body-parser')
const app = express()
const port = 4000

const accountRouter = require('./src/routers/account')

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}))

app.use(express.json())
app.use(accountRouter)

app.listen(port,()=>{
    console.log(`Server is running is ${port}`)
})