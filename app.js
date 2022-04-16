const fs = require('fs')
const http = require('http');
const { type, userInfo } = require('os');

const port = 3000;
const host = "127.0.0.1"

//==============Server Creating
const server = http.createServer((req,res) => {
     const url = req.url;
     const method = req.method;

//=================For Login User======================================

     if(url=='/login' && method == 'GET')
     {
         let loginData = ""; 
         req.on("data" , (chunk) =>{ //req from server
             loginData += chunk;
         });
        
        fs.readFile('./users.json' , 'utf-8' , (err,data) =>{
           if(err){
               console.log(err);
               res.writeHead(400, {"Content-Type":"application/json"})
               res.end("Error while fetching data") 
           }
           else{
               let result = false;
               let loguser = JSON.parse(data);
               let login = JSON.parse(loginData)

               for(let i=0 ;i < loguser.Users.length ; i++)
               {
                   if(loguser.Users[i].email === login.email
                    && loguser.Users[i].password === login.password)
                    {
                        console.log("Login Successfully!!\n")
                        res.writeHead(200,"Ok" , {"content-type" : "application/json"});
                        res.end(`Id number ${loguser.Users[i].id} Login Successfully!!!\n`);
                        result = true;
                        break;
                    } 
               }//end of for loop
               if(!result)
               {
                console.log("User Not Found For Login\n")
                res.writeHead(401, {"Content-Type":"application/json"})
                res.end("User Not Found!");
               }
           }
        })//end of readfile
         
     }//end of if or login

//====================================For Register================================

     else if(url=='/register' && method == 'POST')
     {
        let regData = ""

        req.on("data" , (chunk) =>{
            regData += chunk;
        });

        fs.readFile('./users.json' , 'utf-8' , (err,data) =>{
            let result = false;
            if(err){
                console.log(err);
                res.writeHead(400, {"Content-Type":"application/json"})
                res.end("Error while fetching data") 
            }
            else{
                let regUser = JSON.parse(data);
                let register = JSON.parse(regData);

                for(let i=0 ;i < regUser.Users.length ; i++)
                {
                  if(regUser.Users[i].email === register.email
                    && regUser.Users[i].password === register.password)
                    {
                        console.log("User Already Registered\n")
                        res.writeHead(401, {'Content-Type': 'application/json'});
                        res.end(`User already registered\n You can login now`);
                        result = true;
                        break;
                    } 
                }//end of for loop
                if(!result)
                 {
                    regUser.Users.push(register)
                    let regJson = JSON.stringify(regUser , null ,2)

                    fs.writeFile("./users.json",regJson , function(err){
                        if(err){
                            console.log(err)
                            res.writeHead(500,{"Content-Type":"application/json"})
                            res.end("Storing data Error!");
                        }
                        else{
                           console.log(`Registered Successfully\n`)
                           res.writeHead(200,"Ok" , {"content-type" : "application/json"});
                           res.end(`Registered Successfully\n`);
                           
                        }
                    });//end of appendfile
                 }
            }
        });//end of readfile
     }//end of else if or register

// ===========================For Deleting user===============================================

    else if(url==="/deleteuser" && method === "DELETE")
    {
        let delData = ""

        req.on("data" , (chunk) =>{
            delData += chunk;
        });

        fs.readFile('./users.json' , 'utf-8' , (err,data) =>{
            let result = false;
            if(err){
                console.log(err);
                res.writeHead(400, {"Content-Type":"application/json"})
                res.end("Error while fetching data") 
            }
            else{
                let delUser = JSON.parse(data);
                let delet = JSON.parse(delData);

                for(let i=0;i< delUser.Users.length;i++)
                {
    
                    if(delUser.Users[i].email === delet.email
                      && delUser.Users[i].password === delet.password)
                    {
                        delUser.Users.splice(i,1); 
                        let deljson = JSON.stringify(delUser, null, 2);

                    
                        fs.writeFile("./users.json", deljson, "utf8", (err) => {
                          if (err) {
                            console.log(err);
                            res.end("Error while Deleting data!");
                          } 
                          else {
                            console.log("User Deleted Successfully");
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end("User Deleted Successfully");
                         }
                        });//end of writefile

                        result = true;
                        break;
                    }
                }//end of for loop
                if(!result)
                {
                 console.log('User Not Found For Delete!\n')
                 res.writeHead(401, {"Content-Type":"application/json"})
                 res.end("User Not Found For Delete!\n");
                } 
            }//

        });//end of readfile
    }//end of else if or delete

//=====================For Update User===================================

else if(url==="/updateuser" && method === "PUT")
    {
        let upData = ""

        req.on("data" , (chunk) =>{
            upData += chunk;
        });

        fs.readFile('./users.json' , 'utf-8' , (err,data) =>{
            let result = false;
            if(err){
                console.log(err);
                res.writeHead(400, {"Content-Type":"application/json"})
                res.end("Error while fetching data") 
            }
            else{
                let updateUser = JSON.parse(data);
                let update = JSON.parse(upData);

                for(let i=0;i< updateUser.Users.length;i++)
                {
    
                    if(updateUser.Users[i].id === update.id)
                    {
                        updateUser.Users[i] = update; 
                        let updatejson = JSON.stringify(updateUser, null, 2);

                    
                        fs.writeFile("./users.json", updatejson, "utf8", (err) => {
                          if (err) {
                            console.log(err);
                            res.end("Error while Data Updated!");
                          } 
                          else {
                            console.log("User Data Updated Successfully");
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end("User Data Updated Successfully");
                         }
                        });//end of writefile

                        result = true;
                        break;
                    }
                }//end of for loop
                if(!result)
                {
                 console.log('User Not Found For Updateing Data!\n')
                 res.writeHead(401, {"Content-Type":"application/json"})
                 res.end("User Not Found For Updateing Data!\n");
                } 
            }//

        });//end of readfile
    }//end of else if or update
//===================================================================

    else{
        console.log("Page Not Found!!!!!!!!!!!!!!!!!!\n")
        res.writeHead(404,{'Content-Type': 'text/html'});
        res.end("Page Not Found!!!!!!!!!!!!!!!!!!\n");
    }
});//end of server


//========SERVER LISTENING 
server.listen(port, host  , () =>{
   console.log(`Server Listening with ${port} and ${host}\n` )
});