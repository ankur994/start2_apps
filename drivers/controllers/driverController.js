var Promise = require('bluebird');
var driverServices = require('../services/driverService');
var _ = require('underscore');
var common = require('../../commonFunction');
var jwt = require('jsonwebtoken');
var otp = require ('../../commonFunction');
const secretKey = process.env.JWT_KEY = 'secret';
var con = require('../../config');

//------------------------------Register driver---------------------------------
function register_driver(req, res) {
    Promise.coroutine(function* () {
            //---check email exist or not----
            let checkEmail = yield driverServices.checkDetails({
                email: req.body.email,
                phone_number: req.body.phone_number
            });

            if (!_.isEmpty(checkEmail)) {
                // if (checkEmail.length > 1){
                return res.send({
                    message: 'Email or Phone no. already exists',
                    status: 401,
                    data: {}
                })
            }
            //----add email-----
            var register_token = jwt.sign({ email: req.body.email }, secretKey, { expiresIn: '10d' });

            let date = new Date();
            let registerDriver = yield driverServices.registerDriver({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                phone_number: req.body.phone_number,
                password: yield common.bcryptHash(req.body.password),
                access_token: register_token,
                otp: otp.generateOTP(),
                is_verify: 0,
                is_blocked: 0,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                created_at: date,
                updated_at: date
            });

            //---------------json data---------------
            let new_user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                phone_number: req.body.phone_number,
                otp: otp.generateOTP(),
                access_token: register_token,
                latitude: req.body.latitude,
                longitude: req.body.longituden,
                created_at: date,
                updated_at: date
            }

            if (!_.isEmpty(registerDriver)) {
                return res.send({
                    message: 'Registered successfully',
                    status: 200,
                    data: { new_user }
                })
            }
            return res.send({
                message: 'Error in Registration',
                status: 401,
                data: {}
            })
        })
        ().catch((error) => {
            console.log('Register driver: Something went wrong', error)
            return res.send({
                "message": "Register error: Something went wrong",
                "status": 401,
                "data": {}
            })
        });
}

//---------------------------Verify OTP--------------------------------------
function verify_otp_driver (req, res) {
    Promise.coroutine (function *() {
        let checkPhone = yield driverServices.checkDetails ({
            phone_number: req.body.phone_number
        })
        if (_.isEmpty (checkPhone)){
            return res.send ({
                message: 'Driver not found',
                status: 400,
                data: {}
            })
        }
        let otp = req.body.otp;
        if (otp != checkPhone[0].otp){
            return res.send ({
                message: 'Invalid or expired otp',
                status: 400,
                data: {}
            })
        }

        if (checkPhone[0].is_verify == 1){
            return res.send ({
                message: "OTP already verified",
                status: 400,
                data: {}
            })
        }
        con.query(`Update tb_drivers set is_verify = '1' where phone_number = '${checkPhone[0].phone_number}'`);
        return res.send ({
            message: 'OTP verified successfully',
            status: 200,
            data:{}
        })
    })
    ().catch((error) => {
        console.log('Verify OTP: Something went wrong', error)
        return res.send({
            "message": 'Verify OTP: Something went wrong',
            "status": 401,
            "data": {}
        })
    });
}

//----------------------------------Login-------------------------------------
function login_driver(req, res) {
    Promise.coroutine(function* () {

            let checkEmail = yield driverServices.checkDetails({
                email: req.body.email,
            })

            if (_.isEmpty(checkEmail)) { // if email not exist
                return res.send({
                    message: 'Driver not found',
                    status: '400',
                    data: {}
                })
            }
            if (checkEmail[0].is_verify == 0) { // is email verified or not
                return res.send({
                    message: 'Email is not verified',
                    status: '400',
                    data: {}
                })
            }
            if (!checkEmail[0].password) { // if password is null
                return res.send({
                    message: "Password of email doesn't exist",
                    status: '400',
                    data: {}
                })
            }
            //------------------------Method 1---------------------------
            // common.bcryptHashCompare(req.body.password, checkEmail[0].password)
            //     .then((password) => {
            //         if (password) {

            //------------------------Method 2---------------------------
            let password = yield common.bcryptHashCompare(req.body.password, checkEmail[0].password);
            if (password) {
                let token = jwt.sign({ email: checkEmail[0].email, driver_id: checkEmail[0].driver_id }, secretKey, { expiresIn: '50d' });
                // for updating access_token in db
                con.query(`Update tb_drivers set access_token = '${token}' where email = '${checkEmail[0].email}'`)
                return res.send({
                    message: 'Login successfully',
                    status: 200,
                    access_token: token,
                    data: {}
                })
            }
            return res.send({
                message: "Email and password doesn't match",
                status: 400,
                data: {}
            })
        })
        ().catch((error) => {
            console.log('Login driver: Something went wrong', error)
            return res.send({
                message: 'Login error: Something went wrong',
                status: 400,
                data: {}
            })
        })
}

//-----------------------------Forgot Password--------------------------------
function forgot_password_driver(req, res) {
    Promise.coroutine(function* () {
            let checkEmail = yield driverServices.checkDetails({
                email: req.body.email
            })
            if (_.isEmpty(checkEmail)) {
                return res.send({
                    message: 'Driver not exists',
                    status: 400,
                    data: {}
                })
            }
            let reset_password = yield driverServices.updateUser({
                email: req.body.email,
                password: yield common.bcryptHash(req.body.password)
            })
            if (!_.isEmpty(reset_password)) {
                return res.send({
                    message: 'Password updated successfully',
                    status: 200,
                    data: {}
                })
            }
            return res.send({
                message: 'Error in updating password',
                status: 400,
                data: {}
            })
        })
        ().catch((error) => {
            console.log('Forgot Password: Something went wrong', error)

            return res.send({
                message: 'Forgot Password: Something went wrong',
                status: 400,
                data: {}
            })
        })
}

//-----------------------------Change Password--------------------------------
function change_password_driver(req, res) {
    Promise.coroutine(function* () {
            let checkEmail = yield driverServices.checkDetails({
                email: req.body.userData.email
            })

            if (_.isEmpty(checkEmail)) {
                return res.send({
                    message: 'Driver not exists',
                    status: 400,
                    data: {}
                })
            }

            let oldPassword = yield common.bcryptHashCompare(req.body.oldPassword, checkEmail[0].password);
            if (!oldPassword) {
                return res.send({
                    message: 'Old password is incorrect',
                    status: 400,
                    data: {}
                })
            }
            if(req.body.newPassword == req.body.oldPassword){
                return res.send ({
                    message: "Old and new password can't be same",
                    status: 400,
                    data: {}
                })
            }
            let newPassword = yield driverServices.updateUser({
                email: req.body.userData.email,
                password: yield common.bcryptHash(req.body.newPassword)
            })

            if (!_.isEmpty(newPassword)) {
                return res.send({
                    message: 'Password changed successfully',
                    status: 200,
                    data: {}
                })
            }
            return res.send({
                message: 'Error in password updating',
                status: 400,
                data: {}
            })
        })
        ().catch((error) => {
            console.log('Change Password: Something went wrong', error)
            return res.send({
                message: 'Change Password: Something went wrong',
                status: 400,
                data: {}
            })
        })
}

//------------------------Block/Unblock driver-----------------------------
function block_unblock_driver (req, res) {
    Promise.coroutine (function *() {
        let checkEmail = yield driverServices.checkDetails ({
            email: req.body.email
        })
        if (_.isEmpty (checkEmail)){
            return res.send ({
                message: 'Driver not found',
                status: 400,
                data: {}
            })
        }
        let is_blocked = req.body.is_blocked;

        if (is_blocked == '1'){
        con.query(`Update tb_drivers set is_blocked = '1' where email = '${checkEmail[0].email}'`);
            return res.send ({
                message: 'Driver blocked successfully',
                status: 200,
                data: {}
            })
        }
        if (is_blocked == '0'){
            con.query(`Update tb_drivers set is_blocked = '0' where email = '${checkEmail[0].email}'`);
            return res.send ({
                message: 'Driver unblocked successfully',
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


module.exports = { register_driver, verify_otp_driver, login_driver, forgot_password_driver, change_password_driver,
    block_unblock_driver }