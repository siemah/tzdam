let connection = require('../config/db');

class User {

  /**
   * 
   * @param {Object} data contain a data to register into DB
   * @param {Function} cb callback exec when user success signup 
   */
  static signin( data, cb ) {
    let { email, mot_de_passe } = data;
    connection.query(
      'SELECT nom, id_user, email FROM user_inscription WHERE email = ? AND mot_de_passe = ?',
      [email, mot_de_passe],
      (err , users) => {
        if( err ) throw err;
        cb( users )
      }
    )
  }

  /**
   * @param {Object} data is a some data to insert to DB like email, pass...
   * @exec a cb funcction
   */
  static insert ( data, cb ) {
    let { nom, email, num_tlf, mot_de_passe } = data;
    connection.query(
      'INSERT INTO user_inscription (nom, num_tlf, mot_de_passe, email) VALUES(?, ?, ?, ?)',
      [ nom, num_tlf, mot_de_passe, email ],
      (err, res) => {
        if( err ) throw err;
        cb(res);
      }
    )
  }

  /**
   * @param {Function} cb callback function 
   */
  static getAllUsers ( cb ) {
    connection.query(
      'SELECT * FROM user_inscription',
      null, 
      (err, res) => {
        if( err ) throw err;
        cb(res);
      }
    )
  }

  /**
   * 
   * @param {String} oldPassword old password of current user
   * @param {String} newPassword new password of this user
   * @param {Function} cb callback exec 
   */
  static changeUserPassword ( newPassword, token, oldPassword, cb ) {
    connection.query(
      'UPDATE user_inscription SET mot_de_passe = ? WHERE id_user = ? AND mot_de_passe = ?',
      [ newPassword, token, oldPassword ],
      (err, res) => {
        if (err) throw err;
        cb(res);
      }
    )
  }


}

module.exports = User;