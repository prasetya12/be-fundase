const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/fundase',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})