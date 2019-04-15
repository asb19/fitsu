var express=require('express');
var bodyparser=require('body-parser');
var swig=require('swig');
var path=require('path');
var nodemailer=require('nodemailer');
// import mongooose
var mongoose=require('mongoose');
require('./models/enquiry');
var Enquiry=mongoose.model('fitdb');
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
var app=express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.engine('html',swig.renderFile);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','html');
app.use('/public',express.static('public'));
// mongoose connection
var db=mongoose.connection;
mongoose.connect('mongodb://127.0.0.1:27017/db_name');
db.on('error',
	console.error.bind(console,'connection error:')
);
db.once('open',function(){
	console.log('connected to mongodb');
});
app.get('/',function(req,res){
	res.render('index1');
});
 app.get('/contact',function(req,res){
 	res.render('contact');
 });
 app.get('/news',function(req,res){
  res.render('news');
});
app.get('/about',function(req,res){
  res.render('about');
});
app.get('/member',function(req,res){
  res.render('member');
});
app.get('/services',function(req,res){
  res.render('services');
});


// for mongo db******
 app.post('/enq',function(req,res){
 	new  Enquiry({
 		name:req.body.name,
 		email:req.body.email,
 		phone:req.body.phone,
 		message:req.body.message
 	})
 	.save(function(err,Enquiry){
 		console.log('message saved in fitdb');
     res.render('contact',{msg:"Email has been sent successfully"});
   });
   
   const output = `
   <p>You have a  New Enquiry</p>
   <h3>Enquiry Details</h3>
   <ul>  
     <li>name: ${req.body.name}</li>
     <li>Email: ${req.body.email}</li>
     <li>Phone: ${req.body.phone}</li>
     
    
     
   </ul>
   <h3>Message</h3>
   <p>${req.body.message}</p>
 `;
  

 // create reusable transporter object using the default SMTP transport
 let transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true, // true for 465, false for other ports
   auth: {
       user: 'your gmail', // generated ethereal user
       pass: 'your password'  // generated ethereal password
   },
   tls:{
     rejectUnauthorized:false
   }
 });


 // setup email data with unicode symbols
 let mailOptions = {
     from: 'your gmail', // sender address
     to: 'receiver email', // list of receivers
     subject: 'New Enquiry', // Subject line
     text: 'From me', // plain text body
     html: output // html body
 };

 // send mail with defined transport object
 transporter.sendMail(mailOptions, (error, info) => {
     if (error) {
         return console.log(error);
     }
     console.log('Message sent: %s', info.messageId);   
     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
     res.render('contact',{msg:"Email has been sent successfully"});
     // res.send(`<body style="background-color:gray;"><div style="position:absolute; width : 100%;  height:5rem; text-align:center; font-size:2rem;top:50%;transform:translateY(-50%);">We Saved Your Enquiry. We will get in touch with you soon </div></body>`); 
 });

 });


//  app.post('/enq', (req, res) => {
//   const output = `
//     <p>You have a  New Enquiry</p>
//     <h3>Enquiry Details</h3>
//     <ul>  
//       <li>name: ${req.body.name}</li>
//       <li>Email: ${req.body.email}</li>
//       <li>Phone: ${req.body.phone}</li>
      
     
      
//     </ul>
//     <h3>Message</h3>
//     <p>${req.body.message}</p>
//   `;

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//         user: '', // generated ethereal user
//         pass: ''  // generated ethereal password
//     },
//     tls:{
//       rejectUnauthorized:false
//     }
//   });


//   // setup email data with unicode symbols
//   let mailOptions = {
//       from: 'amirsohel171998@gmail.com', // sender address
//       to: 'amirsohel.as10@gmail.com', // list of receivers
//       subject: 'New Enquiry', // Subject line
//       text: 'From me', // plain text body
//       html: output // html body
//   };

//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           return console.log(error);
//       }
//       console.log('Message sent: %s', info.messageId);   
//       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//       res.render('contact',{msg:"Email has been sent successfully"});
//       // res.send(`<body style="background-color:gray;"><div style="position:absolute; width : 100%;  height:5rem; text-align:center; font-size:2rem;top:50%;transform:translateY(-50%);">We Saved Your Enquiry. We will get in touch with you soon </div></body>`); 
//   });
// });
var port=4000;
app.listen(port,function(){
  console.log("server running at port "+port);
});
