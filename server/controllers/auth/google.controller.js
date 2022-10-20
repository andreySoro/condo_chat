const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const User = require("../../models/User");

const googleSignIn = async (req, res) => {
        const ticket = await client.verifyIdToken({
            idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMWI5Zjg4Y2ZlMzE1MWRkZDI4NGE2MWJmOGNlY2Y2NTliMTMwY2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNTg3MTYyNzI1NjUtcTlhdDJmbmFoaDI5aGZnc20yNmhsaGxwZG5zNmJoNnQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNTg3MTYyNzI1NjUtaHZhMHMxaDN1anA0aTVndDR2djdiM21kbXNkOGJvaWouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NDg5NTQyMjU0OTM2NTQ1MDYiLCJlbWFpbCI6InNoYWRvdzE5OHJ1c0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlZvamQgTmFyb2RhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTFocFc1bmpDTnNOUk5DWWZtemZIdG1UTkxpcVlLcGxTU1Q0SlluV0E9czk2LWMiLCJnaXZlbl9uYW1lIjoiVm9qZCIsImZhbWlseV9uYW1lIjoiTmFyb2RhIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NjYyODYxMDUsImV4cCI6MTY2NjI4OTcwNX0.MMAhzZoussBTWynntFHVisVWWSki2GvqOBYqfVIoFeEw8bVTm9_NsB1ZIIJHcfCp4_E_p3URmV18r4f6_F7xa8GkRHNZg8sHgV0ZBD1h2n6BK7Oz0QPZT34Vi0gs5gObZCPDPn4Ak62KpL7PM-CNi8zcLOkpNfv76t06Q_sRJ5jMkA-snC8linFkmliIBq1yuXmZhZf7XX3K93emEc4xpIskWUbYBN3psLCIlUoDOIH0azldJX7M3Ds0O6XEf29NhNN6oP34L0N0DAQetbW6hvxwWAhYIVlQ5_UH2a_yVZlLvV_VicGUf9Hf1ibHI9fB0wctEG3IX-aChnDR-LYp7A",
            audience: CLIENT_ID,
        })
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log('USER ID = ', userid);
        // if(userid){
        //     res.status(200).json({
        //         message: 'User Signed In',
        //         data: payload
        //     })
        // }
        const doesUserExist = await User.findOne({email: payload.email});
       console.log(OAuth2Client.getAccessToken());
}

module.exports = googleSignIn