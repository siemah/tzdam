let express = require('express');
let router = express.Router();

let User = require('../../models/User');


router
    .post('/user/:token', (req, res) => {
        console.log("==============POST USER============", req.body);
        let { oldPassword, newPassword, confirmation } = req.body;
        if( oldPassword.length >= 6 && newPassword.length >= 6 && confirmation === newPassword ) {
            User.changeUserPassword(
                newPassword,
                req.params.token,
                oldPassword,
                response => {
                    if( response.affectedRows === 1 )
                        res.json({
                            status: 'OK',
                            message: 'You have successfully changed your password'
                        });
                    else 
                        res.json({
                            status: 'NO',
                            message: 'Check your inputs!'
                    })
                }
            )
        } else res.json({
            status: 'NO',
            message: 'Check your inputs'
        })
        
    });

module.exports = router;