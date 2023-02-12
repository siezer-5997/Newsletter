const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const { url } = require('inspector');
const { STATUS_CODES } = require('http');
const app = express();

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;

    const data = {
        members : [
            {
                email_address : email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/2b660707a2";
    const options = {
        method: "POST",
        auth: "Siem:cc5e2c05f92a908ab153565f33cea4c95-us21"
    }
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            if(response.statusCode === 200){
                res.sendFile(__dirname+ "/success.html");
            }else{
                res.sendFile(__dirname+ "/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();

})

// failure route 
app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});

// API key 
// c5e2c05f92a908ab153565f33cea4c95-us21
// list ID 
// 2b660707a2