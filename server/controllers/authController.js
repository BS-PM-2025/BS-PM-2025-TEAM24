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

    signupcos(req, res) {
        infoLogger.info("Costumer signup");
        const { name, email, age, gender, password, city,street, houseNumber } = req.body;
        if (name, email, age, gender, password, city,street, houseNumber) {
            let IsWorker = false; 
            let WorkType = "None"; 
            let IsAdmin = false;
            User.findOne({ email: email })
                .then((user) => {
                    if (user) {
                        errorLogger.error("this email is already exists");
                        res.status(400).json({ "message": "this email is already exists" });
                    }
                    else {
                        // Prepare the user data object

                        let userData = {
                            name,
                            email,
                            age,
                            city,
                            street, 
                            houseNumber,
                            gender,
                            password: bcrypt.hashSync(password, 8),
                            isAdmin:IsAdmin,
                            isWorker:IsWorker,
                            workType:WorkType,
                            userCalls: [],
                        };                        

                        // Create a new user instance with the prepared data
                        const newUser = new User(userData);

                        newUser.save()
                            .then(result => {
                                infoLogger.info(`Adding User  :${req.body.name} is successfully`);
                                res.json(result);
                            })
                            .catch(err => {
                                errorLogger.error(`Error Adding User `);
                                res.status(400).json({ "message": `Error Adding User ` });
                            });
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error User user ` });
                });
        }
        else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },

    signupwor(req, res) {
        infoLogger.info("Worker signup");
        const { name, email, age, gender, password, workType, city,street, houseNumber} = req.body;
        if (name, email, age, gender, password, workType, city,street, houseNumber) {
            let IsWorker = true;
            let IsAdmin = false;
            let Description = ''
            User.findOne({ email: email })
                .then((user) => {
                    if (user) {
                        errorLogger.error("this email is already exists");
                        res.status(400).json({ "message": "this email is already exists" });
                    }
                    else {
                        // Prepare the user data object

                        let userData = {
                            name,
                            email,
                            age,
                            city, 
                            street, 
                            houseNumber,
                            gender,
                            password: bcrypt.hashSync(password, 8),
                            isAdmin:IsAdmin,
                            isWorker:IsWorker,
                            workType,
                            description:Description,
                            userCalls: [],
                            workerCalls: [],
                        };

                        // Create a new user instance with the prepared data
                        const newUser = new User(userData);

                        newUser.save()
                            .then(result => {
                                infoLogger.info(`Adding User  :${req.body.name} is successfully`);
                                res.json(result);
                            })
                            .catch(err => {
                                errorLogger.error(`Error Adding User `);
                                res.status(400).json({ "message": `Error Adding User ` });
                            });
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error User user ` });
                });
        }
        else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    } 
};