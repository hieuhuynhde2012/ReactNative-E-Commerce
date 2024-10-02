const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:Array,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    thumb:{
        type:String,
        default:'',
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        default:0,
    },
    sold:{
        type:Number,
        default:0,
    },
    images:{
        type:Array,
    },
    color:{
        type:String,
        default:'default',
    },
    ratings:[
        {
            star: {type: Number},
            postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
            comment: {type: String},
            updatedAt: {type: Date},
        }
    ],
    totalRating:{
        type:Number,
        default:0,
    },
    variant:[
        {
            color: {type: String},
            price: {type: Number},
            thumb: {type: String},
            images: {type: Array},
            title: {type: String},
            sku: {type: String},
        }
    ]
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);