let connection = require('../config/db');

class Transfer {

    /**
     * transfer money from to another
     */
    static transaction( data, cb ) {
        console.log(data);
        connection.query(
            'SELECT Num_Carte_Institution, Solde_Compte_Institution From compte_institution WHERE Num_Carte_Institution = ? AND Code_Securité_Compte_Institution = ? ',
            [data.cardNumSender, data.securityCode ],
            (error, result) => {
                if( error ) throw error;
                cb(result);
            }
        )
    }

    /**
     * 
     * @param {String} Num_Carte_Institution num carte de sender
     * @param {String} Code_Securité_Compte_Institution 4 chiffre de secure code
     * @param {Number} balance la somme a transferer
     * @param {Function} cb function a execute
     */
    static decreaseBalance(Num_Carte_Institution, Code_Securité_Compte_Institution, balance, cb) {
        console.log(balance);
        connection.query(
            'UPDATE compte_institution SET Solde_Compte_Institution = ? WHERE Num_Carte_Institution=? AND Code_Securité_Compte_Institution=?',
            [balance, Num_Carte_Institution, Code_Securité_Compte_Institution],
            (error, result) => {
                if( error ) throw error;
                cb(result);
            }
        )
    }

    static increaseBalance(Num_Carte_Institution, balance, cb) {
        connection.query(
            'UPDATE compte_institution SET Solde_Compte_Institution = Solde_Compte_Institution + ? WHERE Num_Carte_Institution=? ',
            [balance, Num_Carte_Institution],
            (error, result) => {
                if (error) throw error;
                cb(result);
            }
        )
    }


    static saveTransferDetails(sender, receiver, type, somme, token, cb ) {
        connection.query(
            'INSERT INTO paiement VALUES(NULL, ?, ?, ?, NOW(), ?, ?)',
            [ sender, receiver, type, somme, token ],
            (err, res) => {
                if(err) throw err;
                cb(res);
            }
        )
    }

    static getTransactionsHistory(token, cb) {
        connection.query(
            'SELECT Id_paiement, num_Carte_Client, num_Carte_destinataire, date_paiement, somme, Type_Carte_Compte_Institution\
            FROM paiement WHERE paiement.id_user = ? ORDER BY Id_paiement DESC',
            [token],
            (err, res) => {
                if( err ) throw err;
                cb(res)
            }
        )
    }


}

module.exports = Transfer;