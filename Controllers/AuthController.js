import User from "../Models/User.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export const register = {
    validator: async (req, res, next) => {
        if (!req.body.mobile || !req.body.email || !req.body.password || !req.body.account_type || !req.body.address ||
            !req.body.city||
            !req.body.state || 
            !req.body.postal_code ) {
            return res.status(400).send("Please Fill all the Fields");
        }
        if (req.body.account_type === "company" && !req.body.company_name) {
            return res.status(400).send("Company name is Required");
        }
        if (req.body.account_type === "user" && (!req.body.lname || !req.body.fname)) {
            return res.status(400).send("Please Fill Name's the Fields");
        }
        if (req.body.password.length < 8) {
            return res.status(400).send("Password must be atleast 8 characters");
        }
        if (!req.body.password) {
            return res.status(400).send("Password and Confirm Password Field Must be Same");
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