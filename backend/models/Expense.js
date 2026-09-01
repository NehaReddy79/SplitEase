const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    group : {type : mongoose.Schema.Types.ObjectId , ref : 'Group'},
    paidBy : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    amount : {type : Number , required : true},
    description : {type : String , required : true},
    splitType : {type : String , enum : ['equal' , 'percentage' , 'exact'] ,default : 'equal'},
    splits : [
        {
            user : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
            amount : {type : Number , required : true}
        }
    ],
    date : {type : Date , default : Date.now},
    category : {type : String , enum : ['food' , 'travel' , 'accommodation' , 'shopping' , 'utilities', 'entertainment', 'other'], default : 'other' } 
})

const Expense = mongoose.model('Expense' , expenseSchema)
module.exports = Expense