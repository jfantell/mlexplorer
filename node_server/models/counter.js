const mongoose = require('mongoose')

//Required to use auto increment like functionality like in SQL
var CounterSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true},
    seq: { type: Number, default: 0 }
});
var Counter = mongoose.model('Counter', CounterSchema);
module.exports = Counter;