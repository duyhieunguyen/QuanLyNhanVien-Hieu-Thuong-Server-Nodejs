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


    //////////
    async Ghi_moi_Doi_tuong(Loai_Doi_tuong, Doi_tuong,id) {

        try {
            var Kq = await admin.firestore().collection(Loai_Doi_tuong).doc(id).set(Doi_tuong)
            //var Kq = await db.collection(Loai_Doi_tuong).insert(Doi_tuong)
            return Kq

        } catch (Loi) {
            console.log(Loi)
        }
    }

    async Ghi_moi_Doi_tuong_Khong_Id(Loai_Doi_tuong, Doi_tuong) {

        try {
            var Kq = await admin.firestore().collection(Loai_Doi_tuong).doc().set(Doi_tuong)
            //var Kq = await db.collection(Loai_Doi_tuong).insert(Doi_tuong)
            return Kq

        } catch (Loi) {
            console.log(Loi)
        }
    }

    async Them_lich_bieu(Loai_Doi_tuong, Doi_tuong,id) {

        try {
            var Kq = await admin.firestore().collection(Loai_Doi_tuong).doc(id).set(Doi_tuong)
            //var Kq = await db.collection(Loai_Doi_tuong).insert(Doi_tuong)
            return Kq

        } catch (Loi) {
            console.log(Loi)
        }
    }

    async Cap_nhat_Doi_tuong(Loai_Doi_tuong, Doi_tuong,id) {

        try {
            var Kq = await admin.firestore().collection(Loai_Doi_tuong).doc(id).set(Doi_tuong)
            //var Kq = await db.collection(Loai_Doi_tuong).insert(Doi_tuong)
            return Kq

        } catch (Loi) {
            console.log(Loi)
        }
    }

    async Xoa_Doi_tuong(Loai_Doi_tuong, Bieu_thuc_dieu_kien) {
        try {
            var db = await DbConnection.Get()
            var Kq = await db.collection(Loai_Doi_tuong).remove(Bieu_thuc_dieu_kien);
            return Kq
        } catch (Loi) {
            console.log(Loi);
        }
    }

}

var xuly = new xu_ly_nhan_vien;
module.exports = xuly;