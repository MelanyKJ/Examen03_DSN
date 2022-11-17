const { Schema, model } = require('mongoose');

const Photo = new Schema({
    producto:{
        type: String,
        required: true,
    },
    marca:{
        type: String,
        required: true,
    },
    tipo:{
        type: String,
        require: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    precio:{
        type: Number,
        required: true,
    },
    imageURL:{
        type: String,
        required: true,
    },
    public_id:{
        type:String,
    },
});

module.exports = model('Photo', Photo);