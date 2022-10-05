const mongoose = require('mongoose')

const telegramtaskSchema = mongoose.Schema({
    joinTelegram : {
        type: Boolean,
    
    },
    loggedUserData : {
        type: String,
    
    },

    

})




module.exports  = mongoose.model('telegramtasks',telegramtaskSchema);
