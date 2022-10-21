
const User = require("../../models/User");
const admin = require("firebase-admin");
const axios = require("axios");
const getUserUidFromToken = require('../../utils/getUidFromToken');

const googleSignIn = async (req, res) => {
    const { idToken } = req.body;

    const { data } = await axios.post(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    const { email, sub, name, picture } = data;
    console.log('user email= ', user) 
    const user = await User.findOne({ email: email });
    console.log('user data= ', data)
    console.log('user in mongoDB= ', user)
    if (user) {
        // const token = await admin.auth().createCustomToken(user.id.toString());
        return res.status(200).json({ registered: true, accessToken:idToken, user });
    } else {
        const {uid} = await admin.auth().getUserByEmail(email)
        if(uid){
            const token = await admin.auth().createCustomToken(uid);
            const newUser = await User.create({
                id: uid,
                name,
                email,
                profileImgUri: picture,
                });
            await newUser.save();
           return res.status(200).json({ newUser, token });
        }
    }
}

module.exports = googleSignIn