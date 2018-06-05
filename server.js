 
// Firstly where are the package.json file? you forgot "npm init" command
// and you didn't download the packages, "npm install express && Npm install mysql"

// comment thanks you 
const express = require('express'); 
const mysql = require('mysql');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


var app = express(); 
app.use(bodyParser.json()); // support joson encoded bodies
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

//##########################################################################################################################

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
  var token = jwt.sign({ userid: result[0].User_ID , password: result[0].password }, "thisistopsecret", {
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
//################################################################################
app.get('/Patient/GetProfile', function (req, res) {
 var Role=3;
 var token = req.headers['authorization'];
 console.log(token)
 if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
 
 jwt.verify(token, "thisistopsecret", function(err, decoded) {
   if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // we have the ID OF user in decoded.id variable
   var sql="SELECT * FROM patient where user_ID = "+decoded.userid+";"

  db.query(sql,function(err,result){
     if (err){     
        throw err;
     }
      console.log('Data retrieved !' + result[0]);

      var Response = {
        Data:result[0],
        Success:true,
        errors:null
      }
      res.send(Response)
      
     })

    
    })});


    app.post('/user/resetpassword', function (req, res) {
      var Role=3;
      var token = req.headers['authorization'];
      console.log(token)
      if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
      
      jwt.verify(token, "thisistopsecret", function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
     
         var oldpassword = req.body['oldpassword']
         var newpassword = req.body['newpassword']
         var oldpasswordquery = " SELECT `password` FROM `users` WHERE user_ID = "+decoded.userid+"";
      //   var dboldpassword = ""

         // execute oldpassword query, in order to retrieve the user's current password
         db.query(oldpasswordquery,function(err,result){
          if (err){     
             throw err;
          }
          console.log(result[0].password);
        var dboldpassword = result[0].password;
        
        console.log("---");
        console.log(dboldpassword);
        console.log("---");
         if (oldpassword==dboldpassword){ // check el if condition de 
         var sql = "UPDATE `users` SET `password`='"+newpassword+"' where user_ID = "+decoded.userid+""
         
     
       db.query(sql,function(err,result){
          if (err){     
             throw err;
          }
           console.log('Data retrieved !' + result[0]);
     
           var Response = {
             Data:result[0],
             Success:true,
             errors:null
           }
           res.send(Response)
          
          })}
          else {
          var Response = {
            Data:null,
            Success:false,
            errors:"wrong old password"
          }
          res.send(Response)}
         
         
         })
        })
        });


        
//##############################################################################################
app.post('/Patient/EditProfile', function (req, res) {
  var Role=3;
  
  var token = req.headers['authorization'];
  console.log(token)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    var Name =  req.body['name'];
    var address = req.body['address'];
    var dateOfBirth =req.body['dateOfBirth'];
    var phoneNumber =req.body['phoneNumber'];
    var BloodType=req.body['BloodType'];
    var temDES = req.body['temDES'];
    var patient_ID= req.body['patient_ID']
     // we have the ID OF user in decoded.id variable
    var sql=" UPDATE `patient` SET `Name`='"+Name+ "',`address`='"+address+ "',`date Of  Birth`='"+dateOfBirth+ "',`phone number`='"+phoneNumber+ "',`Blood type`='"+BloodType+ "',`temDES`='"+temDES+ "' where user_ID = "+decoded.userid+";"
  
    
   db.query(sql,function(err,result){
      if (err){     
         throw err;
      }
       console.log('Data editied !' + result[0]);
 
       var Response = {
         Data:result[0],
         Success:true,
         errors:null
       }
       res.send(Response)
       
      })
 
     
     })});












//##########################################################################################3

app.get('/Doctor/GetProfile', function (req, res) {
  var Role=3;
  var token = req.headers['authorization'];
  console.log(token)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
     // we have the ID OF user in decoded.id variable
    var sql="SELECT * FROM Doctors where user_ID = "+decoded.userid+";"
 
   db.query(sql,function(err,result){
      if (err){     
         throw err;
      }
       console.log('Data retrieved !' + result[0]);
 
       var Response = {
         Data:result[0],
         Success:true,
         errors:null
       }
       res.send(Response)
       
      })
 
     
     })});
 //##########################################################################################

 app.get('/Doctor/GetAllPatient', function (req, res) {
  var Role=3;
  var token = req.headers['authorization'];
  console.log(token)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      var DRNAME = req.body['DRNAME'];
     // we have the ID OF user in decoded.id variable
     // and transaction cancel = 0 




     //
     //
     //
     //
     //
     
    var sql="SELECT * FROM `transactions` WHERE  Doc_ID = "+DRNAME+" AND cancelled="+0+" AND Completed ="+0+"";// check this condtion of the Zero
 
   db.query(sql,function(err,result){
      if (err){     
         throw err;
      }
       console.log('Data retrieved !' + result[0]);
 
       var Response = {
         Data:result[0],
         Success:true,
         errors:null
       }
       res.send(Response)
       
      })
 
     
     })});

     //###############################################################################################################################
  app.post('/Doctor/ActiveClinic', function (req, res) {
    var Role=3;
    
    var token = req.headers['authorization'];
    console.log(token)
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, "thisistopsecret", function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      var Clname = req.body['Clname']
''
      var sql="UPDATE `clinics` SET avalibality = "+1+" WHERE Name='"+Clname+"'";
   db.query(sql,function(err,result){
    if (err){     
       throw err;
    }
     console.log('Data editied !' + result[0]);

     var Response = {
       Data:result[0],
       Success:true,
       errors:null
     }
     res.send(Response)
     
    })

   
   })});

   app.post('/Doctor/DeActiveClinic', function (req, res) {
    var Role=3;
    
    var token = req.headers['authorization'];
    console.log(token)
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, "thisistopsecret", function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      var Clname = req.body['Clname']

      var sql="UPDATE `clinics` SET avalibality ="+0+" WHERE  Name='"+Clname+"'";
   db.query(sql,function(err,result){
    if (err){     
       throw err;
    }
     console.log('Data editied !' + result[0]);

     var Response = {
       Data:result[0],
       Success:true,
       errors:null
     }
     res.send(Response)
     
    })

   
   })});



 //##########################################################################################
 app.get('/Patient/history', function (req, res) {
  var Role=3;
  var token = req.headers['authorization'];
  console.log(token)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
     // we have the ID OF user in decoded.id variable
     var patient_ID = req.body['patientID'];
    var sql="SELECT * FROM `transactions` WHERE  user_ID = "+decoded.patient_ID+";"
 
   db.query(sql,function(err,result){
      if (err){     
         throw err;
      }
       console.log('Data retrieved !' + result[0]);
 
       var Response = {
         Data:result[0],
         Success:true,
         errors:null
       }
       res.send(Response)
       
      })
 
     
     })});
 //##########################################################################################3

 app.get('/Employee/GetProfile', function (req, res) {
  var Role=3;
  var token = req.headers['authorization'];
  console.log(token)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
     // we have the ID OF user in decoded.id variable
    var sql="SELECT * FROM emp where user_ID = "+decoded.userid+";"
 
   db.query(sql,function(err,result){
      if (err){     
         throw err;
      }
       console.log('Data retrieved !' + result[0]);
 
       var Response = {
         Data:result[0],
         Success:true,
         errors:null
       }
       res.send(Response)
       
      })
 
     
     })});
 //##########################################################################################

 app.get('/Employee/confirmPayment', function (req, res) {
  var Role=3;
  var token = req.headers['authorization'];
  console.log(token)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
    var patient_ID= req.body['patient_ID']
     // we have the ID OF user in decoded.id variable
    var sql="UPDATE `transactions` SET Paid="+1+" where patient_ID = "+patient_ID+";"
 
   db.query(sql,function(err,result){
      if (err){     
         throw err;
      }
       console.log('Data updated !' + result[0]);
 
       var Response = {
         Data:result[0],
         Success:true,
         errors:null
       }
       res.send(Response)
       
      })
 
     
     })});





//###############################################################################################


app.post('/Doctor/Addprescription',function(req , res){
  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
  var perscription_ID = req.body['perscription_ID'];
  var Medicence = req.body['Medicence'];
  var Description = req.body['Description'];
  var Diagnosis = req.body['Diagnosis'];
  var seql = " UPDATE `prescription` SET Diagnosis= '"+Diagnosis+"' "
  db.query(seql,function(err,result){
   
    if (err){     
        throw err;
    }
     console.log('diagonosis added ! created.!');
    // res.send(result)
    })

  var sql = " INSERT INTO `perdescription`(`perscription_ID`, `Medicence`, `Description`) VALUES ('"+perscription_ID+"','"+Medicence+"','"+Description+"') ";
  
  
   db.query(sql,function(err,result){
    if (err){     
        throw err;
    }
     console.log('Data added ! created.!');
     var responemsg = {
       data:null,
       Success:true,
       errors:null
     }
     res.send(responemsg)
  })
})
});
  
  
  //#########################################################################################

  //delete token ??
  /*app.get('/test', function (req, res) {
    var body = "some body";
    res.removeHeader('Transfer-Encoding');
    res.removeHeader('X-Powered-By');
    res.end(body);
});*/
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

var sql ="INSERT INTO `emp`( `emp_ID`,`emp_Name`, `emp_job`, `emp_salary`,`EmpAddress`,`EmpPhoneNumber`) VALUES ('"+emp_ID+ "','"+name+ "','"+job+ "','"+salary+ "','"+EmpAddress+ "''"+EmpPhoneNumber+ "')";
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

var sql ="INSERT INTO `clinics`(`clinic_ID`, `Name`, `avalibality`) VALUES ('"+Clinic_ID+ "','"+ClinicName+ "','"+Clinic_ava+ "')"
db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('clinic added ! ');
   var result = {
      data:"Clinic Added",
      Success:true,
      error: null
    
   }
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
   console.log('clinic deleted ! ');
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

var sql ="UPDATE `clinics` SET `Name`='"+ClinicName+ "',`avalibality`='"+Clinic_ava+ "' WHERE `clinic_ID`='"+Clinic_ID+ "'" ;


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
app.post('/Clinic/GetAll ',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    var sql ="SELECT * FROM `clinics` ";
    db.query(sql,function(err,result){
      if (err){     
          throw err;
      }
       console.log('Data founded ');
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

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   res.send(result)
  })
})
})
//#######################################################################################
app.post('/Emp/addreservation',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    var ClinicName = req.body['clinicID'];
    var DoctorName = req.body['DoctorName'];
    var emp_ID = req.body['emp_ID'];
    var AppointmentDate= req.body['AppointmentDate'];

    var sql="SELECT * FROM patient where user_ID = "+decoded.userid+";"

    db.query(sql,function(err,result){
       if (err){     
        throw err;
        var responemsg = {
          data:"wrong clinic name",
          Success:false,
          error:"R1"
        }
        res.send(responemsg)
        
    }
        console.log('Data retrieved !' + result[0]);
  var patientid = result[0].patient_ID;
       

    var s ="SELECT `clinic_ID` `avalibality` FROM `clinics` WHERE  `Name`='"+ClinicName+"'";

db.query(s,function(err,result){
  if (err){     
      throw err;
      var responemsg = {
        data:"wrong clinic name",
        Success:false,
        error:"R1"
      }
      res.send(responemsg)
      
  }
   console.log('Data selected from clinics ! created.!');
  if ( result[0].avalibality == 0  )

  {
    var responemsg = {
      data:"Clinic not available",
      Success:false,
      error:"R1"
    }
    res.send(responemsg)

  }
   var clinicId = result[0].clinic_Id; 
  

     var sqll = " SELECT `Doc_ID` FROM `doctors` WHERE `Name` = '"+DoctorName+"'";

     db.query(sqll,function(err,result){
      if (err){     
          throw err;
          var responemsg = {
            data:"wrong doctor name",
            Success:false,
            error:"R1"
          }
          res.send(responemsg)
      }
       console.log('Data founded ! created.!');
      var doctorID= result.doc_ID
      


      var sq = "SELECT  `emp_Name`,  FROM `emp` WHERE `emp_ID`='"+emp_ID+"'";

      db.query(sq,function(err,result){
       if (err){     
           throw err;
           var responemsg = {
             data:"wrong emp name",
             Success:false,
             error:"R1"
           }
           res.send(responemsg)
       }
        console.log('Data founded ! created.!');
       var emp_ID= result.emp_ID


      ///////////////////////////////////////////////////////////////////////////////////check da query
     var sqlll = " INSERT INTO `bill`(`TotalPrice`) VALUES ('0')";

     db.query(sqlll,function(err,result){
      if (err){     
          throw err;
          var responemsg = {
            data:"wrong  in bill insertion",
            Success:false,
            error:"R1"
          }
       
      }
       console.log('bill created! created.!');
      var bill =result[0].insertId; 
      
      /////////////////////////////////////////////////////////////////////////////////check da query
      var sqllll = " INSERT INTO `prescription`( `Diagnosis`) VALUES ()";

     db.query(sqllll,function(err,result){
      if (err){     
          throw err;
          var responemsg = {
            data:"wrong  in prescription insertion",
            Success:false,
            error:"R1"
          }
       
      }
       console.log('peresctription added ! created.!');
       var pre = result[0].insertId;
      

//
//
//
//

var sqlllll = "INSERT INTO `transactions`( `Doc_ID`, `clinic_ID`, `patient_ID`, `bill_ID`, `emp_ID`, `perscription_ID`, `AppointmentDate`, `Completed`, `Paid`) VALUES ('"+doctorID+"','"+clinicId+"','"+patientid+"','"+bill+"','"+emp_ID+"','"+pre+"','"+AppointmentDate+"',0,0)"


       db.query(sqlllll,function(err,result){
        if (err){     
            throw err;
            var responemsg = {
              data:"wrong  in prescription insertion",
              Success:false,
              error:"R1"
            }
         
        }
         console.log('peresctription added ! created.!');

        }) 

      }) 
})
})
})
})
})
  })
})

//#########################################################################################################
app.post('/Emp/editreservation',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    var ClinicName = req.body['clinicID'];
    var DoctorName = req.body['DoctorName'];
    var emp_ID = req.body['emp_ID'];
    var AppointmentDate= req.body['AppointmentDate'];

    var sql="SELECT * FROM patient where user_ID = "+decoded.userid+";"

    db.query(sql,function(err,result){
       if (err){     
        throw err;
        var responemsg = {
          data:"wrong clinic name",
          Success:false,
          error:"R1"
        }
        res.send(responemsg)
        
    }
        console.log('Data retrieved !' + result[0]);
  var patientid = result[0].patient_ID;
       

    var s ="SELECT `clinic_ID` `avalibality` FROM `clinics` WHERE  `Name`='"+ClinicName+"'";

db.query(s,function(err,result){
  if (err){     
      throw err;
      var responemsg = {
        data:"wrong clinic name",
        Success:false,
        error:"R1"
      }
      res.send(responemsg)
      
  }
   console.log('Data selected from clinics ! created.!');
  if ( result[0].avalibality == 0  )

  {
    var responemsg = {
      data:"Clinic not available",
      Success:false,
      error:"R1"
    }
    res.send(responemsg)

  }
   var clinicId = result[0].clinic_Id; 
  

     var sqll = " SELECT `Doc_ID` FROM `doctors` WHERE `Name` = '"+DoctorName+"'";

     db.query(sqll,function(err,result){
      if (err){     
          throw err;
          var responemsg = {
            data:"wrong doctor name",
            Success:false,
            error:"R1"
          }
          res.send(responemsg)
      }
       console.log('Data founded ! created.!');
      var doctorID= result.doc_ID
      


      var sq = "SELECT  `emp_Name`,  FROM `emp` WHERE `emp_ID`='"+emp_ID+"'";

      db.query(sq,function(err,result){
       if (err){     
           throw err;
           var responemsg = {
             data:"wrong emp name",
             Success:false,
             error:"R1"
           }
           res.send(responemsg)
       }
        console.log('Data founded ! created.!');
       var emp_ID= result.emp_ID


      //////////////////////////////////////////////////////////////////////////////////check da query
     var sqlll = " INSERT INTO `bill`(`TotalPrice`) VALUES ('0')";

     db.query(sqlll,function(err,result){
      if (err){     
          throw err;
          var responemsg = {
            data:"wrong  in bill insertion",
            Success:false,
            error:"R1"
          }
       
      }
       console.log('bill created! created.!');
      var bill =result[0].insertId; 
      
      ///////////////////////////////////////////////////////////////////////////////////check da query
      var sqllll = " INSERT INTO `prescription`( `Diagnosis`) VALUES ()";

     db.query(sqllll,function(err,result){
      if (err){     
          throw err;
          var responemsg = {
            data:"wrong  in prescription insertion",
            Success:false,
            error:"R1"
          }
       
      }
       console.log('peresctription added ! created.!');
       var pre = result[0].insertId;
 
  var sqlllll=" UPDATE `transactions` SET `Doc_ID`='"+doctorID+",`clinic_ID`='"+clinicId+"',`AppointmentDate`='"+AppointmentDate+"',`Completed`='"+0+ ",`Paid`='"+0+ "'"
  

  db.query(sqlllll,function(err,result){
   if (err){     
       throw err;
       var responemsg = {
         data:"wrong  in transaction insertion",
         Success:false,
         error:"R1"
       }
    
   }
    console.log('peresctription added ! created.!');
   }) 

 }) 
})
})
})
})
})
})
})
//###########################################################################################################
app.post('res/cancel',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    var sql = "UPDATE `transactions` SET `cancelled`= '"+1+"'";
    db.query(sql,function(err,result){
      if (err){     
         throw err;
      }
       console.log('res cancelled !' );
 
       var Response = {
         Data:result[0],
         Success:true,
         errors:null
       }
       res.send(Response)
      
      })
//############################################################################################################
/*
1- get clinic id by name and check if available ( return error if not avail.)
2- get doctor id by name
3- insert new row in bill
4- insert new row in prescription


billid = create new row in bill
prescriptionId = create new row in prescription
docid = get doctor id by name(given)
clinicid = get clinic id by name(given)
patientid= get patient id by user id(given)
empid = NULL
completed = 0
paid = 0
appointmentdate = (given)
Transactiondate = current */
//#########################################
app.post('/Clinic/GetTime',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    var Drname = req.body['Dname'];
    var Clname = req.body['Clname'];
var sql ="SELECT `availability`.`Days`, `availability`.`TIMEFROM`, `availability`.`TIMETO`, `doctors`.`Name`, `clinics`.`Name` FROM `availability` , `doctors` , `clinics` WHERE (( `doctors`.`Name` = '"+Dname+ "'') AND ( clinics.Name = '"+Clname+ "')"


db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   
          var Response = {
         Data:result,
         Success:true,
         errors:null
       }
       res.send(Response)
  })
})
})


//############################################################################################################
app.post('/Manger/GetAllEmployees',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
var sql ="SELECT * FROM Emp"

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   
          var Response = {
         Data:result,
         Success:true,
         errors:null
       }
       res.send(Response)
  })
})
})

app.post('/Manger/GetAllDoctors',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
var sql ="SELECT * FROM Doctors"

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   
          var Response = {
         Data:result,
         Success:true,
         errors:null
       }
       res.send(Response)
  })
})
})

app.post('/Manger/GetAllPatient',function(req , res){

  var token = req.headers['authorization'];
  console.log(req.headers)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "thisistopsecret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
 
var sql ="SELECT * FROM Patient"

db.query(sql,function(err,result){
  if (err){     
      throw err;
  }
   console.log('Data added ! created.!');
   
          var Response = {
         Data:result,
         Success:true,
         errors:null
       }
       res.send(Response)
  })
})
})

//######################################################################################################



// you forgot the server host,ports .. how can you run the server ? Front-end and Back-end are independent.

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
