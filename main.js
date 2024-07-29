
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql2");
var fs = require('fs');

const multer = require("multer");
const FormData = require('form-data');
const util = require('util');
const path = require('path');

var filePath = '';
var fileName = '';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

var pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'ajjaC123N!',
  database: 'nfdb',
  connectionLimit: 10,
  multipleStatements: true
});

var app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/main_signup.html");
});

app.get('/user', function (req, res) {
  res.sendFile(__dirname + '/public/client_login/index.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/public/admin_login/index.html');
});

app.get('/register_user', function (req, res) {
  res.sendFile(__dirname + '/public/usignup.html');
});

app.get('/register_admin', function (req, res) {
  res.sendFile(__dirname + '/public/asignup.html');
});

app.get('/usignup', (req, res) => {
  res.sendFile(__dirname + '/public/usignup.html');
});


app.post('/usignup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const sql = 'SELECT user_id FROM client WHERE user_id = ?';
  pool.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error checking for duplicate admin_id:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
  
    if (result.length > 0) {
      res.send('Admin with username already exists');
      return;
    }
  
    // Insert data into the 'users' table
    const sql = 'INSERT INTO client (user_id, u_password) VALUES (?, ?)';
    pool.query(sql, [username, password], (err, result) => {
      console.log(result);
      if (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Data inserted into the database');
        // res.send('Signup successful!');
        res.sendFile(__dirname + '/public/client_login/index.html');

      }
    });
  });
  
});

app.post('/ulogin', function (req, res) {
  let user_name = req.body.username;
  let user_password = req.body.password;
  console.log(user_name + " " + user_password);

  try {
    pool.query('SELECT u_password FROM client WHERE user_id=?', [user_name], function (err, result, fields) {
      if (err) throw err;

      console.log("data retrieved");
      let r = result[0].u_password;
      console.log(r);

      if (user_password !== r)
        res.send('Authentication failed');
      else
        res.sendFile(__dirname + '/public/dashboard/user_dash.html');
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/asignup', (req, res) => {
  res.sendFile(__dirname + '/public/asignup.html');
});


app.post('/asignup', (req, res) => {
  const username = req.body.adminname;
  const password = req.body.password;
  const sql = 'SELECT admin_id FROM admin WHERE admin_id = ?';
  pool.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error checking for duplicate admin_id:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
  
    if (result.length > 0) {
      res.send('Admin with username already exists');
      return;
    }
  
    // Insert data into the 'users' table
    const sql = 'INSERT INTO admin (admin_id, a_password) VALUES (?, ?)';
    pool.query(sql, [username, password], (err, result) => {
      console.log(result);
      if (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Data inserted into the database');
        // res.send('Signup successful!');
        res.sendFile(__dirname + '/public/admin_login/index.html');

      }
    });
  });
  
});



app.post('/alogin', function (req, res) {
  let admin_name = req.body.adminname;
  let admin_password = req.body.password;

  console.log(admin_name + " " + admin_password);

  try {
    pool.query('SELECT a_password FROM admin WHERE admin_id=?', [admin_name], function (err, result, fields) {
      if (err) throw err;

      console.log("data retrieved");
      let r = result[0].a_password;
      console.log(r);

      if (admin_password !== r)
        res.send('Authentication failed');
      else
        res.sendFile(__dirname + '/public/dashboard/admin_dash.html');
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/alogin/area_details/alogi2n', function (req, res) {
  let admin_name = req.body.id;
  let admin_password = req.body.field2;
  let ad1 = req.body.field3;
  let ad2 = req.body.field4;

  console.log("asdas");
  console.log(admin_name + " " + admin_password + ad1 + ad2);
  console.log(req.body.field1 + " " + req.body.field2);

  var sql1 =
    "INSERT INTO area (area_id,name,latitude,longitude) VALUES (?,?,?,?)";

  try {
    pool.query(sql1, [req.body.field1, req.body.field2, req.body.field3, req.body.field4], function (err, result) {
      console.log(sql1);
      if (err) throw err;
      console.log("1 record inserted");
      res.send("Area Added");
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/alogin/area_details/alogi3n', function (req, res) {
  let admin_name = req.body.id;
  let admin_password = req.body.field2;
  let ad1 = req.body.field3;
  let ad2 = req.body.field4;
  console.log("asdas22");
  console.log(admin_name + " " + admin_password + "  " + ad1 + "  " + ad2);

  var sql1 =
    "UPDATE area  set name=?, latitude=?, longitude=? where area_id=?";

  try {
    pool.query(sql1, [req.body.field2, req.body.field3, req.body.field4,req.body.field1], function (err, result) {
      console.log(sql1);
      if (err) throw err;
      console.log("1 Area updated");
      res.send("area updated");
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/alogin/area_details/alogi4n', function (req, res) {
  let admin_name = req.body.field1;

  console.log("asdas22");
  console.log(admin_name);

  var sql1 =
    "Delete from area  where area_id=?";

  try {
    pool.query(sql1, [admin_name], function (err, result) {
      console.log(sql1);
      if (err) throw err;
      console.log("1Area updated");
      res.send("area Deleted");
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/ulogin/waste_produce/wastepro', function (req, res) {
  let user_id = req.body.field1;
  let bio_weight = req.body.field2;
  let non_bio_weight = req.body.field3;

  console.log("Received request for user ID: " + user_id);

  // Check if the user ID already exists in the waste_produced table
  let checkDuplicateSql = "SELECT * FROM waste_produced WHERE user_id = ?";
  
  pool.query(checkDuplicateSql, [user_id], function (err, results) {
    if (err) {
      console.error('Error checking for duplicate user ID:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // If results contain any rows, the user ID already exists
    if (results.length > 0) {
      console.log("User ID already exists in the database");
      res.status(400).send('User ID already exists. Please use a different user ID.');
    } else {
      // User ID does not exist, proceed with the insertion
      let insertSql = "INSERT INTO waste_produced (user_id, bio_weight, non_bio_weight) VALUES (?, ?, ?)";
      
      pool.query(insertSql, [user_id, bio_weight, non_bio_weight], function (err, result) {
        if (err) {
          console.error('Error inserting record:', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log("Record inserted successfully");
          res.send("Your daily waste details updated");
        }
      });
    }
  });
});


app.post('/ulogin/waste_produce/docomp', function(req, res) {
  let user_id = req.body.id;
  let area_name=req.body.field2;
  let driver_name=req.body.field3;
  let msg = req.body.field4;
  let date = req.body.field5;

  console.log("asdas");
  console.log(user_id + " " + area_name+ " "+ " "+driver_name + msg + date);
  console.log(req.body.field1 + " " + req.body.field2);

  let datetime = new Date();
  let today = datetime.toISOString().slice(0, 10);
  console.log(datetime.toISOString().slice(0, 10));

  var sql1 =
    "INSERT INTO complaint(user_id,area_name,driver_name,message,complaint_date) VALUES (?,?,?,?,?)";

  try {
    pool.query(sql1,[req.body.field1, req.body.field2, req.body.field3, req.body.field4,req.body.field5], function (err, result) {
      console.log(sql1);
      if (err) throw err;
      console.log("1 record inserted");
      res.send("Your record is registered. We will get back to you soon!");
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
  });

  // app.post('/ulogin/waste_produce/docomp', function(req, res) {
  //   let user_id = req.body.id;
  //   let area_name=req.body.field2;
  //   let driver_name=req.body.field3;
  //   let msg = req.body.field4;
  //   let date = req.body.field5;
  
  //   console.log("asdas");
  //   console.log(user_id + " " + area_name+ " "+ " "+driver_name + msg + date);
  //   console.log(req.body.field1 + " " + req.body.field2);
  
  //   let datetime = new Date();
  //   let today = datetime.toISOString().slice(0, 10);
  //   console.log(datetime.toISOString().slice(0, 10));

  //   // Check if the user ID already exists in the waste_produced table
  //   let checkDuplicateSql = "SELECT * FROM complaint WHERE user_id = ?";
    
  //   pool.query(checkDuplicateSql, [user_id], function (err, results) {
  //     if (err) {
  //       console.error('Error checking for duplicate user ID:', err);
  //       res.status(500).send('Internal Server Error');
  //       return;
  //     }

  //     // If results contain any rows, the user ID already exists
  //     if (results.length > 0) {
  //       console.log("User ID already exists in the database");
  //       res.status(400).send('User ID already exists. Please use a different user ID.');
  //     } else {
  //       // User ID does not exist, proceed with the insertion
  //       let insertSql = "INSERT INTO complaint(user_id,area_name,driver_name,message,complaint_date) VALUES (?,?,?,?,?)";
        
  //       pool.query(insertSql, [req.body.field1, req.body.field2, req.body.field3, req.body.field4,req.body.field5], function (err, result) {
  //         if (err) {
  //           console.error('Error inserting record:', err);
  //           res.status(500).send('Internal Server Error');
  //         } else {
  //           console.log("Record inserted successfully");
  //           res.send("Your daily waste details updated");
  //         }
  //       });
  //     }
  //   });
  // });

  

  app.get('/alogin/vehicles',function(req,res){
    res.sendFile(__dirname + '/public/admin_vehicles/admin.html');
  });

  app.get('/alogin/vehicle_details/add_vehicle',function(req,res)
  {
    res.sendFile(__dirname + '/public/admin_vehicles/add_vehicle.html');
  });

  app.post('/alogin/vehicle_details/avlogin', function(req, res) {
    let vehicle_id = req.body.id;
    let area_id = req.body.field2;
    let driver = req.body.field3;
    let telephone = req.body.field4;
  
    console.log("asdas");
    console.log(vehicle_id + " " + area_id + driver + telephone);
    console.log(req.body.field1 + " " + req.body.field2);
  
    let datetime = new Date();
    let today = datetime.toISOString().slice(0, 10);
    console.log(datetime.toISOString().slice(0, 10));
  
    var sql1 =
      "INSERT INTO vehicles(vehicle_id,area_id,driver_name,driver_phone) VALUES (?,?,?,?)";
  
    try {
      pool.query(sql1, [req.body.field1, req.body.field2, req.body.field3, req.body.field4], function (err, result) {
        console.log(sql1);
        if (err) throw err;
        console.log("1 record inserted");
        res.send("Your record is successfully inserted!!");
      });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
    });
  

  app.get('/alogin/vehicle_details/delete_vehicle',function(req,res)
  {
    res.sendFile(__dirname + '/public/admin_vehicles/delete_vehicle.html');
  });

  app.post('/alogin/vehicle_details/adlogin', function (req, res) {
    let veh_id = req.body.field1;
  
    console.log("asdas22");
    console.log(veh_id);
  
    var sql1 =
      "Delete from vehicles  where vehicle_id=?";
  
    try {
      pool.query(sql1, [veh_id], function (err, result) {
        console.log(sql1);
        if (err) throw err;
        console.log("1 vehicle deleted");
        res.send("vehicle Deleted");
      });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });


  app.get('/alogin/comp_status', function (req, res) {
    try {
        // Select data from the ComplaintResolvedStatus table
        pool.query("SELECT * FROM ComplaintResolvedStatus", function (err, result) {
            if (err) {
                console.error('Error executing SELECT query:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Generate HTML table
            let htmlTable = '<table border="1">';
            htmlTable += '<tr><th>User ID</th><th>Area Name</th><th>Driver Name</th><th>Complaint Status Message</th></tr>';

            // Loop through the result and add rows to the table
            result.forEach((row) => {
                htmlTable += `<tr><td>${row.user_id}</td><td>${row.area_name}</td><td>${row.driver_name}</td><td>${row.complaint_status_message}</td></tr>`;
            });

            htmlTable += '</table>';

            // Send the HTML response
            res.send(htmlTable);
        });
    } catch (error) {
        console.error('Error executing SELECT query:', error);
        res.status(500).send('Internal Server Error');
    }
});

  app.get('/ulogin/stat', function (req, res) {
    res.sendFile(__dirname + "/public/forms/stat_dash.html");
    });

  app.post('/ulogin/stat/check', function (req, res) {
    const uid = req.body.field1;
    let sql1 = "SELECT bio_weight, non_bio_weight FROM waste_produced WHERE user_id = ?";
    
    try {
      pool.query(sql1, [uid], function (err, result) {
        console.log(sql1);
        console.log(uid);
        if (err) throw err;
        console.log("Result retrieved");
    
          // Generate HTML table
        let htmlTable = '<table border="1">';
        htmlTable += '<tr><th>User ID</th><th>Bio weight</th><th>Non-Bio weight</th></tr>';
    
        result.forEach((row) => {
          htmlTable += `<tr><td>${row.user_id}</td><td>${row.bio_weight}</td><td>${row.non_bio_weight}</td></tr>`;
        });
    
        htmlTable += '</table>';
    
        res.send(htmlTable);
      });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  // app.post('/ulogin/stat/check', async function (req, res) {
  //   console.log('Checking usage statistics');
  //   const uid = req.body.field1;
  //   console.log(uid);
  
  //   const sql = "SELECT bio_weight, non_bio_weight FROM waste_produced WHERE user_id = ?";
    
  //   try {
  //     const result = await query(sql, [uid]);
  //     console.log(result);
  //     res.send(result);
  //   } catch (error) {
  //     console.error('Error executing query:', error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // });

  
  
  app.post('/ulogin/waste_produce/resolved', function(req, res) {
    let user_id = req.body.id;
    let area_name=req.body.field2;
    let driver_name=req.body.field3;
    let complaint_status_message = req.body.field4;
  
    console.log("asdas");
    console.log(user_id + " " + area_name+ " "+ " "+driver_name + complaint_status_message);
    console.log(req.body.field1 + " " + req.body.field2);
  
    let datetime = new Date();
    let today = datetime.toISOString().slice(0, 10);
    console.log(datetime.toISOString().slice(0, 10));
  
    var sql1 =
      "INSERT INTO ComplaintResolvedStatus (user_id,area_name,driver_name,complaint_status_message) VALUES (?,?,?,?)";
  
    try {
      pool.query(sql1,[req.body.field1, req.body.field2, req.body.field3, req.body.field4], function (err, result) {
        console.log(sql1);
        if (err) throw err;
        console.log("1 record inserted");
        res.send("Your record is registered. We will get back to you soon!");
      });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
    });
  
  
  
  app.get('/ulogin/complaint', function (req, res) {
  res.sendFile(__dirname + "/public/forms/complaint_dash.html");
  });

  app.get('/ulogin/resolved_complaint', function (req, res) {
    res.sendFile(__dirname + "/public/forms/resolved_complaint.html");
    });
  
  app.get('/ulogin/waste_produce', function (req, res) {
  res.sendFile(__dirname + "/public/forms/waste_produce_dash.html");
  });
  
  app.get('/ulogin/user_dash', function (req, res) {
  res.sendFile(__dirname + "/public/dashboard/user_dash.html");
  });
  
  app.get('/alogin/admin_dash', function (req, res) {
  res.sendFile(__dirname + "/public/dashboard/admin_dash.html");
  });
  
  app.get('/alogin/area_details', function (req, res) {
  res.sendFile(__dirname + "/public/dashboard/area_details_dash.html");
  });
  
  app.get('/alogin/area_details/add_area', function (req, res) {
  res.sendFile(__dirname + "/public/forms/add_area_dash.html");
  });
  
  app.get('/alogin/area_details/update_area', function (req, res) {
  res.sendFile(__dirname + "/public/forms/update_area_dash.html");
  });
  
  app.get('/alogin/area_details/delete_area', function (req, res) {
  res.sendFile(__dirname + "/public/forms/delete_area_dash.html");
  });
  
  app.listen(3000, function () {
  var datetime = new Date();
  console.log(datetime.toISOString().slice(11, 16));
  console.log(datetime.toISOString().slice(0, 10));
  console.log('Node server is running on port 3000');
  });
