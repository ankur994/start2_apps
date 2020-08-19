const Joi = require('@hapi/joi');

//-------------------Register product-----------------------
function registerProductValidation (req, res, next){
    const schema = Joi.object({
        product_name: Joi.string().alphanum().min(2).max(30).required(),
        product_quantity: Joi.number().required(),
        product_price: Joi.number().required()
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

//-------------------Get all product-----------------------
function getProductsValidation (req, res, next){
  const schema = Joi.object({
      is_available: Joi.string(),
      is_blocked: Joi.number(),
      is_deleted: Joi.string()
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

//-------------------Update product--------------------------
function updateProductValidation (req, res, next){
  const schema = Joi.object({
    _id: Joi.string().required(),
    product_name: Joi.string().alphanum().min(2).max(30),
    product_quantity: Joi.number(),
    product_price: Joi.number()
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

//-------------------Block/Unblock product--------------------------
function blockProductValidation (req, res, next){
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

//-------------------Delete product--------------------------
function deleteProductValidation (req, res, next){
  const schema = Joi.object({
    product_id: Joi.string().required()
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


module.exports = { registerProductValidation, getProductsValidation, updateProductValidation, blockProductValidation, deleteProductValidation }