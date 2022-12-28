require("dotenv").config();
const express = require('express');
const router = express.Router();
const User = require('../models/User')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const client =require('../connection')


router.post('/login', async (req,res) =>{
    if(!req.body.login || !req.body.password )  {
        res.status(400).json({err:"Bad request"})
        return;
    }

    User
        .findOne({name:req.body.login})
        .then( user => {
            if(!bcrypt.compareSync(
                req.body.password,
                user.password
            )){
            res.status(400).json({err: "Credential is invalid"});
        }else{
            const userInfo = {
                _id: user._id.toString(),
                name: user.name,
                role: user.role
            }
            const accessToken = jwt.sign(userInfo,process.env.JWT_ACCESS_SECRET,{expiresIn:"1m"})
            const refreshToken = jwt.sign(userInfo,process.env.JWT_REFRESH_SECRET,{expiresIn:"15d"})
            
            client
                .set(`refreshToken:${refreshToken}`, '1')
                .then(() => {
                    res.status(200).json(
                        {
                            accessToken,
                            refreshToken
                        }
                    );
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({err: "Refresh token generation error"})
                })
        }
    })
})

router.post('/renew', async (req,res) =>{

    if(!req.body.refreshToken)  {
        res.status(400).json({err:"Bad request"})
        return;
    }

    const refreshToken = req.body.refreshToken

    client
        .exists(`refreshToken:${refreshToken}`)
        .then((result) => {
            if(result){
                try {
                    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

                    User
                        .findOne({_id:decoded._id})
                        .then(user => {
                            const accessToken =jwt.sign({
                                _id:user._id,
                                name:user.name,
                                role:user.role
                            },process.env.JWT_ACCESS_SECRET,{expiresIn:"1m"})
                            res.status(201).json({accessToken})
                        })
                        .catch(() => {
                            res.status(404).json({err:"User is not found"})
                        })
                    } catch(err) {
                        client.del(`refreshToken:${refreshToken}`)
                        res.status(401).json({err:"REFRESH_TOKEN is invalid"})
                    }
            }else {
                res.status(401).json({err:"REFRESH_TOKEN is invalid"})
            }  
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({err:"Renew error"})
        })
})

router.post('/logout', async (req,res) =>{

    if(!req.body.refreshToken)  {
        res.status(400).json({err:"Bad request"})
        return;
    }

    const refreshToken = req.body.refreshToken;
    client
        .exists(`refreshToken:${refreshToken}`)
        .then(result => {
            if(result){
                client
                .del(`refreshToken:${refreshToken}`)
                .then(() => res.status(200).json())
            }else{
                res.status(401).json({err:"REFRESH_TOKEN is invalid"})
            }
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({err:"Logout error"})
        })
})

module.exports = router;