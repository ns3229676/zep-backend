const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    adminEmail : {
        type: String,
        required: true,
    },

    password : {
        type: String,
        required: true,
    },
    tokens : [
        {
            token:String,
        }
    ]

})

userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12)
    }
    next();

})


module.exports  = mongoose.model('userdatas',userSchema);
