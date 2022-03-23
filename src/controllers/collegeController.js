const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = (requestBody) => {
    if (Object.keys(requestBody).length) return true
    return false;
}

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
        const nameAlreadyUsed = await collegeModel.findOne({name})
        if(nameAlreadyUsed){
            return res.status(400).send({ status: false, message: ` College${name} is already registered` })
    
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: 'fullNmae is required' })
        }
        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: 'LogoLink is required' })
        }

        if(logoLink.indexOf("https://functionup-stg.s3.ap-south-1.amazonaws.com/thorium/bskcm.jpg")== -1){
            return res.status(400).send({ status: false, message: 'Only AWS S3 url allowed' })
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

const getCollegeDetails = async (req, res) => {
 try {   
     const collegeName = req.query.name;
     if(!collegeName){
         return res.status(400).send({status: false, message: "Please provide collegeName"})
     }
     if (!isValidRequestBody(collegeName)) {
        return res.status(400).send({ status: false, mesage: 'Invalid request parameters. Please provide college name' })
    }
    const{name} =req.query;
    if (!isValid(name)) {
        return res.status(400).send({ status: false, message: 'Nmae is required' })
    }

    const collegeDetails = await collegeModel.findOne({name: collegeName,isDeleted: false});
    if(!collegeDetails){
        return res.status(404).send({status: false, message: "College not found"})
    }

    const collegeId = collegeDetails._id;
    const internDetails = await internModel.find({collegeId: collegeId, isDeleted: false});
    if(internDetails.length < 0){
        return res.status(400).send({status: false, message: "No intern found"})
    }

    const interest = [];
    for(let i=0; i<internDetails.length; i++){
        let Object={}
            Object._id = internDetails[i]._id
            Object.name=internDetails[i].name
            Object.email = internDetails[i].email
            Object.mobile=internDetails[i].mobile
            interest.push(Object)
    }
    const getInternList = {
        name: collegeDetails.name,
        fullName: collegeDetails.fullName,
        logoLink: collegeDetails.logoLink,
        interest: interest
    }

    res.status(200).send({status: true, count: interest.length, data: getInternList})
    }catch(error){
        return res.status(500).send({
            status: false,
            message: error.message
        });
    }

}

module.exports ={ createCollege, getCollegeDetails};

