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
const tasks = require('./tasksModel');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const JWT = require('jsonwebtoken');


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

app.post('/gettasksdata',async(req,res)=>{

  const loggedUserData = req.body.data

  console.log('req.body for get tasks')
  console.log(req.body)

 
  
  const userPresentORnotPresent = await tasks.findOne({
    loggedUserData: loggedUserData,
  });

  console.log('userpresentornot')
  console.log(userPresentORnotPresent)

  if (userPresentORnotPresent) {
    return res.status(200).send(userPresentORnotPresent);
  }

  })

  app.get('/adminloginorlogout', async (req, res) => {
    try {
      const getedToken = req.cookies.jwtToken;
      const verifiedToken = JWT.verify(getedToken, process.env.SECRET_KEY);
      console.log('verifiedToken :');
      console.log(verifiedToken);
      // console.log('getedToken')
      // console.log(getedToken)
      res.status(200).send(verifiedToken.adminEmail);
    } catch (err) {
      console.log(err);
    }
  });
  


app.post('/savetasks',async(req,res) => {
  const {twitterFollow,joinTelegram,retweet,tweet,walletAddress,loggedUserData} = req.body;

  console.log(req.body)
 

  if(twitterFollow && joinTelegram && retweet && tweet && walletAddress && loggedUserData){
    console.log('inside the savetasks block')
    console.log(twitterFollow,joinTelegram,retweet,tweet,walletAddress)

    try {
      const tasksData = new tasks({
        loggedUserData : loggedUserData,
        twitterFollow: twitterFollow,
        joinTelegram: joinTelegram,
        retweet: retweet,
        tweet: tweet,
        walletAddress: walletAddress,
      });
      const savedData = await tasksData.save();
      res.send(savedData);

  }catch (err) {
    console.log(err);
  }

  
}})

  app.post('/createuser', async (req, res) => {
    const data = req.body;
    const adminEmail = data.adminEmail;
    const password = data.password;
  
    
  
    console.log(data);
  
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
        console.log(savedData);
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
    console.log('password');
    console.log(password);
  
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
        console.log('passwordismatchornot');
        console.log(passwordIsMatchOrNot)
  
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
    console.log('server is run on port 8080');
})