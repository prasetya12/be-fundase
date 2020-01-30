const express = require('express')
const Account = require('../models/account')
const router = new express.Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

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
                                    user:"your.email",
                                    pass:"your.password"
                                }
                            })

                            const mailOptions = {
                                from:'your.email',
                                to:"email.sendto",
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
    

    // const account = new Account({
    //     ...req.body
    // })

    // try{
    //     await account.save()
    //     const token = await account.generateAuthToken()
    //     res.status(201).send({account,token})
    //     console.log(token)
    // }catch(e){
    //     res.status(400).send(e)
    // }
})

module.exports = router