import User from "../Models/User.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export const register = {
    validator: async (req, res, next) => {
        const errors = [];

        if (!req.body.mobile) {
            errors.push("Mobile number is required");
        }

        if (!req.body.email) {
            errors.push("Email address is required");
        }

        if (!req.body.password) {
            errors.push("Password is required");
        } else if (req.body.password.length < 8) {
            errors.push("Password must be at least 8 characters");
        }

        if (!req.body.account_type) {
            errors.push("Account type is required");
        } else if (req.body.account_type === "company" && !req.body.company_name) {
            errors.push("Company name is required for company accounts");
        } else if (req.body.account_type === "user" && (!req.body.lname || !req.body.fname)) {
            errors.push("First name and last name are required for user accounts");
        }

        if (!req.body.address) {
            errors.push("Address is required");
        }

        if (!req.body.city) {
            errors.push("City is required");
        }

        if (!req.body.state) {
            errors.push("State is required");
        }

        if (!req.body.postal_code) {
            errors.push("Postal code is required");
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        next();
    },
    controller: async (req, res) => {
        try {
            const newUser = await User.create({
                mobile: req.body.mobile,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                account_type: req.body.account_type,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                postal_code: req.body.postal_code,
                password: req.body.password
            })
            const { password, ...other } = newUser._doc;
            return res.status(200).send({
                "message": "Account Creation Successful",
                ...other
            });
        }
        catch (e) {
            console.log(e);
            if (e.keyValue?.email) {
                return res.status(409).send("Email Address Already Exists");
            }
            else if (e.keyValue?.mobile) {
                return res.status(409).send("Mobile Number Already Exists");
            }
            else {
                return res.status(500).send("Registration Failed");
            }
        }
    }
}

export const login = {
    validator: async (req, res, next) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send("Please Fill all the Fields");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findUser = await User.findOne({
                email: req.body.email
            });
            if (findUser == null) {
                return res.status(400).send("Invalid Credintials !!");
            }
            if (findUser.email !== req.body.email) {
                return res.status(400).send("Invalid email !!");
            }

            if (findUser.password !== req.body.password) {
                return res.status(400).send("Invalid password !!");
            }

            const accessToken = JWT.sign(
                {
                    id: findUser._id,
                },
                process.env.JWT_SEC_KEY,
                { expiresIn: "3d" }
            );

            const { password, ...others } = findUser._doc;

            return res.status(201).json({
                "success": true,
                ...others,
                accessToken
            });

        }
        catch (e) {
            return res.status(500).send("Login Failed Internal Server Error");
        }
    }
}