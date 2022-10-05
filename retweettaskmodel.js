const mongoose = require('mongoose')

const retweettaskSchema = mongoose.Schema({
    retweet : {
        type: Boolean,
    
    },
    loggedUserData : {
        type: String,
    
    },

    

})




module.exports  = mongoose.model('retweettasks',retweettaskSchema);
