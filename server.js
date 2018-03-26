// Firstly where are the package.json file? you forgot "npm init" command
// and you didn't download the packages, "npm install express && Npm install mysql"

// comment thanks you 
const express = require('express'); 
const mysql = require('mysql');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


var app = express(); 
app.use(bodyParser.json()); // support jkoson encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var db = mysql.createConnection({ 
  host: "localhost",
  user: "root",
  password: "",
  database: "icms"
});


db.connect(function (error) {
  if (error) throw error;
  
  console.log('connected');
});




// Where is the API ( webserice ) that should be called ? ( www.example.com/api/register )
 
app.post('/Psignup', function (req, res) {

	   
//  SURE WE CAN ADD MORE :) IT'S JUST EXAMPLE
// NOW we need to insert into the DB the email& user-name & Password
// let's take them into variables first

var name = req.body['name'];
var username = req.body['username'];
var password = req.body['password'];
var bloodtybe = req.body['bloodtybe'];
var adress = req.body['adress'];
var phonenumber = req.body['phonenumber'];
var password = req.body['password'];
var temDES = req.body['temDES'];
var dateofbirth =req.body['dateofbirth']


// Okay let's check if we got them right!
//console.log("I got this request : " + email + " " + username + " " + password) // check them on the console you are running.
//Now let's insert them into the DB!

var sql="INSERT INTO `Patient` (  `UserName`, `Password`,`address`,`Name`,`phone number`,`Blood type`,`temDES`) VALUES ('"+username+ "' , '"+password+"', '"+adress+"', '"+name+"', '"+phonenumber+"', '"+bloodtybe+"', '"+temDES+"')"; //, '"+password+"'

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
})
// okay let's send back to the front-end , he is waiting for us to tell him if we could do it! :)

res.send("I DID IT ! :)");
})
 
 
app.post('/Drsignin', function (req, res) {


var username = req.body['username'];
var password = req.body['password'];
  console.log(username +"<<-----")
    console.log(password +"<<-----")
var sql= "SELECT Doc_ID FROM Doctors WHERE Username = '"+ username +"' and password = '"+password+"';"

//var sql = "SELECT Doc_ID FROM Doctors WHERE Username ='ALY' and password = '123';"
var RowNumber;

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
  RowNumber = JSON.stringify(result.length) ;
  if (RowNumber == 0)
{
res.send("Wrong Username & password");
}
else{
res.send("True")
}

  
  });

});

app.post('/signin', function (req, res) {
  

var username = req.body['username'];
var password = req.body['password'];

var sql= "SELECT * FROM users WHERE Username = '"+ username +"' and password = '"+password+"';"

var RowNumber;

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
  RowNumber = JSON.stringify(result.length) ;
  console.log(JSON.stringify(result[0].RoleID));

  var token = jwt.sign({ id: result[0].RoleID }, "thisistopsecret", {
    expiresIn: 86400 // expires in 24 hours
  });

  //var token = jwt.sign({ id: username }, { password: password })
  console.log(token);
  if (RowNumber == 0)
{
  var responemsg = {
    data:"Wrong Username & password",
    Success:false,
    error:"R1"
  }
res.send(responemsg);
}
else{
  var responemsg = {
    data:{access_token:token},
    Success:true,
    error:null
  }
  res.send(responemsg)
}
  });

});


//####################
app.get('/Patient/GetProfile', function (req, res) {

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    // we have the ID OF user in decoded.id variable
    var sql="SELECT * FROM patient where patient_ID = "+decoded.id+";"

    db.query(sql,function(err,result){
      if (err){     
          throw err;
      }
       console.log('Data added ! created.!');
       res.send(result)
      })

    
  })
});

app.post('/Manger/AddEmp',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
  var name = req.body['empName'];
  var job = req.body['empJob'];
  var salary = req.body['empSalary'];


var sql ="INSERT INTO `emp`( `emp_Name`, `emp_job`, `emp_salary`) VALUES ('"+name+ "','"+job+ "','"+salary+ "')"
db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   res.send(result)
  })
})
})



//################ NOT USED NOW
app.post('/Pinfo', function (req, res) {

  var temDES = req.body['temDES'];
  var sql="INSERT INTO `Patient` (  `temDES` ) VALUES ('"+temDES+ "');"

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
})
// okay let's send back to the front-end , he is waiting for us to tell him if we could do it! :)

res.send("I DID IT ! :)");
});




app.post('/Esignin', function (req, res) {


var username = req.body['username'];
var password = req.body['password'];

var sql= "SELECT emp_ID FROM Patient WHERE Username = '"+ username +"' and password = '"+password+"';"

//var sql = "SELECT Doc_ID FROM Doctors WHERE Username ='ALY' and password = '123';"
var RowNumber;

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
  RowNumber = JSON.stringify(result.length) ;
  if (RowNumber == 0)
{
res.send("Wrong Username & password");
}
else{
res.send("True")
}

  
  });

});



// you forgot the server host,ports .. how can you run the server ? Front-end and Back-end are independent.

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
