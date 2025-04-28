const constants = require('../constants');
const { SECRET,EMAIL,EMAILPASSWORD } = constants;
const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
let jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configuration for the mailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service
  auth: {
    user: EMAIL,
    pass: EMAILPASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});
exports.authController = {

    async forgetPassword(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ "message": "Email is required" });
        }

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ "message": "User not found" });
                }

                // Generate a 6-digit OTP
                const otp = crypto.randomBytes(3).toString('hex').toUpperCase();

                // Store the OTP in the user's document with an expiration time, e.g., 15 minutes
                user.resetPasswordToken = otp;
                user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

                user.save().then(() => {
                    // Send the OTP via email
                    const mailOptions = {
                        from: 'fadikanane@gmail.com',
                        to: user.email,
                        subject: 'Password Reset',
                        text: `Your OTP for password reset is: ${otp}`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ "message": "Error sending email" });
                        } else {
                            res.json({ "message": "An OTP has been sent to your email" });
                        }
                    });
                });
            })
            .catch(err => {
               errorLogger.error(err);
                res.status(500).json({ "message": "Error finding user" });
            });
    },
    async resetPassword(req, res) {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ "message": "All fields are required" });
        }

        User.findOne({ email: email, resetPasswordToken: otp, resetPasswordExpires: { $gt: Date.now() } })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ "message": "Invalid or expired OTP" });
                }

                // Update the user's password and clear the reset token and expiration
                user.password = bcrypt.hashSync(newPassword, 8);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save().then(() => {
                    res.json({ "message": "Password has been updated" });
                });
            })
            .catch(err => {
               errorLogger.error(err);
                res.status(500).json({ "message": "Error resetting password" });
            });
    }
};