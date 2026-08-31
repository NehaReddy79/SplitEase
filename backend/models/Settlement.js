const mongoose = require('mongoose')

const settlementScheme = new mongoose.Schema({
    group : {type : mongoose.Schema.Types.ObjectId , ref : 'Group'},
    from : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    to : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    amount : {type : Number , required : true},
    date : {type : Date , default : Date.now}
})

const Settlement  = mongoose.model('Settlement' , settlementScheme)
module.exports = Settlement