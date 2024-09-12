//models
const Invoice = require('../models/invoice.model.js')
//service
const clickAndPurchaseServices = require("../services/clicksAndPurchases.controller.js");
//response handler
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constants/messages.js");
const statusCode = require("../constants/statusCodes.js");
const { decode } = require('jsonwebtoken');


//add click and purchases controllers
exports.addClickAndPurchases = async (req, res) => {
    try {
        const affiliateId = req.params.id 
        console.log(affiliateId)
        const type = req.body.type
        const result = await clickAndPurchaseServices.addClickAndPurchases(req, res, type, affiliateId)
        if (result.status == false && result.isExist == false) {
            return sendResponse(res, statusCode.NOT_FOUND, false, `Affiliate ${ErrorMessage.NOT_FOUND}`)
        }
        if (result.status == false && result.result) {
            return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR, error?.errors);
        }
        if (result.status == true && result.result) {
            return sendResponse(res, statusCode.OK, true, `Click And  Purchases ${SuccessMessage.CREATED}`);

        }
        return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.BAD_REQUEST);

    } catch (error) {
        console.log('Error In Create Invoice', error);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR, error?.errors);

    }
}

exports.getClickAndPurchasesList = async (req, res) => {
    try {
        const token = req.header('authorization').split(' ')[1]
        const id = decode(token).id
        console.log(id)
        const type = req.body.type
        const name = req.body.name
        const result = await clickAndPurchaseServices.getClickAndPurchasesList(req, res, type, id,name)
        
        if(result.isAffiliateExist==false && result.status==false){
            return sendResponse(res, statusCode.NOT_FOUND, false, `Affiliate With Given Name  ${ErrorMessage.NOT_FOUND}`)

        }
        if (result.status == false && result.isExist == false) {
            return sendResponse(res, statusCode.NOT_FOUND, false, `Click And Purchases  ${ErrorMessage.NOT_FOUND}`)
        }
        if (result.status == false && result.result) {
            return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR, error?.errors);
        }
        if (result.status == true && result.result) {
            return sendResponse(res, statusCode.OK, true, `Click And  Purchases ${SuccessMessage.CREATED}`,result.result);
        }
        return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.BAD_REQUEST);
    } catch (error) {
        console.log('Error In Create Invoice', error);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR, error?.errors);
    }
}