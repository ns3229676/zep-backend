const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const taskSchema = mongoose.Schema({
    twitterFollow : {
        type: Boolean,
        required: true,
    },

    joinTelegram : {
        type: Boolean,
        
        required: true,
    },
    retweet : {
        type: Boolean,
        
        required: true,
    },
    tweet : {
        type: Boolean,
        
        required: true,
    },
    walletAddress : {
        type: Boolean,
        
        required: true,
    },
    

})




module.exports  = mongoose.model('tasks',taskSchema);
