const jwt=require('jsonwebtoken');
const sendcookie = (res, user,message,statuscode=200) => {
    const token=jwt.sign(
        {_id :user._id}, process.env.JWT_SECRET
    );
  res.status(statuscode).cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: "true",
        sameSite: "none",

    })

}
module.exports = sendcookie;