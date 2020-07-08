var Promise = require ('bluebird');
const Joi = require('@hapi/joi');

function registerValidation (req, res, next){
    const schema = Joi.object({
        first_name: Joi.string().alphanum().min(2).max(30).required(),
        last_name: Joi.string().alphanum().min(3).max(30).required(),
        username: Joi.string().alphanum().min(3).max(30),
        phone_number: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password'),
        access_token: Joi.string(),
        birth_year: Joi.string().min(1900).max(2020),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        latitude: Joi.string(),
        longitude: Joi.string()
    })
    
    return new Promise (async function (reject, resolve){
        try {
          const value = await schema.validateAsync(req.body);
          next();
        } catch (error){
          res.send(error.details[0].message)
        }
    })
}
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
    
//         if (!req.body.password || req.body.password.length < 6) {
//           return res.send({
//             message: 'Please enter a password with min. 6 chars',
//             status: 400,
//             data: {}
//           });
//         }   
//         next();
//   }



module.exports = { registerValidation };