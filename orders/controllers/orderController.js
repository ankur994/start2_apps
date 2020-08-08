var Promise = require('bluebird');
var orderService = require('../services/orderService');
var productService = require ('../../products/services/productService');
var _ = require('underscore');
var common = require('../../commonFunction');
var jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY = 'secret';
var con = require('../../config');
const customerService = require('../../customers/services/customerService');

//-----------------Create Order------------------------
function create_order(req,res) {
    Promise.coroutine (function *(){
        let checkCustomer = yield customerService.checkDetails({
            customer_id: req.body.userData.customer_id
        })
        if (_.isEmpty (checkCustomer)){
            return res.send ({
                message: 'No customer found',
                status: 400,
                data: {}
            })
        }
        let checkProduct = yield productService.checkProduct ({
            product_id: req.body.product_id
        })
        if (_.isEmpty (checkProduct)){
            return res.send ({
                message: 'No product found',
                status: 400,
                data: {}
            })
        }
        if (checkProduct[0].product_quantity < 1){
            return res.send ({
                message: 'Product is out of stock',
                status: 400,
                data: {}
            })
        }
        if (checkProduct[0].is_blocked == true){
            return res.send ({
                message: 'Product is blocked',
                status: 400,
                data: {}
            })
        }
        if (checkProduct[0].is_available == false){
            return res.send ({
                message: 'Product is not available',
                status: 400,
                data: {}
            })
        }

        let date = new Date();
        let order = yield orderService.createOrder ({
            product_id: checkProduct[0].product_id,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            customer_address: req.body.customer_address,
            product_quantity: req.body.product_quantity,
            created_at: date
        })

        if(req.body.product_quantity > checkProduct[0].product_quantity) {
            return res.send ({
                message: 'Required quantity is not available',
                status: 200,
                data: {}
            })
        }
        con.query(`Update tb_products Set product_quantity = '${checkProduct[0].product_quantity}' - '${req.body.product_quantity}'
         where product_id = '${checkProduct[0].product_id}'`);

        if(!_.isEmpty (order)){
            return res.send ({
                message: 'Order created successfully',
                status: 200,
                data: {order}
            })
        }
        return res.send ({
            message: 'Order not created',
            status: 400,
            data: {}
        })
    })
    ().catch((error) => {
        console.log('Create order: Something went wrong', error)
        return res.send({
            "message": "Create order error: Something went wrong",
            "status": 401,
            "data": {}
        })
    });
}
module.exports =  { create_order }