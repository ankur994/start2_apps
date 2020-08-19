const Joi = require('@hapi/joi');

//-------------------Register customer--------------------------
function registerValidation (req, res, next){
    const schema = Joi.object({
        first_name: Joi.string().alphanum().min(2).max(30).required(),
        last_name: Joi.string().alphanum().min(3).max(30).required(),
        phone_number: Joi.number().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
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

//-------------------Login customer--------------------------
function loginValidation (req, res, next){
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

//-------------------Verify otp--------------------------
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
function forgotValidation (req, res, next){
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

//-------------------Delete customer--------------------------
function deleteCustomerValidation (req, res, next){
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


//-------------------Update customer--------------------------
function updateCustomerValidation (req, res, next){
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

//-------------------Block/Unblock customer--------------------------
function blockUnblockValidation (req, res, next){
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

//-------------------Get all drivers--------------------------
function getDriversValidation (req, res, next){
  const schema = Joi.object({
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

module.exports = { registerValidation, loginValidation, verifyOtpValidation, forgotValidation, changePasswordValidation, 
  deleteCustomerValidation, updateCustomerValidation, blockUnblockValidation, getDriversValidation }

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
