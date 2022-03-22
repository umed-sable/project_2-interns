const collegeModel = require('../models/collegeModel');

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = (requestBody) => {
    if (Object.keys(requestBody).length) return true
    return false;
}
// const isValidName = (name) => {
//     if(Object.keys(name).length) return true
//     return false;
//}
const createCollege = async (req, res) => {
    try {
        const collegeDetails = req.body;
        if (!isValidRequestBody(collegeDetails)) {
            return res.status(400).send({ status: false, mesage: 'Invalid request parameters. Please provide college details' })
        }

        const { name, fullName, logoLink } = req.body;

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Nmae is required' })
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: 'fullNmae is required' })
        }
        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: 'LogoLink is required' })
        }

        const collegeData = { name, fullName, logoLink };
        const newCollege = await collegeModel.create(collegeData);
        res.status(201).send({ status: true, message: 'College created successfully', data: newCollege });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        });
    }

}

module.exports.createCollege = createCollege;