var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://quanlynhanvien-9c2c0.firebaseio.com"
});

let db = admin.firestore();
class xu_ly_nhan_vien {

    async get_list_nhan_vien() {

        try {
            var db = await admin.firestore().collection("Employee").get();
            var Nguoi_dung = db.docs.map(doc => doc.data());
            return Nguoi_dung;
        } catch (Loi) {
            console.log(Loi)
        }
    }

    async them_tai_khoan_nhan_vien(Loai_doi_tuong, Doi_tuong, id){
        try{
            var them = await admin.firestore().collection(Loai_doi_tuong).doc(id).set(Doi_tuong);
            return them;
        }catch(Loi){
            console.log(Loi)
        }
    }

    async sua_tai_khoan_nhan_vien(Loai_doi_tuong, Gia_tri_cap_nhat, id)
    {
        try {
            var sua = await admin.firestore().collection(Loai_doi_tuong).doc(id).set(Gia_tri_cap_nhat);
            return sua
        } catch (Loi) {
            console.log(Loi)
        }
    }

}

var xuly = new xu_ly_nhan_vien;
module.exports = xuly;