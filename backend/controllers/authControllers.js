const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {transporter}=require('../config/nodemailer');
dotenv.config();
const register = async (req,res)=>{
    const {name,email,password}=req.body;
    if(!name|| !email || !password){
        return res.status(400).json({message:"all fields are required"});
    }

    try {
        const exisingUser = await userModel.findOne({email});
        if(exisingUser){
            res.status(400).json({message:"user already exists"});
        }
     

        const hashedpassword = await bcrypt.hash(password,10);
        const User = new userModel({
            name,email,password:hashedpassword

        })

        await User.save();
        

        const token = jwt.sign({id:User._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token', token, {
            httpOnly: true, // Prevents the cookie from being accessed via JavaScript
            secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
            sameSite: 'None', // Ensures the cookie is sent in cross-site requests (required for Safari)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
          });
          console.log("Token sent:", token);


        const mailOptions ={
            from:process.env.MAILER_USER,
            to:email,
            subject:'Welcome to Greatstack',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #2e6c80;">Welcome, ${name}!</h2>
                <p>Thank you for signing up for <strong>Your Company</strong>. We're thrilled to have you on board.</p>
                <p>Here’s what you can do next:</p>
                <ul>
                    <li>Explore your dashboard</li>
                    <li>Customize your profile</li>
                    <li>Start using our features right away</li>
                </ul>
                <p>If you have any questions, feel free to reply to this email.</p>
                <br>
                <p>Cheers,<br>The Your Company Team</p>
            </div>
        `,
        text: `Welcome, ${name}!\n\nThank you for signing up for Your Company.\n\nWe're thrilled to have you. Start exploring your dashboard, customizing your profile, and using our features.\n\nCheers,\nThe Your Company Team`
        }
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.warn("Email failed to send:", emailError.message);
            // optionally continue
        }
        

       return res.status(200).json({message:'user added successfully'})

        
    } catch (error) {

      return  res.status(400).json({success:false,message:error.message})
        
    }

}
const Login = async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400).json({message:"all fields are required"});

    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"email is not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid password"})
        }
        const token = jwt.sign({id: user._id },process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token', token, {
            httpOnly: true,   // Prevent JavaScript access to the cookie
            secure: false,    // In development, use false (set to true for production)
            sameSite: 'Lax',  // Or 'None' if doing cross-origin authentication
            maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expiration (7 days)
          });
          
          
        res.status(200).json({success:true,message:"user is successfully logged in"})
        
    } catch (error) {

        return res.status(400).json({message:error.message});
        
    }
}
const Logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'strict',

        });

        return res.status(200).json({success:true,message:"user logged out successfully"})


        
    } catch (error) {
        return res.status(400).json({message:error.message});
        
    }
}
const sendverifyOTP = async(req,res)=>{
    try {
        const userId = req.user.id;
        
        const user = await userModel.findById(userId);
        const email = user.email;
        if(user.isAccountVerified){
            return res.json({success:false,message:'Account already verified'});
        }
        const OTP = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOTP = OTP;
        user.verifyOTPExpiresAt = Date.now() + 24 *60 *60 *1000
        await user.save();

        const mailOptions = {
            from:process.env.MAILER_USER,
            to:email,
            subject: 'Your OTP Code for Verification',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Verify Your Email</h2>
              <p>Thank you for signing up. Use the following One-Time Password (OTP) to verify your email address:</p>
              <h3 style="color: #2e6c80;">${user.verifyOTP}</h3>
              <p>This code will expire in 10 minutes.</p>
              <p>If you did not request this, please ignore this email.</p>
              <br>
              <p>Best regards,<br>Your App Name Team</p>
            </div>
          `
        }
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.warn("Email failed to send:", emailError.message);
            // optionally continue
        }

        res.status(200).json({success:true,message:'Verification OTP sent on email'})


    } catch (error) {
        return res.status(400).json({message:error.message});
        
    }
  
}
const verifyEmail = async (req, res) => {
    const { id: userId } = req.user; 
    // Ensure req.user is populated
    const { otp } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID missing' });  // Clearer error message for missing userId
    }
  
    if (!otp) {
      return res.status(400).json({ message: 'OTP missing in the request body' });  // Clearer error for missing OTP
    }
  
    try {
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      if (user.verifyOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Update user details
      user.isAccountVerified = true;
      user.verifyOTP = ''; // Clear OTP
      user.verifyOTPExpiresAt = 0; // Reset OTP expiration time
      await user.save();
  
      return res.status(200).json({ success: true, message: "Email verified successfully" });
  
    } catch (error) {
      console.error(error);  // Log the error for easier debugging
      return res.status(400).json({ message: error.message });
    }
  };
  
// reset OTP for password 
const sendResetOTP=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.status(400).json({message:'email not found'})

    }
    try {
        const User = await userModel.findOne({email});
        if(!User){
            return res.json({success:false,message:'user not found'});
        }
        const OTP = String(Math.floor(100000 + Math.random() * 900000))

        User.resetOTP = OTP;
        User.resetOTPExpiresAt = Date.now() + 15 *60 *1000
        await User.save();

        const mailOptions = {
            from:process.env.MAILER_USER,
            to:email,
            subject: 'Your Reset OTP Code for Verification',
            html: `
           <div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Reset Your Password</h2>
  <p>We received a request to reset your password. Use the following One-Time Password (OTP) to reset your password:</p>
  <h3 style="color: #2e6c80;">${User.resetOTP}</h3>
  <p>This code will expire in 10 minutes.</p>
  <p>If you did not request this, please ignore this email. Your account remains secure.</p>
  <br>
  <p>Best regards,<br>Your App Name Team</p>
</div>
          `
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({message:'OTP sent to your email'});
       

        
    } catch (error) {
        return res.json({message:error.message})
        
    }
}
const ResetPassword = async(req,res)=>{
    const {email,otp,newPassword}=req.body;
    if(!email || !otp ||!newPassword){
        return res.json({message:'Email,otp,password is missing'})
    }
    try {
        const User = await userModel.findOne({email})
        if(!User){
            return res.json({success:false,message:'user not found'});
        }
        if(User.resetOTP!==otp){
            return res.json({message:'Invalid OTP'})
        }
        const hashedpassword =await bcrypt.hash(newPassword,10);

        User.password=hashedpassword;
        User.resetOTP=otp;
        User.resetOTPExpiresAt=0;
        await User.save();
        return res.status(200).json({message:"password has been reset successfully"});


        
    } catch (error) {
        return res.json({message:error.message})
        
    }
}

module.exports={register,Login,Logout,sendverifyOTP,verifyEmail,sendResetOTP,ResetPassword}