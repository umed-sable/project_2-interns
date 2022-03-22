const { default: mongoose } = require('mongoose');
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

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);
}

const createIntern = async (req, res) => {
 try { 
      const internDetails = req.body;
    if (!isValidRequestBody(internDetails)) {
        return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
    }

    const { name, email, mobile, collegeId } = req.body;

    if (!isValid(name)) {
        return res.status(400).send({ status: false, message: 'Nmae is required' })
    }

    if (!isValid(email)) {
        return res.status(400).send({ status: false, message: 'Email is required' })
    }
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        return res.status(400).send({ status: false, message: 'Email should be valid email' })

    }
    const emailAlreadyUsed = await internModel.findOne({email})
    if(emailAlreadyUsed){
        return res.status(400).send({ status: false, message: `${email} is already registered` })

    }

    if (!isValid(mobile)) {
        return res.status(400).send({ status: false, message: 'Mobile number is required' })
    }
    if(!(/^(\+\d{1,3}[- ]?)?\d{10}$/)){
        return res.status(400).send({ status: false, message: 'Mobile number should be valid mobile number' })

    }
    const mobileAlreadyUsed = await internModel.findOne({mobile})
    if(mobileAlreadyUsed){
        return res.status(400).send({ status: false, message: `${mobile} number already registered` })
    }
    if(!isValid(collegeId)) {
        return res.status(400).send({ status: false, message: 'CollegeId is required' });
    }

    if(!isValidObjectId(collegeId)) {
        return res.status(400).send({ status: false, message: `${collegeId} is not a valid ObjecId`});

    }

    const internData = {name, email, mobile, collegeId};
    const newIntern = await internModel.create(internData);
    res.status(201).send({status: true, message: 'Intern created successsfully', data: newIntern})
}catch(error){
    return res.status(500).send({
        status: false,
        message: error.message
    });
}
}

    module.exports.createIntern = createIntern;