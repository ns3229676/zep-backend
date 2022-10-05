const mongoose = require('mongoose')

const walletaddressSchema = mongoose.Schema({
    walletAddress : {
        type: Number,
    
    },
    loggedUserData : {
        type: String,
    
    },

    

})




module.exports  = mongoose.model('walletaddresstasks',walletaddressSchema);
