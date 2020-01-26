const express = require('express')
const Account = require('../models/account')
const router = new express.Router()

router.post('/account',async(req,res)=>{
    console.log(req)
    const account = new Account({
        ...req.body
    })

    try{
        await account.save()
        const token = await account.generateAuthToken()
        res.status(201).send({account,token})
        console.log(token)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router