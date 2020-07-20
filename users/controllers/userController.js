var Promise = require('bluebird');
var userServices = require('../services/userServices');
var _ = require('underscore');
var common = require('../../commonFunction');
var jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY = 'secret';
var con = require('../../config');
const driverServices = require('../../drivers/services/driverServices');
const { result } = require('underscore');

//------------------------------Register user---------------------------------
function register_vendor(req, res) {
    Promise.coroutine(function* () {
            //---check email exist or not----
            let checkEmail = yield userServices.checkDetails({
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
            let registerUser = yield userServices.registerUser({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                phone_number: req.body.phone_number,
                password: yield common.bcryptHash(req.body.password),
                created_at: date,
                access_token: register_token,
                otp: '1111',
                is_verify: 0,
                is_blocked: 0
            });

            //---------------json data---------------
            let new_user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                phone_number: req.body.phone_number,
                created_at: date,
                access_token: register_token,
            }

            if (!_.isEmpty(registerUser)) {
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
            console.log('Register user: Something went wrong', error)
            return res.send({
                "message": "Register error: Something went wrong",
                "status": 401,
                "data": {}
            })
        });
}

//---------------------------Verify OTP--------------------------------------
function verify_otp (req, res) {
    Promise.coroutine (function *() {
        let checkPhone = yield userServices.checkDetails ({
            phone_number: req.body.phone_number
        })
        if (_.isEmpty (checkPhone)){
            return res.send ({
                message: 'User not found',
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
        con.query(`Update tb_vendors set is_verify = '1' where phone_number = '${checkPhone[0].phone_number}'`);
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
function login_vendor(req, res) {
    Promise.coroutine(function* () {

            let checkEmail = yield userServices.checkDetails({
                email: req.body.email,
            })

            if (_.isEmpty(checkEmail)) { // if email not exist
                return res.send({
                    message: 'User not found',
                    status: '200',
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
            if (checkEmail[0].is_blocked == 1) {
                return res.send({
                    message: 'Your account has been blocked.',
                    status: '400',
                    data: {}
                })
            }
            if (!checkEmail[0].password) { // if password is null
                return res.send({
                    message: "Password of email doesn't exist",
                    status: '200',
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
                let token = jwt.sign({ email: checkEmail[0].email, vendor_id: checkEmail[0].vendor_id }, secretKey, { expiresIn: '10d' });
                // for updating access_token in db
                con.query(`Update tb_vendors set access_token = '${token}' where email = '${checkEmail[0].email}'`)
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
            console.log('Login user: Something went wrong', error)
            return res.send({
                message: 'Login error: Something went wrong',
                status: 400,
                data: {}
            })
        })
}

//-----------------------------Forgot Password--------------------------------
function forgot_password (req, res) {
    Promise.coroutine(function* () {
            let checkEmail = yield userServices.checkDetails({
                email: req.body.email
            })
            if (_.isEmpty(checkEmail)) {
                return res.send({
                    message: 'User not exists',
                    status: 400,
                    data: {}
                })
            }
            let reset_password = yield userServices.updateUser({
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
function change_password(req, res) {
    Promise.coroutine(function* () {

            let checkEmail = yield userServices.checkDetails({
                email: req.body.userData.email
            })
            console.log ('5787685', req.body.userData.email)

            if (_.isEmpty(checkEmail)) {
                return res.send({
                    message: 'User not exists',
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
            let newPassword = yield userServices.updateUser({
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

//--------------------------------Delete user---------------------------------
function delete_vendor (req, res) {
    Promise.coroutine(function* () {
            let checkEmail = yield userServices.checkDetails({
                email: req.body.email
            })
            if (_.isEmpty(checkEmail)) {
                return res.send({
                    message: 'User not found',
                    status: 400,
                    data: {}
                })
            }
            let user = yield userServices.deleteEmail({
                email: req.body.email
            })

            if (!_.isEmpty(user)) {
                return res.send({
                    message: 'User deleted successfully',
                    status: 400,
                    data: {}
                })
            }
        })
        ().catch((error) => {
            console.log('Delete user: Something went wrong', error)
            return res.send({
                message: 'Delete user: Something went wrong',
                status: 400,
                data: {}
            })
        })
}

//----------------------------Update user details-----------------------------
function update_vendor (req, res) {
    Promise.coroutine(function* () {

            let checkId = yield userServices.checkDetails({
                vendor_id: req.body.userData.vendor_id
            })
            if (_.isEmpty(checkId)) {
                return res.send({
                    message: 'User not exists',
                    status: 400,
                    data: {}
                })
            }
            let checkEmail = yield userServices.checkDetails({
                email: req.body.email, phone_number: req.body.phone_number
            })
            if (!_.isEmpty(checkEmail)) {
                return res.send({
                    message: 'User already exists',
                    status: 400,
                    data: {}
                })
            }
            let opts = {
                updateObj: {},
                whereCondition: {email: req.body.userData.email}
            }
            if (req.body.first_name) {
                opts.updateObj.first_name = req.body.first_name
            }
            if (req.body.last_name) {
                opts.updateObj.last_name = req.body.last_name
            }
            if (req.body.phone_number) {
                opts.updateObj.phone_number = req.body.phone_number
            }
            if (req.body.email) {
                opts.updateObj.email = req.body.email
            }

            let updateDetail = yield userServices.updateVendor(opts);
            if (!_.isEmpty(updateDetail)) {
                return res.send({
                    message: 'User details updated successfully',
                    status: 200,
                    data: {}
                })
            }
            return res.send({
                message: 'Error in updating user details',
                status: 400,
                data: {}
            })

        })
        ().catch((error) => {
            console.log('Update user: Something went wrong', error)
            return res.send({
                message: 'Update user: Something went wrong',
                status: 400,
                data: {}
            })
        })
}

//------------------------Block/Unblock user-----------------------------
function block_unblock_vendor (req, res) {
    Promise.coroutine (function *() {
        let checkEmail = yield userServices.checkDetails ({
            email: req.body.email
        })
        if (_.isEmpty (checkEmail)){
            return res.send ({
                message: 'Vendor not found',
                status: 400,
                data: {}
            })
        }
        let is_blocked = req.body.is_blocked;

        if (is_blocked == '1'){
        con.query(`Update tb_vendors set is_blocked = '1' where email = '${checkEmail[0].email}'`);
            return res.send ({
                message: 'Vendor blocked successfully',
                status: 200,
                data: {}
            })
        }
        if (is_blocked == '0'){
            con.query(`Update tb_vendors set is_blocked = '0' where email = '${checkEmail[0].email}'`);
            return res.send ({
                message: 'Vendor unblocked successfully',
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

//----------------------------Get all drivers--------------------------------
function get_all_drivers (req, res) {
    Promise.coroutine (function *() {
        let checkEmail = yield userServices.checkDetails ({
            email: req.body.email
        })
        if (_.isEmpty (checkEmail)){
            return res.send ({
                message: 'Vendor not found',
                status: 400,
                data: {}
            })
        }
        
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;

        con.query (`SELECT *, ( 6371 * acos(cos(radians('${latitude}')) * cos(radians(latitude)) * cos(radians(longitude) - radians
         ('${longitude}')) + sin(radians('${latitude}')) * sin(radians(latitude )))) AS distance FROM tb_drivers HAVING 
         distance < 33 ORDER BY distance LIMIT 0, 20`, function (error, result) {
            if (error){
                return res.send ({
                    message: "Error in getting drivers",
                    status: 201,
                    data: {}
                })
            }
            return res.send ({
                message:'Drivers get successfully',
                status: 201,
                data: { result }
            })
        })

        // let withoutPasswordDriver = [];
        // checkAllDrivers.forEach((ele) => {
        //     delete ele.password,
        //         delete ele.otp,
        //         delete ele.access_token
        //     withoutPasswordDriver.push(ele);
        // })
        // if (_.isEmpty (checkAllDrivers))
        // return res.send ({
        //     message: 'Error in getting successfully',
        //     status: 200,
        //     data: {}
        // })
        // return res.send ({
        //     message: 'Drivers get successfully',
        //     status: 200,
        //     data: { withoutPasswordDriver }
        // })
    })
    ().catch((error) => {
        console.log('Get all drivers: Something went wrong', error)
        return res.send({
            message: 'Get all drivers: Something went wrong',
            status: 400,
            data: {}
        })
    })
}


module.exports = { register_vendor, verify_otp, login_vendor, forgot_password, change_password, delete_vendor, update_vendor, 
    block_unblock_vendor, get_all_drivers }