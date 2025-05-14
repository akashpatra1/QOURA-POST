const express=require("express");
let app =express();
let port =3000;
let path =require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method")); // 🔹 Enables method override
app.use(express.urlencoded({ extended: true })); // 🔹 Parses form data

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Akash@123",
    database: "DATASQL"
});
let getRandomUser = () => {
    return [
         faker.string.uuid(),
         faker.internet.username(),
         faker.internet.email(),
         faker.internet.password()
    ];
};

//  let q="INSERT INTO user VALUES ?";
//  let user=["123","123_newuser","abc@gmail.com","abc"];
//  let users=[["123a","123_newusera","abca@gmail.com","abca"],
//  ["123b","123_newuserb","abcb@gmail.com","abcb"],
// ];
// let data=[];
// for(let i=0;i<100;i++){
//     data.push(getRandomUser());
// }



app.get("/",(req,res)=>{
     let q="SELECT COUNT(*) AS count FROM user";
     try{
    connection.query(q, (err, results) => {
        if (err) throw err;
        // console.log(results[0].count);
        let count=results[0].count;
        res.render("home.ejs",{count});
    });
    }
    catch(err){
        console.log(err);
    }
});
app.get("/user",(req,res)=>{
    let q="SELECT * FROM user";
    try{
   connection.query(q, (err, results) => {
       if (err) throw err;
       // console.log(results[0].count);
       let data=results;
       res.render("user.ejs",{data});
   });
   }
   catch(err){
       console.log(err);
   }
});
//Edit route
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q="SELECT * FROM user WHERE id=?";
    try{
        connection.query(q,[id], (err, results) => {
            if (err) throw err;
            // console.log(results[0].count);
            let user=results[0];
            res.render("edit.ejs",{user});
        });
        }
        catch(err){
            console.log(err);
        }
 
});
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let q="SELECT * FROM user WHERE id=?";
    let{password:formPass,username:newUser}=req.body;
    try{
        connection.query(q,[id], (err, results) => {
            if (err) throw err;
            // console.log(results[0].count);
            let user=results[0];
            if(formPass!=user.password){
                res.send("wrongpass");
            }else{
               let q2=`UPDATE user SET username='${newUser}' WHERE id='${id}'`;
               connection.query(q2,(err,results)=>{
                if(err) throw err;
                res.redirect("/user");
                
               });
            }
          
        });
        }
        catch(err){
            console.log(err);
        }
});








app.listen(port,()=>{
    console.log(`app is listing aty the port${port}`);
});
// try{
//     connection.query(q,[data], (err, results) => {
//         if (err) throw err;
//         console.log(results);
//     });
//     }
//     catch(err){
//         console.log(err);
//     }
//     connection.end();