import mongoose from "mongoose";
import Mongoose from "mongoose";

const EquipmentSchema = new Mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            min: 3
        },
        description: {
            type: String,
            required: true,
            min: 10
        },
        age: {
            type: String,
            required: true
        },
        rent: {
            type: Number,
            required: true
        },
        timeperiod: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        renterid: {
            type: String,
            required: false
        },
        borrowerid:{
            type:String,
        },
        borrower:{
            username:{
                type:String
            }
        },
        agreement:{
            from:{
                type:String
            },
            to:{
                type:String
            }
        },
        image: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true,
            max: 20,
            min: 2
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isRented: {
            type: Boolean,
            default: false,
        },
        unavailableUntil: {
            type: Date,
            default: null,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    
    }, { timestamps: true }
)


const Equipment = Mongoose.model("Equipment", EquipmentSchema);
export default Equipment;