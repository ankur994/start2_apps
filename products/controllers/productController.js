var Promise = require('bluebird');
var productServices = require('../services/productService');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY = 'secret';
var con = require('../../config');

//------------------------------Register product---------------------------------
function register_product(req, res) {
    Promise.coroutine(function* () {

            let date = new Date();
            let registerProduct = yield productServices.registerProduct({
                product_name: req.body.product_name,
                product_price: req.body.product_price,
                product_quantity: req.body.product_quantity,
                created_at: date,
                is_available: 1,
                is_blocked: 0
            });

            if (!_.isEmpty(registerProduct)) {
                return res.send({
                    message: 'Product added successfully',
                    status: 200,
                    data: { registerProduct }
                })
            }
            return res.send({
                message: 'Error in adding product',
                status: 401,
                data: {}
            })
        })
        ().catch((error) => {
            console.log('Register product: Something went wrong', error)
            return res.send({
                "message": "Register error: Something went wrong",
                "status": 401,
                "data": {}
            })
        });
}

//-----------------Product details-------------------------
function get_all_products (req, res) {
    Promise.coroutine (function *(){
       
        let opts = {};

        if (req.body.is_available) {
            opts.is_available = req.body.is_available;
        }
        if (req.body.is_blocked) {
            opts.is_blocked = req.body.is_blocked;
        }
      
        let checkAllProduct = yield productServices.checkProduct (opts);       
        if (_.isEmpty (checkAllProduct)){
            return res.send ({
                message: 'No product found',
                status: 400,
                data: {}
            })
        }
        
        return res.send ({
            message: 'Success',
            status: 200,
            data: {checkAllProduct}
        })
    })
    ().catch((error) => {
        console.log('Product: Something went wrong', error)
        return res.send({
            "message": 'Product error: Something went wrong',
            "status": 401,
            "data": {}
        })
    });
}

//-----------------Update product details-------------------------
function update_product(req, res) {
    Promise.coroutine(function* () {
            let checkProduct = yield productServices.checkProduct({ 
                product_id: req.body.product_id 
            })
            if (_.isEmpty(checkProduct)) {
                return res.send({
                    message: 'No product found',
                    status: 400,
                    data: {}
                })
            }
            let opts = {
                updateObj: {},
                whereCondition: {product_id: checkProduct[0].product_id}
            };
            if (req.body.product_name) {
                opts.updateObj.product_name = req.body.product_name;
            }
            if (req.body.product_price) {
                opts.updateObj.product_price = req.body.product_price;
            }
            if (req.body.product_quantity) {
                opts.updateObj.product_quantity = req.body.product_quantity;
            }
            let update_detail = yield productServices.updateProduct(opts);
            if (_.isEmpty(update_detail)) {
                return res.send({
                    message: 'Error in updating product',
                    status: 400,
                    data: {}
                })
            }
            return res.send({
                message: 'Product updated successfully',
                status: 200,
                data: {opts}
            })
        })
        ().catch((error) => {
            console.log('Product: Something went wrong', error)
            return res.send({
                "message": 'Product error: Something went wrong',
                "status": 401,
                "data": {}
            })
        });
}

//------------------------Block/Unblock product-----------------------------
function block_unblock_product (req, res) {
    Promise.coroutine (function *() {
        let checkProduct = yield productServices.checkProduct({
            product_id: req.body.product_id
        })
        if (_.isEmpty (checkProduct)){
            return res.send ({
                message: 'Product not found',
                status: 400,
                data: {}
            })
        }
        let is_blocked = req.body.is_blocked;

        if (is_blocked == '1'){
        con.query(`Update tb_products set is_blocked = '1' where product_id = '${checkProduct[0].product_id}'`);
            return res.send ({
                message: 'Product blocked successfully',
                status: 200,
                data: {}
            })
        }
        if (is_blocked == '0'){
            con.query(`Update tb_products set is_blocked = '0' where product_id = '${checkProduct[0].product_id}'`);
            return res.send ({
                message: 'Product unblocked successfully',
                status: 200,
                data: {}
            })
        }
        return res.send ({
            message: 'Please enter 0 or 1',
            status: 400,
            data: {}
        })
    })
    ().catch((error) => {
        console.log('Blocked/Unblocked: Something went wrong', error)
        return res.send({
            message: 'Blocked/Unblocked: Something went wrong',
            status: 400,
            data: {}
        })
    })
}

//--------------------------------Delete product---------------------------------
function delete_product (req, res) {
    Promise.coroutine(function* () {
            let checkProduct = yield productServices.checkProduct({
                product_id: req.body.product_id
            })
            if (_.isEmpty(checkProduct)) {
                return res.send({
                    message: 'Product not found',
                    status: 400,
                    data: {}
                })
            }
      
            let product = con.query(`Update tb_products set is_deleted = '1' where product_id = '${checkProduct[0].product_id}'`);

            if (!_.isEmpty(product)) {
                return res.send({
                    message: 'Product deleted successfully',
                    status: 400,
                    data: {}
                })
            }
        })
        ().catch((error) => {
            console.log('Delete product: Something went wrong', error)
            return res.send({
                message: 'Delete product: Something went wrong',
                status: 400,
                data: {}
            })
        })
}



module.exports = { register_product, get_all_products, update_product, block_unblock_product, delete_product }