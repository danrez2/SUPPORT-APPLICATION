const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please add a name'],

    },
    email:{
        type: String,
        required: [true, 'please add an email'],
        unique: true

    },
    password:{
        type: String,
        required: [true, 'please add a password'],
        unique: true

    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }

},
{
    timestamps: true,
}
)

module.exports = mongoose.model('User', userSchema)