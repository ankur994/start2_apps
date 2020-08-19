const Joi = require('@hapi/joi');

//-------------------Register driver--------------------------
function registerDriverValidation (req, res, next){
    const schema = Joi.object({
        first_name: Joi.string().alphanum().min(2).max(30).required(),
        last_name: Joi.string().alphanum().min(3).max(30).required(),
        phone_number: Joi.number().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required()
    })
    
    return new Promise (async (reject, resolve) => {
        try {
          const value = await schema.validateAsync(req.body);
          next();
        } catch (error){
          res.send(error.details[0].message)
        }
    })
}

//-------------------Login driver--------------------------
function loginDriverValidation (req, res, next){
  const schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  })
  
  return new Promise (async (reject, resolve) => {
      try {
        const value = await schema.validateAsync(req.body);
        next();
      } catch (error){
        res.send(error.details[0].message)
      }
  })
}

//-------------------Verify otp driver--------------------------
function verifyOtpValidation (req, res, next){
  const schema = Joi.object({
    phone_number: Joi.number().required(),
    otp: Joi.number().required()
  })
  
  return new Promise (async (reject, resolve) => {
      try {
        const value = await schema.validateAsync(req.body);
        next();
      } catch (error){
        res.send(error.details[0].message)
      }
  })
}

//-------------------Forgot Password--------------------------
function forgotDriverValidation (req, res, next){
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  })
  
  return new Promise (async (reject, resolve) => {
      try {
        const value = await schema.validateAsync(req.body);
        next();
      } catch (error){
        res.send(error.details[0].message)
      }
  })
}

//-------------------Change Password--------------------------
function changePasswordValidation (req, res, next){
  const schema = Joi.object({
    access_token: Joi.string().required(),
    oldPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  })
  
  return new Promise (async (reject, resolve) => {
      try {
        const value = await schema.validateAsync(req.body);
        next();
      } catch (error){
        res.send(error.details[0].message)
      }
  })
}

//-------------------Delete driver--------------------------
function deleteDriverValidation (req, res, next){
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
  })
  
  return new Promise (async (reject, resolve) => {
      try {
        const value = await schema.validateAsync(req.body);
        next();
      } catch (error){
        res.send(error.details[0].message)
      }
  })
}

//-------------------Update driver--------------------------
function updateDriverValidation (req, res, next){
  const schema = Joi.object({
    access_token: Joi.string().required(),
    first_name: Joi.string().alphanum().min(2).max(30),
    last_name: Joi.string().alphanum().min(3).max(30),
    phone_number: Joi.number(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  })
  
  return new Promise (async (reject, resolve) => {
      try {
        const value = await schema.validateAsync(req.body);
        next();
      } catch (error){
        res.send(error.details[0].message)
      }
  })
}

//-------------------Block/Unblock driver--------------------------
function blockDriverValidation (req, res, next){
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    is_block: Joi.string().required()
  })
  
  return new Promise (async (reject, resolve) => {
      try {
        const value = await schema.validateAsync(req.body);
        next();
      } catch (error){
        res.send(error.details[0].message)
      }
  })
}



module.exports = { registerDriverValidation, loginDriverValidation, verifyOtpValidation, forgotDriverValidation, changePasswordValidation,
    deleteDriverValidation, blockDriverValidation, updateDriverValidation }

//----------------------------------------------------------------------
// function validateRegister (req, res, next) {
//         if (!req.body.first_name || req.body.first_name.length < 2) {
//             return res.send ({
//                 message: 'First name length must be min 2 characters',
//                 status: 400,
//                 data: {}
//             })
//           }
    
//         if (!req.body.last_name || req.body.last_name.length < 2) {
//             // return res.status(400).send({
//             return res.send({
//                 message: 'Last name length must be min 2 characters',
//                 status: 400,
//                 data: {}
//             });
//           }  
//         next();
//   }
