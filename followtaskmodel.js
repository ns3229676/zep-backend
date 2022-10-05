const mongoose = require('mongoose')

const followtaskSchema = mongoose.Schema({
    twitterFollow : {
        type: Boolean,
    
    },
    loggedUserData : {
        type: String,
    
    },

    

})




module.exports  = mongoose.model('followtasks',followtaskSchema);
