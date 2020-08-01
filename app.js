var http = require("http");
var database = require("./XU_LY_DU_LIEU/firebase");
var port = normalizePort(process.env.PORT || 3000);
var xu_ly_tham_so = require("querystring");


//Random-number xác thực email
//npm install random-number
var rn = require('random-number');
var options = {
    min: 100000
    , max: 999999
    , integer: true
}

//Send Mail
//npm install nodemailer
var nodemailer = require('nodemailer');
//Ma Hoa va Giai ma Cryptr
//npm install cryptr
var Cryptr = require('cryptr')
cryptr = new Cryptr('duyhieu')

var du_lieu = {}

var danh_sach_nguoi_dung = database.get_list_nhan_vien();
var kq = "";
danh_sach_nguoi_dung.then(kq => {
    du_lieu.danh_sach_nguoi_dung = kq;
})
var server = http.createServer((yeu_cau, dap_ung) => {
    var chuoi_nhan = "";
    var dia_chi_xu_ly = yeu_cau.url.replace("/", "");
    yeu_cau.on("data", (p) => { chuoi_nhan += p })
    yeu_cau.on("end", () => {
        var tham_so = xu_ly_tham_so.parse(dia_chi_xu_ly.replace("?", ""));
        var ma_so_xu_ly = tham_so.ma_so_xu_ly;
        var chuoi_kq = "";
        if (ma_so_xu_ly == "Doc_Du_Lieu_Firebase") {
            var obj = {};
            chuoi_kq = JSON.stringify(du_lieu.danh_sach_nguoi_dung);
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            dap_ung.end(chuoi_kq);
        }
        else if (ma_so_xu_ly == "VADoc_Danh_sach_Nhan_vien") {
            var Doi_tuong_kq = {}
            Doi_tuong_kq = du_lieu.danh_sach_nguoi_dung
            chuoi_kq = JSON.stringify(Doi_tuong_kq)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            dap_ung.end(chuoi_kq);
        } 
        else if (ma_so_xu_ly == "VAKet_noi_tu_winform") {

            console.log("ok kết nối thành công");
            console.log(chuoi_nhan);
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            chuoi_kq = chuoi_nhan;
            dap_ung.end(chuoi_kq);
        }
        else if (ma_so_xu_ly == "VAThem_nhan_vien_moi_mssql") {
            var nhanvien = JSON.parse(chuoi_nhan);
            //console.log(nhanvien);
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            console.log(nhanvien);
            nhanvien.Account.Password = cryptr.encrypt(nhanvien.Account.Password);
            if(nhanvien.Account.Role.trim() = "manage")
            {
                nhanvien.Account.Role = "admin";
            }
            else
            {
                nhanvien.Account.Role = "user";
            }
            kq = database.Ghi_moi_Doi_tuong('Employee', nhanvien, nhanvien.Account.UserName);
            du_lieu.danh_sach_nguoi_dung.push(nhanvien);
            if (kq == "") {
                chuoi_kq = "OK"
                console.log("Thêm thành công");
            } else {
                chuoi_kq = "Error"
            }
            dap_ung.end(chuoi_kq);
        }
        else if (ma_so_xu_ly == "VAThem_gop_y") {
            var feedback = JSON.parse(chuoi_nhan);
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            console.log(feedback);
            kq = database.Ghi_moi_Doi_tuong_Khong_Id('feedbacks', feedback);
            //du_lieu.Danh_sach_Nhan_vien.push(nhanvien);
            if (kq == "") {
                chuoi_kq = "OK"
                console.log("Thêm thành công");
            } else {
                chuoi_kq = "Error"
            }
            dap_ung.end(chuoi_kq);
        }
        else if (ma_so_xu_ly == "VACap_nhat_tai_khoan") {
            var kq = ""
            console.log("-------------------->>>");
            console.log(chuoi_nhan);
            var nhanvien = JSON.parse(chuoi_nhan)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            
            du_lieu.danh_sach_nguoi_dung.forEach(employeeDB => {
                if (employeeDB.Account.UserName.trim() == nhanvien.Account.UserName.trim()) {
                    employeeDB.FullName = nhanvien.FullName;
                    employeeDB.BirthDate =nhanvien.BirthDate;
                    employeeDB.Address = nhanvien.Address;
                    employeeDB.Email = nhanvien.Email;
                    employeeDB.PhoneNumber = nhanvien.PhoneNumber;
                    employeeDB.Account.Password = nhanvien.Account.Password;
                }
            });
            kq = database.Cap_nhat_Doi_tuong('Employee', nhanvien, nhanvien.Account.UserName)
            if (kq == "") {
                chuoi_kq = "OK"
            } else {
                chuoi_kq = "Error"
            }

            dap_ung.end(chuoi_kq);
        }
        else if (ma_so_xu_ly == "VAThem_Lich_bieu") {
            var kq = ""
            var Data = JSON.parse(chuoi_nhan)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            console.log(Data);
            var Dieu_kien = { "Email": Data.username }
            var dataUpdate = [];
            var nhanvien = {};
            du_lieu.danh_sach_nguoi_dung.forEach(dataSchedule => {
                if (dataSchedule.Account.UserName.trim() ==Data.username.trim()) {
                    Data.schedules.id = dataSchedule.Schedules.length;
                    dataSchedule.Schedules.push(Data.schedules);
                    dataUpdate = dataSchedule.Schedules;
                    nhanvien = dataSchedule;
                }
            });
            var Gia_tri_Cap_nhat = {
                $set: { Schedules: dataUpdate }
            }
            console.log(Dieu_kien);
            console.log(dataUpdate);
            //du_lieu.Danh_sach_Cau_hoi.question_list = Cau_hoi.question_list;
            kq = database.Them_lich_bieu('Employee', nhanvien, nhanvien.Account.UserName)
            if (kq == "") {
                chuoi_kq = "OK"
            } else {
                chuoi_kq = "Error"
            }

            dap_ung.end(chuoi_kq);
        }
        else if (ma_so_xu_ly == "VAlogin") {
            console.log("Vào login nè");
            var user  = JSON.parse(chuoi_nhan)
            console.log(user);
            var checkLogin  = false;
            var user_return  = {};
            du_lieu.danh_sach_nguoi_dung.forEach(userDB=>{
                //console.log(userDB)
                if(user.UserName.trim() == userDB.Account.UserName.trim())
                {
                    if( user.Password.trim() == cryptr.decrypt(userDB.Account.Password))
                    {
                        checkLogin = true;
                        user_return = userDB;
                    }
                }
            })

            if(checkLogin == false)
            {
                chuoi_kq = "login_fail";
            }
            else
            {
                chuoi_kq = JSON.stringify(user_return)
            }
            //console.log(chuoi_kq);
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            dap_ung.end(chuoi_kq);
        }

        else if (ma_so_xu_ly == "Them_Du_Lieu_Firebase") {
            var nguoiDung = JSON.parse(chuoi_nhan);
            nguoiDung.Account.Password = cryptr.encrypt(nguoiDung.Account.Password)
            var kq = true;
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    kq = false
                    chuoi_kq = 'emailExist'

                }
            })
            if (kq == true) {
                database.them_tai_khoan_nhan_vien('Employee', nguoiDung, nguoiDung.Email)

                //Tạo number random cho xác thực gmail
                var number = rn(options);

                //Cách send email
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'duyhieudev0507@gmail.com',
                        pass: '05070812aa'
                    }
                });

                var mailOptions = {
                    from: 'duyhieudev0507@gmail.com',
                    to: nguoiDung.Email,
                    subject: 'Xác thực email',
                    //html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                    html: '<h1>Welcome to ĐH Gia Định</h1><p>Mã xác thực của  ' + nguoiDung.Email + ' là:  ' + number + ' </p>'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                chuoi_kq = JSON.stringify(number)
                du_lieu.danh_sach_nguoi_dung.push(nguoiDung);
            }
            dap_ung.end(chuoi_kq);
        } else if (ma_so_xu_ly == "Them_Du_Lieu_Nhan_Vien_Firebase") {
            //Thêm nhân viên không cần qua bước xác thực
            var nguoiDung = JSON.parse(chuoi_nhan);
            console.log(nguoiDung)
            nguoiDung.Account.Password = cryptr.encrypt(nguoiDung.Account.Password)
            var kq = true;
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    kq = false
                    chuoi_kq = JSON.stringify("emailExist");
                }
            })
            if (kq == true) {
                database.them_tai_khoan_nhan_vien('Employee', nguoiDung, nguoiDung.Email)
                du_lieu.danh_sach_nguoi_dung.push(nguoiDung);
            }

            dap_ung.end(chuoi_kq);
        } else if (ma_so_xu_ly == "Sua_Du_Lieu_Firebase") {
            var nguoiDung = JSON.parse(chuoi_nhan);
            //nguoiDung.Account.Password = cryptr.encrypt(nguoiDung.Account.Password)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    //nguoiDungDB.Account.Password = nguoiDung.Account.Password;
                    nguoiDungDB.Account.Role = nguoiDung.Account.Role;
                    nguoiDungDB.FullName = nguoiDung.FullName;
                    nguoiDung = nguoiDungDB;

                }
            })
            database.sua_tai_khoan_nhan_vien('Employee', nguoiDung, nguoiDung.Email)
            dap_ung.end(chuoi_kq);
        } else if (ma_so_xu_ly == "Kiem_Tra_Mat_Khau_Du_Firebase") {
            var nguoiDung = JSON.parse(chuoi_nhan);
            var kq = false
            //nguoiDung.Account.Password = cryptr.encrypt(nguoiDung.Account.Password)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    if (nguoiDung.Account.Password == cryptr.decrypt(nguoiDungDB.Account.Password)){
                        kq = true
                        chuoi_kq = JSON.stringify(nguoiDungDB)
                    }
                }
            })
            if (kq == false) {
                chuoi_kq = JSON.stringify("errorPassword")
            }

            dap_ung.end(chuoi_kq);
        } else if (ma_so_xu_ly == "Doi_Mat_Khau_Du_Firebase") {
            var nguoiDung = JSON.parse(chuoi_nhan);
            nguoiDung.Account.Password = cryptr.encrypt(nguoiDung.Account.Password)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    nguoiDungDB.Account.Password = nguoiDung.Account.Password;
                    nguoiDung = nguoiDungDB;
                }
            })
            database.sua_tai_khoan_nhan_vien('Employee', nguoiDung, nguoiDung.Email)
            dap_ung.end(chuoi_kq);
        } else if (ma_so_xu_ly == "Login") {
            var nguoiDung = JSON.parse(chuoi_nhan)
            var kq = false;
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    if (nguoiDung.Password == cryptr.decrypt(nguoiDungDB.Account.Password)) {
                        kq = true;
                        chuoi_kq = JSON.stringify(nguoiDungDB)
                    }
                }
            })

            if (kq == false) {
                chuoi_kq = JSON.stringify("loginfalse")
            }
            dap_ung.end(chuoi_kq);
        } else if (ma_so_xu_ly == "LoginGoogle") {
            var nguoiDung = JSON.parse(chuoi_nhan)
            var kq = false;
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    kq = true;
                    chuoi_kq = JSON.stringify(nguoiDungDB)
                }
            })

            if (kq == false) {
                chuoi_kq = JSON.stringify("loginGoogleFalse")
            }

            dap_ung.end(chuoi_kq);
        } else if (ma_so_xu_ly == "RegisterGoogle") {
            var nguoiDung = JSON.parse(chuoi_nhan);
            console.log(nguoiDung)
            var kq = true;
            nguoiDung.Account.Password = cryptr.encrypt(nguoiDung.Account.Password)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    kq = false
                    chuoi_kq = "emailGoogleExist";

                }
            })

            if (kq == true) {
                database.them_tai_khoan_nhan_vien('Employee', nguoiDung, nguoiDung.Email)
                du_lieu.danh_sach_nguoi_dung.push(nguoiDung);
            }
            dap_ung.end(chuoi_kq);
        }
        else if (ma_so_xu_ly == "Forgot_Password") {
            var kq = false;
            var nguoiDung = JSON.parse(chuoi_nhan)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    kq = true
                    chuoi_kq = JSON.stringify(nguoiDungDB)

                }
            })
            if (kq == true) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'duyhieudev0507@gmail.com',
                        pass: '05070812aa'
                    }
                });

                var mailOptions = {
                    from: 'duyhieudev0507@gmail.com',
                    to: nguoiDung.Email,
                    subject: 'ForgotPassword',
                    //html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                    html: `<h1>Welcome to ĐH Gia Định</h1><p>Link resetpassword https://nhanvien.daihocgiadinh.edu.vn/views/resetPassword.html?email=${nguoiDung.Email}</p>`
                    // html: `<h1>Welcome to ĐH Gia Định</h1><p>Link resetpassword http://127.0.0.1:5501/views/resetPassword.html?email=${nguoiDung.Email}</p>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

            }
            else {
                chuoi_kq = JSON.stringify("emailNotExist")
            }
            dap_ung.end(chuoi_kq);
        }
        else {
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            dap_ung.end("error");
        }
    })
})

server.listen(port, console.log(`Dịch vụ đang xử lý tại địa chỉ: localhost: ${port}`));
server.on("error", onError);
server.on("listening", onListening);




/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof Port === 'string' ?
        'Pipe ' + Port :
        'Port ' + Port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on ' + bind);
}