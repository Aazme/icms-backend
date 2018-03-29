 
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

// Role checking function



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
 
 

app.post('/signin', function (req, res) {
  

var username = req.body['username'];
var password = req.body['password'];

var sql= "SELECT * FROM users WHERE Username = '"+ username +"' and password = '"+password+"';"
console.log(username)
var RowNumber;

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
  RowNumber = JSON.stringify(result.length) ;
 


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
  var token = jwt.sign({ userid: result[0].User_ID}, "thisistopsecret", {
    expiresIn: 86400 // expires in 24 hours
  });
  console.log(token);

  var responemsg = {
    data:{access_token:token,Roleid:result[0].RoleID},
    Success:true,
    error:null

  }
  res.send(responemsg)
}
  });

});

function CheckingRole (userid,roleid){
  // check User Role
   
  var sql = "SELECT RoleID FROM users where User_ID=" + userid+";";
  
  db.query(sql,function(err,result){
    if (err){     
      
        throw err;
    }
   result =  JSON.stringify(result[0].RoleID)

    console.log("result is " + result)
if (result == roleid){  return true; }
else { return false;}
  });
}
//####################
app.get('/Patient/GetProfile', function (req, res) {
  var Role=3;
  
    // we have the ID OF user in decoded.id variable
    var sql="SELECT * FROM patient where user_ID = "+decoded.userid+";"

    db.query(sql,function(err,result){
      if (err){     
          throw err;
      }
       console.log('Data retrieved !' + result[0]);
       res.send(result[0])
      })

    
  })

//##########################################################################################3

app.post('/Manger/AddEmp',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
  var name = req.body['empName'];
  var job = req.body['empJob'];
  var salary = req.body['empSalary'];
  var EmpAddress = req.body['empaddress']
  var EmpPhoneNumber = req.body['empnumber']
  var emp_ID = req.body['emp_ID'];

var sql ="INSERT INTO `emp`( `emp_ID`,`emp_Name`, `emp_job`, `emp_salary`,`EmpAddress`,`EmpPhoneNumber`) VALUES ('"+emp_ID+ "','"+name+ "','"+job+ "','"+salary+ "','"+EmpAddress+ "''"+EmpPhoneNumber+ "')"
db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   res.send(result)
  })
})
})

app.post('/Manger/DeleteEmp',function(req , res){

  var token = req.headers['authorization']; // 23rf mnen an el token da vailed 
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
  var name = req.body['empName'];

var sql ="DELETE FROM `emp` WHERE `emp_Name` = '"+name+ "'" ;
db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   res.send(result)
  })
})
})

app.post('/Manger/UpdateEmp',function(req , res){

  var token = req.headers['authorization']; 
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
    var name = req.body['empName'];
    var job = req.body['empJob'];
    var salary = req.body['empSalary'];
    var EmpAddress = req.body['empaddress']
    var EmpPhoneNumber = req.body['empnumber']
    var emp_ID = req.body['emp_ID']

var sql = "UPDATE `emp` SET `emp_Name`='"+name+ "',`emp_job`='"+job+ "',`emp_salary`='"+salary+ "',`EmpAddress`='"+EmpAddress+ "',`EmpPhoneNumber`='"+EmpPhoneNumber+ "' WHERE `emp_ID`='"+emp_ID+ "'"
db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   res.send(result)
  })
})
})


//##################################################################################333

app.post('/Manger/AddClinic',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
  var Clinic_ID = req.body['C_ID'];
  var ClinicName = req.body['C_Name'];
  var Clinic_ava = req.body['C_ava'];

var sql ="INSERT INTO `clinics`(`clinic_ID`, `Name`, `avalibality`) VALUES ('"+ClinicName+ "','"+Clinic_ID+ "','"+Clinic_ava+ "')"
db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('clinic added ! ');
   res.send(result)
  })
})
})

app.post('/Manger/DeleteClinic',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
  var ClinicName = req.body['C_Name'];
  
var sql ="DELETE FROM `clinics` WHERE `Name` = '"+ClinicName+ "'";

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('clinic added ! ');
   res.send(result)
  })
})
})



app.post('/Manger/UpdateClinic',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    var Clinic_ID = req.body['C_ID'];
    var ClinicName = req.body['C_Name'];
    var Clinic_ava = req.body['C_ava'];

var sql ="UPDATE `clinics` SET `Name`='"+ClinicName+ "',`avalibality`='"+Clinic_ava+ "' WHERE `clinic_ID`='"+Clinic_ID+ "'"


db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('clinic added ! ');
   res.send(result)
  })
})
})
//###########################################################################################################

app.post('/Manger/AddDoctor',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  /// ######### EL USER ID !!! ##########
  var DOC_ID = req.body['DocID'];
  var Name = req.body['name'];
  var PhoneNumber = req.body['phoneNum'];
  var specialized = req.body['specialized']
  var price = req.body['price']
  

var sql ="INSERT INTO `doctors`(`Doc_ID`, `Name`, `PhoneNumber`, `specialized`, `price`, `User_ID`) VALUES ('"+DOC_ID+ "','"+Name+ "','"+PhoneNumber+ "','"+specialized+ "','"+EmpAddress+ "''"+price+ "')"
db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   res.send(result)
  })
})
})

app.post('/Manger/DeleteDoctor',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
  var DOC_ID = req.body['DocID'];
  var Name = req.body['name'];
  var PhoneNumber = req.body['phoneNum'];
  var specialized = req.body['specialized']
  var price = req.body['price']
  

var sql ="DELETE FROM `doctors` WHERE `Name` = '"+Name+ "'";
db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   res.send(result)
  })
})
})


app.post('/Manger/UpdateDoctor',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
  var DOC_ID = req.body['DocID'];
  var Name = req.body['name'];
  var PhoneNumber = req.body['phoneNum'];
  var specialized = req.body['specialized']
  var price = req.body['price']
  

var sql ="DELETE FROM `doctors` WHERE `Name` = '"+Name+ "'";
"UPDATE `doctors` SET `Name`='"+Name+ "',`PhoneNumber`='"+PhoneNumber+ "',`specialized`='"+specialized+ "', `price`='"+price+ "'WHERE `Doc_ID`='"+Doc_ID+ "'";

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






// you forgot the server host,ports .. how can you run the server ? Front-end and Back-end are independent.

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
