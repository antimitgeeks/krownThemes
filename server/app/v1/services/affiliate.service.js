const shortid = require('shortid');
const db = require("../models");
const { Op } = require('sequelize')
const Affiliate = db.affiliate;
const jwt = require('jsonwebtoken');
const fs = require('fs')
const path = require('path')
//add affiliate 
exports.addAffiliate = async (req, res, shortId) => {
    try {
        const details = { ...req.body, imageUrl: req.file.originalname }
        const isAlreadyExist = await Affiliate.findOne({
            where: {
                [Op.and]:
                    [
                        { name: req.body.name },
                    ]
            }
        })
        if (isAlreadyExist) {
            return {
                status: false,
                isAlreadyExist: true
            }
        }
        details.shortId = shortId
        const host = await req.headers.host
        details.shortUrl = `${host}${process.env.BASE_URL}/affiliate/${shortId}`
        const result = await Affiliate.create(details)
        if (result) {
            return {
                status: true,
                result: result
            }
        }
        else {
            return {
                status: false
            }
        }

    } catch (error) {
        console.log(error)
        return {
            status: false,
            result: error
        }
    }
}

//short link id generate
exports.shortLink = async (req, res, link) => {
    try {
        const urls = {};

        const shortId = shortid.generate();

        urls[shortId] = link;
        return shortId
    } catch (error) {
        console.log(error)
        return false
    }
}

// redirect short url link
exports.redirectShortLink = async (req, res) => {
    try {
        const shortId = req.params.id
        const result = await Affiliate.findOne({ where: { shortId: shortId } });
        const url = result.link
        if (result) {
            return {
                status: true,
                result: url
            }
        } else {
            return {
                status: false
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            result: error
        }
    }
}

//get affiliate services
exports.getAffiliate = async (req, res) => {
    try {

        const result = await Affiliate.findAll({
            where: {
                userId: req.currUser.id
            },
            order: [
                ['id', 'DESC'],
            ]
        });


        result.forEach(obj => {


            if (obj.dataValues.imageUrl !== null && obj.dataValues.imageUrl !== undefined) {

                const dir = path.join(__dirname, "..")
                const newpath = `${dir}/utils/images/${obj.dataValues.imageUrl}`

                if (fs.existsSync(`${newpath}`)) {

                    obj.dataValues.imageUrl = req.hostname + '/' + obj.dataValues.imageUrl

                }



            }

        });


        if (result) {
            return {
                status: true,
                result: result
            }
        } else {
            return {
                status: false
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            result: error
        }
    }
}