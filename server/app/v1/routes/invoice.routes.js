const express = require("express");
const controllers = require("../controllers/invoice.controller.js");
const router = express.Router();
const validation = require("../validations/invoice.validation.js");
const {authAdmin} = require('../middleware/authentication.js')

router.post('/createInvoice',validation.addInvoice,authAdmin,controllers.createInvoice);
router.get('/userInvoiceList/:id',controllers.userInvoiceList);
router.put('/updateStatus/:id',validation.updateStatus,authAdmin,controllers.updateStatus);

module.exports = router;