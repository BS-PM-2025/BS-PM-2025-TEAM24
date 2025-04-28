const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

exports.usersController = {
    getUserDetails(req, res) {
        infoLogger.info(`Get User id:${req.params.id}`);
        User.findOne({ _id: req.params.id })
            .then((user) => {
                if (user) {
                    res.json(user)
                }
                else {
                    errorLogger.error("Wrong user id please enter correct id");
                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                }
            })
            .catch(err => {
                errorLogger.error(`Error Getting user from db:${err}`);
                res.status(500).json({ "message": `Error getting user ` });
            });
    },
    async editUserDetails(req, res) {
        infoLogger.info("Updating a user");
    
        try {
            const user = await User.findOne({ _id: req.params.id });
            if (!user) {
                errorLogger.error(`User not found with id: ${req.params.id}`);
                return res.status(404).json({ "message": "User not found" });
            }
    
            // Check if the old password is correct before allowing updates
            if (req.body.oldPassword) {
                const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
                if (!isMatch) {
                    errorLogger.error(`Old password does not match for user no: ${req.params.id}`);
                    return res.status(400).json({ "message": "Old password is incorrect" });
                }
    
                // If there's a new password, hash it
                if (req.body.password) {
                    req.body.password = bcrypt.hashSync(req.body.password, 8);
                }
            }
    
            // Prepare the update object, excluding oldPassword from the update
            const updateData = { ...req.body };
            delete updateData.oldPassword; // Remove oldPassword as it's not part of the User model
    
            const updateResult = await User.updateOne({ _id: req.params.id }, { $set: updateData });
    
            if (updateResult.matchedCount > 0) {
                infoLogger.info(`User details update for user no:${req.params.id} is successfully`);
                res.json({ "message": `User details update for user no:${req.params.id} is successfully` });
            } else {
                errorLogger.error("No matching user found to update");
                res.status(400).json({ "message": "No matching user found to update" });
            }
        } catch (err) {
            errorLogger.error("Error updating user details", err);
            res.status(500).json({ "message": "Error updating user details", error: err });
        }
    },    
   
    async updatePassword (req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            
            // Find user by ID from token
            const user = await User.findById(req.userId);
            if (!user) {
            return res.status(404).json({ message: "User not found" });
            }
        
            // Verify current password
            const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
            if (!isPasswordValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
            }
        
            // Hash and update new password
            const hashedPassword = bcrypt.hashSync(newPassword, 8);
            user.password = hashedPassword;
            await user.save();
        
            res.json({ message: "Password updated successfully" });
        } catch (error) {
            console.error("Error updating password:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
}
