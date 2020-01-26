const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const accountSchema = new mongoose.Schema(
    {
        startup_name:{
            type:String,
            required:true,
            trim:true
        },
        startup_category:{
            type:String,
            required:true,
            trim:true
        },
        full_name:{
            type:String,
            required:true,
            trim:true
        },
        job_position:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            lowercase:true
        },
        password:{
            type:String,
            required:true,
            minlength:6,
            trim:true
        },
        tokens:[
            {
                token:{
                    type:String,
                    required:true
                }
            }
        ],
        confirmed:{
            type:Boolean,
            default:false
        }
    }
)


accountSchema.methods.generateAuthToken= async function(){
    const account = this
    const token = jwt.sign({_id:account._id.toString()},'my_secret')

    account.tokens = account.tokens.concat({token})
    await account.save()

    return token
}

const Account = mongoose.model('Account',accountSchema)
module.exports = Account