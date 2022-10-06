const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const app = express();
const passportSetup = require('./passport')
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const userdatas = require('./model');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const JWT = require('jsonwebtoken');

const followtasks = require('./followtaskmodel')
const tweettasks = require('./tweettaskmodel')
const retweettasks = require('./retweettaskmodel')
const walletaddresstasks = require('./walletaddresstaskmodel')
const telegramtasks = require('./telegramtaskmodel')

dotenv.config({ path: './config.env' });
const URI = process.env.URI;

app.use(
    cookieSession({
      name:'session',
      keys: ["cyberwolve"],
      maxage: 24 * 60* 60 * 100,
    })
)
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(passport.initialize());
app.use(passport.session())
app.use(express.json());
app.use(cookieParser());


mongoose.connect(URI);

mongoose.connection.once('open', () => {
  console.log('data base connestion is done');
 
})


const generateToken = async (adminEmail, savedData) => {
    // console.log(`generate token : ${savedData}`)
    try {
      const assignedToken = JWT.sign({ adminEmail }, process.env.SECRET_KEY);
      savedData.tokens = await savedData.tokens.concat({ token: assignedToken });
      await savedData.save();
  
      // console.log(`generate token : ${token}`)
  
      return assignedToken;
    } catch (err) {
      console.log(err);
    }
  };



app.get('/', (req, res) => {
    console.log('hi from the server');
    res.json('hi from server');
  });


  app.post('/fetchfollowtaskresponse',async (req,res)=>{
    const {loggedUserData} = req.body;

    const followTaskresponse = await followtasks.findOne({
      loggedUserData : loggedUserData
    });

    console.log('followTaskresponse')
    console.log(followTaskresponse)

    console.log('loggeduserdata')
    console.log(loggedUserData)

    res.json(followTaskresponse)

   
  })

  app.post('/fetchretweetTaskresponse',async (req,res)=>{
    const {loggedUserData} = req.body;

    const retweetTaskresponse = await retweettasks.findOne({
      loggedUserData: loggedUserData,
    });

   console.log('fetchretweetTaskresponse')
   console.log(retweetTaskresponse)

    res.json(retweetTaskresponse)

   
  })


  app.post('/fetchwalletAddressresponse',async (req,res)=>{
    const {loggedUserData} = req.body;

    const walletAddressresponse = await walletaddresstasks.findOne({
      loggedUserData: loggedUserData,
    });


   

    

    res.json(walletAddressresponse)

   
  })


  app.post('/fetchtweettaskresponse',async (req,res)=>{
    const {loggedUserData} = req.body;

    const tweetTaskresponse = await tweettasks.findOne({
      loggedUserData: loggedUserData,
    });


   

    

    res.json(tweetTaskresponse)

   
  })

  app.post('/fetchtelegramtaskresponse',async (req,res)=>{
    const {loggedUserData} = req.body;

    const telegramTaskresponse = await telegramtasks.findOne({
      loggedUserData: loggedUserData,
    });
 

    res.json(telegramTaskresponse)

   
  })





app.post('/checktweet',(req,res)=>{
  const {tweetId} = req.body;
  const config = {
    method: 'get',
    url: 'https://api.twitter.com/2/tweets/' + tweetId ,
    headers: {
      Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAAKRDhQEAAAAA9oKKdd9st2Veb53S%2BybkGn2z%2BZ8%3DXnCvsEJ1ekX0BZeCYuWjbqOtsAqircfWCMB7KsjtEMZaxRDaN1',
      Cookie: 'guest_id=v1%3A166391365524337597'
      }
  };
  
  axios(config)
  .then(function (response) {
    // console.log(JSON.stringify(response.data));
    // console.log(response.data)
    const data = response.data
    if(data?.data?.id === '1577183218402742272'){
      res.send(true)
    }else{
      res.send(false)
    }


    
    // console.log(JSON.stringify(data))
    

    
  })
  .catch(function (error) {
    console.log('error')
    console.log(error);
  });
  
})


app.post('/savetweettaskstatus',async (req,res)=>{
 
  console.log('savetweettask')
  console.log(req.body)

  try {
    const tweettask = new tweettasks({
      loggedUserData : req.body.loggedUserData,
      tweet : req.body.tweet,
    });
    const savedData = await tweettask.save();
    res.send(savedData);

}catch (err) {
  console.log(err);

}


})

app.post('/checkretweeted',(req,res)=>{

//  console.log('check retweeted')
 

 const {checkRetweet} = req.body
 

 const config = {
  method: 'get',
  url: 'https://api.twitter.com/2/tweets/' + checkRetweet + '/retweeted_by',
  headers: { 
    'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAKRDhQEAAAAA9oKKdd9st2Veb53S%2BybkGn2z%2BZ8%3DXnCvsEJ1ekX0BZeCYuWjbqOtsAqircfWCMB7KsjtEMZaxRDaN1', 
    'Cookie': 'guest_id=v1%3A166428734430673756'
  }
};

axios(config)
.then(function (response) {
  // console.log(JSON.stringify(response.data));
  // console.log(response.data)
  res.send(response.data)
})
.catch(function (error) {
  console.log(error);
});

})






app.post('/checkfollower',async (req,res)=>{

  const {checkFollower} = req.body;

  // console.log('check follower api request')
  // console.log(checkFollower)
    

const config = {
  method: 'get',
  url: 'https://api.twitter.com/1.1/friendships/show.json?source_screen_name=zepcoinofficial&target_screen_name=' + checkFollower,
  headers: {
    Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAAKRDhQEAAAAA9oKKdd9st2Veb53S%2BybkGn2z%2BZ8%3DXnCvsEJ1ekX0BZeCYuWjbqOtsAqircfWCMB7KsjtEMZaxRDaN1',
    Cookie: 'guest_id=v1%3A166391365524337597'
    }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  // console.log(response.data)

  // res.send(JSON.stringify(response.data))
  // res.send({data : JSON.stringify(response.data) , success : 1})
  res.json({ success : 1})
})
.catch(function (error) {
  console.log('error of check follower api')
  console.log(error);
  res.json({success : 0})
});


  })



  

  app.get('/adminloginorlogout', async (req, res) => {
    try {
      const getedToken = req.cookies.jwtToken;
      const verifiedToken = JWT.verify(getedToken, process.env.SECRET_KEY);
      // console.log('verifiedToken :');
      // console.log(verifiedToken);
      // console.log('getedToken')
      // console.log(getedToken)
      res.status(200).send(verifiedToken.adminEmail);
    } catch (err) {
      console.log(err);
    }
  });
  


app.post('/savetelegramtaskstatus',async (req,res)=>{

  const {joinTelegram,loggedUserData} = req.body;
 

  try {
    const telegram = new telegramtasks({
      loggedUserData : loggedUserData,
      joinTelegram: joinTelegram,
    });
    const savedData = await telegram.save();
    res.send(savedData);

}catch (err) {
  console.log(err);

}

 
})


app.post('/savefollowtaskstatus', async(req,res)=>{

  const {twitterFollow,loggedUserData} = req.body;

  try {
    const follow = new followtasks({
      loggedUserData : loggedUserData,
      twitterFollow: twitterFollow,
    });
    const savedData = await follow.save();
    res.send(savedData);

}catch (err) {
  console.log(err);

}

})

app.post('/savewallettaskstatus', async(req,res)=>{

  const {walletAddress,loggedUserData} = req.body;

  try {
    const walletaddress = new walletaddresstasks({
      loggedUserData : loggedUserData,
      walletAddress: walletAddress,
    });
    const savedData = await walletaddress.save();
    res.send(savedData);

}catch (err) {
  console.log(err);

}

})


app.post('/saveretweettaskstatus', async(req,res)=>{

  const {retweet,loggedUserData} = req.body;

  console.log(retweet,loggedUserData);

  try {
    const retwee = new retweettasks({
      loggedUserData : loggedUserData,
      retweet: retweet,
    });
    const savedData = await retwee.save();
    res.send(savedData);

}catch (err) {
  console.log(err);

}

})






  app.post('/createuser', async (req, res) => {
    const data = req.body;
    const adminEmail = data.adminEmail;
    const password = data.password;
  
    
  
    // console.log(data);
  
    if (!adminEmail || !password) {
      return res.status(202).json({ message: 'please enter full credentials' });
    }
  
    if(validator.isEmail(adminEmail)){
  
    
  
    const userPresentORnotPresent = await userdatas.findOne({
      adminEmail: adminEmail,
    });
    
    if (userPresentORnotPresent) {
      return res.status(204).send('email is already registered');
    }
  
    try {
      const userData = new userdatas({
        adminEmail: adminEmail,
        password: password,
      });
      const savedData = await userData.save();
  
      const generatedToken = await generateToken(adminEmail, savedData);
      if (generatedToken) {
        res.cookie('jwtToken', generatedToken, {
          expires: new Date(Date.now() + 12222222),
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        // res.status(200).json({message:"registered successfully"})
        // console.log(savedData);
        res.status(200).send(savedData);
      }
    } catch (err) {
      console.log(err);
    }
  
  }else{
    return res.status(208).json({ message: 'email is not valid please type valid email' });
  }
  });

  app.post('/login', async (req, res) => {

    try{
  
    
  
    const data = req.body;
    const adminEmail = data.adminEmail;
    const password = data.password;
    // console.log('password');
    // console.log(password);
  
    if (!adminEmail || !password) {
      return res.status(202).json({ message: 'please enter full credentials' });
      // return res.status(400).json({ message: 'please enter full credentials' });
    }
  
    if(validator.isEmail(adminEmail)){
    
    try {
      const userPresentORnotPresent = await userdatas.findOne({
        adminEmail: adminEmail,
        // password: password,
      });
  
      // console.log('userpresetornotpresent');
      // console.log(userPresentORnotPresent);
  
      if (userPresentORnotPresent) {
  
        const passwordIsMatchOrNot = await bcrypt.compare(password , userPresentORnotPresent.password)
        // console.log('passwordismatchornot');
        // console.log(passwordIsMatchOrNot)
  
        if(passwordIsMatchOrNot){
  
        
        const generatedToken = await generateToken(
          adminEmail,
          userPresentORnotPresent
        );
        if (generatedToken) {
          res.cookie('jwtToken', generatedToken, {
            expires: new Date(Date.now() + 12222222),
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          });
          // res.status(200).json({message:"registered successfully"})
        }
        res.status(200).send(userPresentORnotPresent);
        // return  res.status(200).json({userData : userPresentORnotPresent,message : "user logged in  successfully"})
      }else{
        return res.status(210).json({ message: 'password is invalid' });
      }
      } else {
        return res.status(204).json({
          message: 'email is not registered please create your account',
        });
      }
    } catch (err) {
      console.log(err);
    }
  }else{
    return res.status(208).json({ message: 'email is not valid please type valid email' });
  }
  
  
    }catch(err){
      console.log(err)
    }
  
  
  });


  app.get('/logout', (req, res) => {
    res.clearCookie('jwtToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  
    res.status(200).send('user sign out succesfully');
  });



app.listen(8000, () => {
    console.log('server is run on port 8000');
})