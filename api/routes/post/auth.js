let express = require('express');
let router = express.Router();

let User = require('../../models/User');


router
    .post('/auth/signin', (req, res) => {
        console.log("==============POST SIGNIN============", req.body);
        User.signin({ email: req.body.email, mot_de_passe: req.body.mot_de_passe }, users => {
            console.log("result", users);
            if( users.length === 0 ) return res.json({ status: 'NO', message: "Check your inputs:"})
            else users.forEach(user => {
                return res.json({
                    status: 'OK',
                    token: user.id_user,
                    nom: user.nom
                });
            });
        } );
    })
    .post('/auth/signup', (req, res) => {
        console.log("==============POST SIGNUP============", req.body);
        let { nom, email, num_tlf, mot_de_passe } = req.body;
        // check & valide a inputs
        User.insert({ nom, email, num_tlf, mot_de_passe }, user => {
            console.log("insert new user response", user);
            res.json(user);
        });
    })

module.exports = router;