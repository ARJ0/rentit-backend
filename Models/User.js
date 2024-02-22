import Mongoose from "mongoose";

const UserSchema = new Mongoose.Schema(
    {
        company_name: {
            type: String,
            max: 50
        },
        fname: {
            type: String,
            max: 50
        },
        lname: {
            type: String,
            max: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50
        },
        account_type: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
            max: 9999999999,
            min: 1000000000
        },
        address: {
            type: String,
            required: true,
            max: 50,
            min: 2
        },
        city: {
            type: String,
            required: true,
            max: 20,
            min: 2
        },
        state: {
            type: String,
            required: true,
            max: 20,
            min: 2
        },
        postal_code: {
            type: String,
            required: true,
            max: 20,
            min: 2
        },
        password: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)


const User = Mongoose.model("User", UserSchema);
export default User;