const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const app = express();
const passportSetup = require('./passport')
const cors = require('cors');


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


app.get("/auth/login/success", (req, res) => {
  
	if (req.user) {

		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});



  
  

//     if (req.user) {
//       const data = req.user;
//       console.log('req.user email')
//       console.log(data[4])

//       for(let key in data) { 
//       var emails =  data['emails'];
//       // console.log(emails[0].value) 
//       }
//       console.log(emails[0].value) 

//       const googleUserPresentOrNot = await googleUsers.findOne({
//         email: emails[0].value,
//         // password: password,
//       });

//       console.log('googleuserpresentornot')
//       console.log(googleUserPresentOrNot)

//       if(googleUserPresentOrNot){
//         return;
//       }else{

//         const google = new googleUsers({
//           email : emails[0].value
//         });
//         const googleMail = await google.save();
//       }

     

//       res.status(200).json({
//         error: false,
//         message: "Successfully Loged In",
//         user: req.user,
//       });
//     } else {
//       res.status(403).json({ error: true, message: "Not Authorized" });
//     }
  
// });

app.post('/googlelogins',async (req,res)=>{
  console.log('req.body')
  console.log(req.body)
  try{

    const googleUserPresentOrNot = await googleUsers.findOne({
              email: req.body.email,
              
            });
      
            console.log('googleuserpresentornot')
            console.log(googleUserPresentOrNot)
      
            if(googleUserPresentOrNot){
              return;
            }else{
      
              const google = new googleUsers({
                email : req.body.email,
              });
              const googleMail = await google.save();
            }
  
            res.status(200).send('google login emails is saved in database');
  }catch(err){
    console.log(err);
  }

})

app.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

app.get("/google", passport.authenticate("google", ["profile", "email"]));

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: 'http://localhost:3000/',
		failureRedirect: "/login/failed",
	})
);

app.get("/auth/logout", (req, res) => {
	req.logout();
  res.status(200).redirect('http://localhost:3000/');
});



app.listen(8080, () => {
    console.log('server is run on port 8080');
  });