const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { post } = require('request');
const app = express();

//lets get our app to use bosy-parser
app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', function(req, res){
    const mailid = req.body.email;
    const passkey = req.body.password;
    const repeatkey = req.body.password_confirmation;
    const Fname = req.body.fname;
    const Lname = req.body.lname;
    console.log(mailid);
    console.log(passkey);
    console.log(repeatkey);

    var data = {
        members : [
            {email_address: mailid,
                status : 'subscribed',
                merge_fields:{
                    FNAME : Fname,
                    LNAME : Lname
                },


            }
        ]
        
    } //js data object  , convert into string that is in the form of json
    // so that the following mailchimp server  can understand the data recieved
    const jsonData = JSON.stringify(data);
    const url =  "https://us5.api.mailchimp.com/3.0/92deb53399"; //append your own API key at the end of the URL instead of existing one (replace your own API key with '92deb53399')
                              //the main url going to come from endpoint"
                              const options ={
                                method : "POST",
                                auth : ""          //this is the basic authentication
                                // in which the key will be auth and corresponding value will be in the
                                // form of string of rule having 'username:password'
                                // username could be any of your choice
                                // password will be the unique api key generated by the developer
                                // make sure that region in the api key matches the region
                                // in the url
                            }
    const request = https.request(url, options, function(response){

        // response status to client/ user
        if(response.statusCode == 200){
            res.sendFile(__dirname + '/success.html');
        }
        else{
            res.sendFile(__dirname + '/failure.html');
        }

        

        // now check the response that has been sent according to the data
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

    })
    request.write(jsonData); //passing the data to the mailchimp server
    // after done with the request
    request.end();

})  


app.listen(process.env.PORT || 3000, function(req, res){
    console.log('server started on the port 3000 locally.')
})
//dynamic port that heroku while deploying - process.env.PORT

//the app will listen to both heroku port and also 3000 port

// fe77965a8c9067a8c7399e40504fff55-us5 - API key

//unique audience ID - 92deb53399 -> List ID    
// This is the ID which we can get a list in which we want to put
// the subscribed audience into


// X in the url shall be replaced with the us'X' in the api key you created. Mail chimp as 
// several servers running with unique urls. So be cautious of spell checks in the ids or
// url
// at the end of the url, you are providing list id (in the options right after endpoint), the list id is
// the unique id with which a list u will be having with that with that id
// so that the data shall be stored in that list from the subscribers







// at the hyper, after the backend has been set succesfully,
// the mailchimp sends back the information as per the requests we have made
// weve sent the data using post request and all (get request to send the static page to client)
// after the data sent to the mailchimp server with unique url having unique API key,it recieves it and stores it in the list with
// unique list id
// Hence it'll send the data back that subscriber has been added


// we can get hold of the response, and can probably fetch the status code
// whether the process was successful or not
// generally if the status code is to be '200' then all went good
// if not we have to display something to the client or user
// if went wrong, failed !, if not successful

