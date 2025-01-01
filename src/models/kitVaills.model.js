import mongoose from "mongoose"; 

const kitVaillsSchema = new mongoose.Schema({
    index:{
        type: Number,
        required: true,
        unique: true,
        min: 1 // Added a minimum value constraint
    },
    kitCode:{
        type:Number,
        required:true
    },
    kitType:{
        type:String,
        enum: ["NS", "IP"],
        required:true
    },
    siteId:{
        type:String,
        required:true
    },
    kitStatus:{
        type:Number,
        enum:[0,1,2,3],
        required:true,
        default:0
    },
    kitCreatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    kitApproved:{
        type:Number,
        enum:[0,1,2],
        default:0,
        required:true
    },
    kitApprovedBy:{
        type:String,
        default:null
    },
    kitApprovedAt:{
        type:Date,
        default:null
    },
    kitDispatchBy:{
        type:String,
        default:null
    },
    kitDispatchAt:{
        type:Date,
        default:null
    },
    kitDiscardBy:{
        type:String,
        default:null
    },
    kitDiscardAt:{
        type:Date,
        default:null
    },
    kitSubId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        default:null
    },
    kitRejectRemarks:{
        type:String,
        default:null
    }
    
},{timestamps:true});

const KitVaills = mongoose.models.KitVaills || mongoose.model("KitVaills",kitVaillsSchema)

export default KitVaills;