const mongoose = require('mongoose')

const tweettaskSchema = mongoose.Schema({
    tweet : {
        type: Boolean,
    
    },
    loggedUserData : {
        type: String,
    
    },

    

})




module.exports  = mongoose.model('tweettasks',tweettaskSchema);
