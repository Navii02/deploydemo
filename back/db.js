const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://naveenshaji02:naveen@collegeofficedata.scsxkdd.mongodb.net/Office',{useNewUrlParser:true,useUnifiedTopology:true},
    err => {
        if (!err)
            console.log('Mongodb connection succeeded.')
        else
            console.log('Error while connecting MongoDB : ' + JSON.stringify(err, undefined, 2))
    })