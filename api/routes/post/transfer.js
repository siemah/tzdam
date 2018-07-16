let express = require('express');
let router = express.Router();

let Transfer = require('../../models/Transfer');


router
    .get('/transfer', (req, res) => {
        console.log("==============POST TRANSFER============", req.body);
        res.json({'transfer': 15})
    })
    .post('/transfer/:token', (req, res) => {
        let { cardNumSender, cardNumReceiv, cardType, somme, ID, securityCode } = req.body;
        let { token } = req.params;
        //console.log("req", req.body );
        Transfer.transaction(
            { cardNumSender, cardNumReceiv, cardType, somme, ID, securityCode },
            (result) => {
                //console.log("result----->", result);
                let { Solde_Compte_Institution } = result.length ? result[0] : 0;
                if(Solde_Compte_Institution > somme){
                    let newSomme = Solde_Compte_Institution - somme;
                    // diminuer la somme de compte de sender
                    Transfer.decreaseBalance(
                        cardNumSender, securityCode, newSomme,
                        (result) => {
                            if ( result.affectedRows === 1 ){
                                Transfer.increaseBalance(
                                    cardNumReceiv, somme,
                                    (result) => {
                                        if (result.affectedRows === 1) {
                                            Transfer.saveTransferDetails(
                                                cardNumSender, cardNumReceiv, cardType,somme, token,
                                                result => {
                                                    console.log(result);
                                                    res.json({
                                                        status: 'OK',
                                                        message: 'You have transferred a sum of money ' + somme
                                                    })
                                                }
                                            )
                                        }
                                        else res.json({
                                            status: 'NO',
                                            message: 'Check the receiver account num card'
                                        })
                                    }
                                );
                            }
                            else res.json({
                                status: 'NO',
                                message: 'Iternal error'
                            })
                        }
                    );
                } 
                else res.json({
                    status: 'NO',
                    message: 'Your balance is lessthan the sum you want to transfer'
                });
            }
        );
    });

module.exports = router;