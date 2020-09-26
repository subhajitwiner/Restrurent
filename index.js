const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app= express();
const mysql= require('mysql');
port=4000

 app.listen(port,()=>{
    console.log(`server is running on ${port}`);
 });
 app.use(cors());
 app.use(bodyParser.json());
 //Mysql connection configaration
var mysqlcon=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'foodshop',
    multipleStatements:true
});
//Mysql Connection Create and Check
mysqlcon.connect((err) => {
    if(!err)
        console.log('DB connection succeded');
    else
        console.log("DB connection failed \n Error : "+ JSON.stringify(err, undefined, 2));
}); 

 app.get('/', (req, res) => {
     res.send('welocme');
 });
 //Get all items
app.post('/getitems', (req, res) => {
    mysqlcon.query('SELECT * FROM `items`', (err, rows, fields) => {
        if (!err){
            res.json({data:rows}).status(200);
        }
        else{
            console.log(err);
        }
            
    })
});


//Get an items
app.post('/getaitem', (req, res) => {
    console.log(req)
    mysqlcon.query('SELECT * FROM `items` where Id = ? ', [req.body.id], (err, rows, fields) => {
        if (!err){
            res.send(rows[0]);           
        }
            
        else{
            console.log(err);
        }
            
    })
});

//INSERT ITEMS
app.post("/Insertitem",(req,res)=>{
    //
    console.log(req.body);
    let time=new Date;
    time=time.getFullYear()+"_"+(time.getMonth()+1)+"_"+time.getDate()+"_"+time.getHours()+"_"+time.getMinutes()+"_"+time.getSeconds()+"_"+time.getMilliseconds();   
    let myfile= req.files.image;
    dfile=Math.floor(Math.random() * 9999)+"_"+time+"_"+myfile.name;
    tfile="upload/"+dfile;
   
    myfile.mv(tfile, (err)=>{
        if(err){
            res.json(err);
        }
        else{
            mysqlcon.query("INSERT INTO `items` (`name`, `image`, `category`, `price`) VALUES (?,?,?,?)",[req.body.name,dfile,req.body.category,req.body.price],(errr)=>{
                if(errr){
                    res.json(errr);
                }
                else{
                    res.json("success");
                }
            });
            
        }
    })
})

//update with id wise
app.post('/update', (req,res)=>{
    console.log(req.body);
    if(req.files!=null){
        let time=new Date;
        time=time.getFullYear()+"_"+(time.getMonth()+1)+"_"+time.getDate()+"_"+time.getHours()+"_"+time.getMinutes()+"_"+time.getSeconds()+"_"+time.getMilliseconds();   
        let myfile= req.files.image;
        dfile=Math.floor(Math.random() * 9999)+"_"+time+"_"+myfile.name;
        tfile="upload/"+dfile;
        myfile.mv(tfile, (err)=>{
            if(err){
                res.json(err);
            }
            else{
                console.log(dfile)
                mysqlcon.query("update items set name = ?, category = ?, image = ?, price= ? where id = ?",
                [req.body.name,req.body.category,dfile,req.body.price,req.body.id], (err, rows, fields)=>{
                    if(err){
                        res.json("Error");
                    }
                    else{
                        res.json("Success");
                    }
                });
                
            }
        })

    } else {
        mysqlcon.query("update items set name = ?, category = ?, price= ? where id = ?",
        [req.body.name,req.body.category,req.body.price,req.body.id], (err , rows ,fields )=>{
            if(err){
                res.json("Error");
            }
            else{
                res.json("Success");
            }
        })
    }
    

    
    
   
});

//Delete an Item
app.post('/delete', (req,res)=>{

    mysqlcon.query("DELETE FROM `items` WHERE `items`.`id` = ?",[req.body.id], (err, rows, fields)=>{
        if(err){
            res.json("Error")
            console.log('Error');
        }
        else{
            res.json("Success")
            console.log('Success');
        }
    });
});
//Get a user
app.post('/getacustomer', (req, res) => {
    mysqlcon.query('SELECT * FROM `user` WHERE id=? and pass =?', [req.body.id,req.body.pass], (err, rows, fields) => {
        if (!err){
            res.send(rows[0]);           
        } 
        else{
            console.log(err);
        }
            
    })
});

//INSERT ITEMS
app.post("/Insertitemalter",(req,res)=>{
    //
    mysqlcon.query("INSERT INTO `items` (`name`,  `category`, `price`) VALUES (?,?,?)",[req.body.name,req.body.category,req.body.price],(errr)=>{
        if(errr){
            res.json(errr);
        }
        else{
            res.json("success");
        }
    });
    
})

//update with id wise
app.post('/update2', (req,res)=>{
    console.log(req.body);
            mysqlcon.query("update items set name = ?, category = ?, price= ? where id = ?",
            [req.body.name,req.body.category,req.body.price,req.body.id], (err, rows, fields)=>{
                if(err){
                    res.json("Error");
                }
                else{
                    res.send("Success");
                }
            });
});

app.post('/imgchk',(req,res)=>{
    if(req.files!=null){
        console.log(req.files)
        res.json({name:req.body.name,image:req.files,category:req.body.category,price:req.body.price})
    } else {
        res.json({name:req.body.name,category:req.body.category,price:req.body.price})
    }
   
    

})

//Get login user 
app.post('/login', (req, res) => {
    console.log(req)
    mysqlcon.query('SELECT * FROM `user` WHERE email=? and pass=? ', [req.body.email,req.body.password], (err, rows, fields) => {
        if (!err){
            if(rows[0]!=null){
                res.send(rows);
            }
            else{
                res.send('wrong user name password ');
            }
            //res.send(rows[0]);    
        }
            
        else{
            console.log(err);
        }
            
    })
});