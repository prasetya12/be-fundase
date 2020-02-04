const express = require('express')
const Account = require('../models/account')
const router = new express.Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const ObjectId = require('mongodb').ObjectID
const jwt = require('jsonwebtoken')


router.post('/register',async(req,res)=>{
    if(!req.body){
        return res.status(400).send("Request Body is Empty")
    }

    //Check if user already exists
    Account.findOne({
        email:req.body.email
    }).then(doc=>{
        if(doc){
            res.status(200).json({
                token:"",
                error:`The email address ${doc.email} is already in use`
            })
        }else{
            try{
                const account = new Account({
                    ...req.body
                })
    
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(account.password,salt,async (err,hash)=>{
                        if(err) throw err;
                        account.password = hash;
                       const token =  await account.generateAuthToken()
                        account.save().then(account=>{
                            const transporter = nodemailer.createTransport({
                                service : "gmail",
                                auth:{
                                    user:"rizal.prasetya11@gmail.com",
                                    pass:"rizal123"
                                }
                            })

                            const mailOptions = {
                                from:'rizal.prasetya11@gmail.com',
                                to:"rizalprasetya22@gmail.com",
                                subject:"New Account",
                                text:"account",
                                html:"<h1>hello</h1>"
                            }

                            transporter.sendMail(mailOptions,(error,info)=>{
                                if(error){
                                    console.log(error,'error')
                                }else{
                                    console.log(info,'info')
                                }
                            })


                            res.status(201).send({account,token})
                        })
                    })
                })
            }catch(e){
                res.status(400).send(e)
            }


        }
    })
    

    
})

router.get('/verification/:id/:token',async(req,res)=>{
    const id = req.params.id
    const token = req.params.token 

    console.log(token,'token')
    Account.findOne({
        "_id":ObjectId(id),
    }).then(doc=>{
        jwt.verify(token,'my_secret',async function(err,token){
            if(err){
                res.status(400).send(err)
            }else{
                if(doc.confirmed){
                    res.status(400).send({
                        "success":false,
                        "message":"Your Email Already verify, Please Login"
                    })
                }else{
                    // const update = await Account.where({ "_id":ObjectId(id)}).update({ confirmed: true })
                    const update = await Account.findOneAndUpdate({ "_id":ObjectId(id)},{confirmed:true})
                    console.log(update)
                    const newAccount = await Account.findOne({"_id":ObjectId(id)})
                    res.status(200).send({
                        success:true,
                        message:"Please Login",
                        data:newAccount
                    })
                }
            }
        })
    })
})

router.get('/resend/:id',async(req,res)=>{
    const id = req.params.id
    Account.findOne({
        "_id":ObjectId(id)
    }).then(async doc=>{
        if(doc.confirmed){
            res.status(200).json({
                error:`The email address ${doc.email} is already in use`
            })
        }else{
            try{
                
                const token = doc.generateAuthToken();
                const account = await Account.findOne({"_id":ObjectId(id)})
                console.log(account,'account')                
                const url = `http://localhost:4000/verification/${id}/${token}`



                const transporter = nodemailer.createTransport({
                    service:"gmail",
                    auth:{
                        user:"rizal.prasetya11@gmail.com",
                        pass:"rizal123"
                    }
                })


                const mailOptions={
                    from:"rizal.prasetya11@gmail.com",
                    to:"rizalprasetya22@gmail.com",
                    subject:"Resend Verification",
                    text:"account",
                    html:"Please verification your account <a href="+url+">link</a>"
                }

                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        console.log(error,'error')
                    }else{
                        console.log(info,'info')
                    }
                    
                })

                

                console.log(account,'account')
                res.status(201).send({account,token})
            }catch(e){
                console.log(e)
            }

        }
    })
})

module.exports = router