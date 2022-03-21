const internModel = require('../models/internModel')

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = (requestBody) => {
    if (Object.keys(requestBody).length) return true
    return false;
}

const createIntern = async (req, res) => {
    const internDetails = req.body;
    if (!isValidRequestBody(internDetails)) {
        return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
    }

    const { name, email, mobile } = req.body;

    if (!isValid(name)) {
        return res.status(400).send({ status: false, message: 'Nmae is required' })
    }

    if (!isValid(email)) {
        return res.status(400).send({ status: false, message: 'Email is required' })
    }

    if (!isValid(mobile)) {
        return res.status(400).send({ status: false, message: 'Mobile number is required' })
    }

}

    module.exports.createIntern = createIntern;