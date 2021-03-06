var express = require('express');
var router = express.Router();

const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const db = require('../../../module/pool');
const { Health } = require('aws-sdk');


// //마이페이지 상단
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const MypageSelectQuery = 'SELECT nickname,name,stageNm,progressNm,cancerNm,disease FROM user WHERE user_id = ?'; 
    const MypageSelectResult = await db.queryParam_Arr(MypageSelectQuery, [req.decoded.id]);

    console.log("a");
    console.log(req.decoded);
    console.log(MypageSelectResult);
    if(!MypageSelectQuery){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 마이페이지  조회 실패
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "마이페이지 조회 성공", MypageSelectResult[0]));      // 마이페이지  조회 성공
    }
});

// //프로필 조회
// router.get('/profile', authUtil.isLoggedin, async (req, res) => {
//     const MypageSelectProfileQuery = 'SELECT email,nickname,name,CONCAT( left(phone,3) , "-" , mid(phone,4,4) , "-", right(phone,4)) AS phone FROM user WHERE user_id = ?'; 
//     const MypageSelecProfiletResult = await db.queryParam_Arr(MypageSelectProfileQuery, [req.decoded.id]);

//     if(!MypageSelecProfiletResult){
//         res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     //프로필 조회 실패
//     }else{
//         res.status(200).send(defaultRes.successTrue(statusCode.OK, "프로필 조회 성공", MypageSelecProfiletResult[0]));      // 프로필 조회 성공
//     }
// });

// //프로필 수정
// router.put('/profile', authUtil.isLoggedin, async (req, res) => {
//     const MypageUpdateProfileQuery = 'UPDATE user SET nickname =? ,name =? ,phone =? WHERE user_id = ?'; 
//     const MypageUpdateProfileResult = await db.queryParam_Arr(MypageUpdateProfileQuery , 
//         [req.body.nickname,req.body.name,req.body.phone,req.decoded.id]);

//     if(!MypageUpdateProfileResult){
//         res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 프로필 수정 실패
//     }else{
//         res.status(200).send(defaultRes.successTrue(statusCode.OK, "프로필 수정 성공"));      // 프로필 수정 성공
//     }
// });
// /*
// //건강데이터 목록 조회
// router.get('/health/list', authUtil.isLoggedin, async (req, res) => {
//     const MypageSelectHealthQuery = 'SELECT health_id,DATE_FORMAT(RegiDate, "%y.%m.%d") AS RegiDate,stageNm,progressNm,cancerNm,disease,weight,height FROM user_health WHERE user_id = ?'; 
//     const MypageSelectHealthResult = await db.queryParam_Arr(MypageSelectHealthQuery, [req.decoded.id]);

//     if(!MypageSelectHealthResult ){
//         res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 건강데이터 목록 조회 실패
//     }else{
//         res.status(200).send(defaultRes.successTrue(statusCode.OK, "건강데이터 목록 조회 성공", MypageSelectHealthResult));      // 건강데이터 목록  조회 성공
//     }
// });

// //건강데이터 입력
// router.post('/health', authUtil.isLoggedin, async (req, res) => {
//     const MypageInsertHealthQuery = "INSERT INTO user_health " 
//     +"(user_id,relationNm,gender,age,height,weight,stageNm,progressNm,cancerNm,disease,disable_food,memo,RegiDate) "
//     +"VALUES "
//     +"(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()) "
//     const MypageInsertHealthResult = await db.queryParam_Arr(MypageInsertHealthQuery, 
//         [req.decoded.id,req.body.relationNm,req.body.gender,req.body.age,req.body.height,req.body.weight,req.body.stageNm
//         ,req.body.progressNm,req.body.cancerNm,req.body.disease,req.body.disable_food,req.body.memo]);

//     if(!MypageInsertHealthResult){
//         res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 건강데이터 입력 실패
//     }else{
//         res.status(200).send(defaultRes.successTrue(statusCode.OK, "건강데이터 입력 성공"));      // 건강데이터 입력 성공
//     }
// });


// //건강데이터 편집
// router.put('/health', authUtil.isLoggedin, async (req, res) => {
//     const MypageUpdateHealthQuery = "UPDATE user_health SET " 
//     +"relationNm = ?,gender = ?, age = ?, height = ?, weight = ?, stageNm = ?,"
//     +"progressNm = ?,cancerNm = ?,disease = ?,disable_food = ?, memo = ? "
//     +"WHERE user_id =? AND health_id = ?"
//     const MypageUpdateHealthResult = await db.queryParam_Arr(MypageUpdateHealthQuery, 
//         [req.body.relationNm,req.body.gender,req.body.age,req.body.height,req.body.weight,req.body.stageNm
//         ,req.body.progressNm,req.body.cancerNm,req.body.disease,req.body.disable_food,req.body.memo,req.decoded.id,req.body.health_id]);

//         if(!MypageUpdateHealthResult){
//             res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 프로필 수정 실패
//         }else{
//             res.status(200).send(defaultRes.successTrue(statusCode.OK, "건강데이터 수정 성공"));      // 프로필 수정 성공
//         }
// });
// //건강데이터 상세
// router.get('/health/:health_id', authUtil.isLoggedin, async (req, res) => {
//     const MypageSelectHealthQuery = 
//     'SELECT relationNm,gender,age,height,weight,stageNm,progressNm,cancerNm,disease,disable_food,memo ' 
//     +'FROM user_health WHERE user_id = ? AND health_id =? '; 
//     const MypageSelectHealthResult = await db.queryParam_Arr(MypageSelectHealthQuery, [req.decoded.id, req.params.health_id]);

//     if(!MypageSelectHealthResult){
//         res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 건강데이터  조회 실패
//     }else{
//         res.status(200).send(defaultRes.successTrue(statusCode.OK, "건강데이터 상세조회 성공", MypageSelectHealthResult[0]));      // 건강데이터  조회 성공
//     }
// });
// */

//탈퇴
router.get('/leave/:leave_reason', authUtil.isLoggedin, async(req, res) => {
    console.log(req);
    const LeaveResonQuery = "INSERT INTO myside.leave(email, leave_reason) VALUES((SELECT email FROM user WHERE user_id=?),?) "
    const LeaveReasonResult = await db.queryParam_Arr(LeaveResonQuery, [req.decoded.id, req.params.leave_reason]);

    if(!LeaveReasonResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }
    else {
        const LeaveAccountQuery = "DELETE FROM user WHERE user_id = ?"
        const LeaveAccountResult = await db.queryParam_Arr(LeaveAccountQuery, [req.decoded.id]);

        if (!LeaveAccountResult){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.LEAVE_ACCOUNT_SUCCESS));
    }
}})


router.get('/leave/a/:leave_reason', authUtil.isLoggedin, async (req, res) => {


    console.log(req.decoded);

    
});
module.exports = router;