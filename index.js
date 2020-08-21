var customer = require('./customers/controllers/customerController');
var driver = require ('./drivers/controllers/driverController')
var middle = require('./middleware/auth');
var product = require('./products/controllers/productController');
var order = require('./orders/controllers/orderController');

var customerJoi = require ('./validators/customerValidator');
var productJoi = require ('./validators/productValidator');
var driverJoi = require ('./validators/driverValidator');

//----------------Customer API's------------------
app.post('/signup',                     customerJoi.registerValidation, customer.register_customer);
app.post('/verify_otp',                 customerJoi.verifyOtpValidation, customer.verify_otp);
app.post('/login',                      customerJoi.loginValidation, customer.login_customer);
app.post('/forgot_password',            customerJoi.forgotValidation, customer.forgot_password);
app.post('/change_password',            customerJoi.changePasswordValidation, middle.verify_token, customer.change_password);
app.post('/delete_customer',            customerJoi.deleteCustomerValidation, customer.delete_customer);
app.post('/update_customer',            customerJoi.updateCustomerValidation, middle.verify_token, customer.update_customer);
app.post('/block_unblock_customer',     customerJoi.blockUnblockValidation, customer.block_unblock_customer);
app.post('/get_all_drivers',            customerJoi.getDriversValidation, customer.get_all_drivers);

//----------------Driver API's------------------
app.post('/signup_driver',              driverJoi.registerDriverValidation, driver.register_driver);
app.post('/verify_otp_driver',          driverJoi.verifyOtpValidation, driver.verify_otp_driver);
app.post('/login_driver',               driverJoi.loginDriverValidation, driver.login_driver);
app.post('/forgot_password_driver',     driverJoi.forgotDriverValidation, driver.forgot_password_driver);
app.post('/change_password_driver',     driverJoi.changePasswordValidation, middle.verify_token, driver.change_password_driver);
app.post('update_driver',               driverJoi.updateDriverValidation, middle.verify_token, driver.update_driver);
app.post('/block_unblock_driver',       driverJoi.blockDriverValidation, driver.block_unblock_driver);
app.post('/delete_driver',              driverJoi.deleteDriverValidation, driver.delete_driver);

//----------------Product API's------------------
app.post('/register_product',           productJoi.registerProductValidation, product.register_product);
app.post('/get_all_products',           productJoi.getProductsValidation, product.get_all_products);
app.post('/block_unblock_product',      productJoi.blockProductValidation, product.block_unblock_product);
app.post('/update_product',             productJoi.updateProductValidation, product.update_product);
app.post('/delete_product',             productJoi.deleteProductValidation, product.delete_product);

//----------------Order API's------------------
app.post('/create_order', middle.verify_token, order.create_order);