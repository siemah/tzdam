let express = require('express');
let router = express.Router();

let Transfer = require('../../models/Transfer');

router.get(
    '/transfer/:token',
    (req, res) => {
        Transfer.getTransactionsHistory(
            req.params.token,
            response => {
                res.json({
                    status: 'OK',
                    response
                })
            }
        )
    }
)

module.exports = router;
