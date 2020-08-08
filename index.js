var customer = require('./customers/controllers/customerController');
var driver = require ('./drivers/controllers/driverController')
var validator = require('./customers/validator/userValidator');
var middle = require('./middleware/auth');
var product = require('./products/controllers/productController');
var order = require('./orders/controllers/orderController');

//----------------Customer API's------------------
app.post('/signup', validator.registerValidation, customer.register_customer);
app.post('/verify_otp',  customer.verify_otp);
app.post('/login', customer.login_customer);
app.post('/forgot_password', customer.forgot_password);
app.post('/change_password', middle.verify_token, customer.change_password);
app.post('/delete_customer',customer.delete_customer);
app.post('/update_customer', middle.verify_token, customer.update_customer);
app.post('/block_unblock_customer', customer.block_unblock_customer);
app.post('/get_all_drivers', customer.get_all_drivers);

//----------------Driver API's------------------
app.post('/signup_driver', driver.register_driver);
app.post ('/verify_otp_driver', driver.verify_otp_driver);
app.post ('/login_driver', driver.login_driver);
app.post('/forgot_password_driver', driver.forgot_password_driver);
app.post ('/change_password_driver', middle.verify_token, driver.change_password_driver);
app.post('/block_unblock_driver', driver.block_unblock_driver);

//----------------Product API's------------------
app.post('/register_product', product.register_product);
app.post('/get_all_products', product.get_all_products);
app.post('/block_unblock_product', product.block_unblock_product);
app.post('/update_product', product.update_product);

//----------------Order API's------------------
app.post('/create_order', middle.verify_token, order.create_order);