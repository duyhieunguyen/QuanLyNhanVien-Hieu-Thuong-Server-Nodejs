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
        }
        else if (ma_so_xu_ly == "Sua_Du_Lieu_Firebase") {
            var nguoiDung = JSON.parse(chuoi_nhan);
            nguoiDung.Account.Password = cryptr.encrypt(nguoiDung.Account.Password)
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.Email.trim() == nguoiDungDB.Email.trim()) {
                    nguoiDungDB.Account.Password = nguoiDung.Account.Password;
                }
            })
            var Kq = database.sua_tai_khoan_nhan_vien('Employee', nguoiDung, nguoiDung.Email)
            dap_ung.end(chuoi_kq);
        } else if (ma_so_xu_ly == "Login") {
            var nguoiDung = JSON.parse(chuoi_nhan)
            var kq = false;
            dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            du_lieu.danh_sach_nguoi_dung.forEach(nguoiDungDB => {
                if (nguoiDung.UserName.trim() == nguoiDungDB.Account.UserName.trim()) {
                    if (nguoiDung.Password == cryptr.decrypt(nguoiDungDB.Account.Password)) {
                        kq = true;
                        chuoi_kq = JSON.stringify(nguoiDungDB)
                    }
                }
            })

            if (kq == false) {
                chuoi_kq = "loginfalse"
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
        }else if(ma_so_xu_ly == "RegisterGoogle"){
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
                    chuoi_kq = "emailGoogleExist"
                    
                }
            })

            if(kq == true){
                database.them_tai_khoan_nhan_vien('Employee', nguoiDung, nguoiDung.Email)
                du_lieu.danh_sach_nguoi_dung.push(nguoiDung);
            }
            dap_ung.end(chuoi_kq);
        }
        else if (ma_so_xu_ly == "Forgot_Password") {
            var kq = true;
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
                    html: `<h1>Welcome to ĐH Gia Định</h1><p>Link resetpassword https://quanlynhanviengdu.github.io/views/resetPassword.html?email=${nguoiDung.Email}</p>`
                    //html: `<h1>Welcome to ĐH Gia Định</h1><p>Link resetpassword http://127.0.0.1:5501/views/resetPassword.html?email=${nguoiDung.Email}</p>`
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
                chuoi_kq = 'emailNotExist'
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