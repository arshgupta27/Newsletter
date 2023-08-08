const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000||process.env.PORT;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/sign_up.html');
})

app.post('/', function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailInput = req.body.emailInput;
    console.log(firstName, lastName, emailInput);
    const data = {
        members: [
            {
                email_address: emailInput,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/3b1ec33425";
    const option = {
        method: "Post",
        auth: "arsh:52655023189b6da8983acfa3d778dd2b-us21"
    }
    const request = https.request(url, option, function (response) {
        // console.log(response.statusCode);
        response.on('data', function (data) {
            // console.log(JSON.parse(data));
            const userData = JSON.parse(data);
            console.log(userData.error_count);
            if (userData.error_count === 0) {
                res.sendFile(__dirname + "/success.html");
            }
            else res.sendFile(__dirname + "/failure.html");
        })
    });
    request.write(jsonData);
    request.end();
    // res.send();
})

app.post('/failure', function (req, res) {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})

// AudienceId 3b1ec33425
// API key 52655023189b6da8983acfa3d778dd2b-us21