var express = require('express');
var router = express.Router();
const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß
const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const db = require('../../../module/pool');
const { Health } = require('aws-sdk');

const jwtUtils = require('../../../module/jwt');
/* 프로필 수정 */
/* (1) 프로필 조회 */
/* (2) 닉네임 수정 */
/* (3) 휴대폰번호 수정 */
/* (3-1) 비밀번호 확인 */
/* (3-2) 휴대폰번호 변경 */
/* (new) 비밀번호 변경 */

//프로필 조회
// router.get('/profile', authUtil.isLoggedin, async (req, res) => {
//     const MypageSelectProfileQuery = 'SELECT email,nickname,name,CONCAT( left(phone,3) , "-" , mid(phone,4,4) , "-", right(phone,4)) AS phone FROM user WHERE user_id = ?'; 
//     const MypageSelecProfiletResult = await db.queryParam_Arr(MypageSelectProfileQuery, [req.decoded.id]);

//     if(!MypageSelecProfiletResult){
//         res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     //프로필 조회 실패
//     }else{
//         res.status(200).send(defaultRes.successTrue(statusCode.OK, "프로필 조회 성공", MypageSelecProfiletResult[0]));      // 프로필 조회 성공
//     }
// });
/* (1) 프로필 조회 */
//세가지데이터 가져온다 : nickname, email, phone
router.get('/',authUtil.isLoggedin,async(req,res)=>{//비동기처리로 /profile 링크에서 로그인된 상태로 들어왔을 때 처리하는 api
    const MyPageSelectProfileQuery = 'SELECT nickname,email,CONCAT( left(phone,3) , "-" , mid(phone,4,4) , "-", right(phone,4)) AS phone FROM user WHERE user_id = ?';//user_id의 값으로 필요한 데이터를 가져온다
    //gui에서 보면, 세가지 데이터 필요 : nickname, email, phone
    //01012345678을 010-1234-5678출력위해, CONCAT SUBSTRING (컬럼명 from i to j),'-' 사용
    const MypageSelecProfiletResult = await db.queryParam_Arr(MyPageSelectProfileQuery, [req.decoded.id]);//req에서 토큰으로 decoded된 id과 쿼리문 await으로 비동기 기다리기
    if(!MypageSelecProfiletResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     //존재하는 result 형식이용해서 실패값 출력
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "프로필 조회 성공", MypageSelecProfiletResult[0]));      //존재하는 result 형식이용해서 성공값 출력
    }

});
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
/* (2) 닉네임 수정 */
//nickname UPDATE
router.put('/nickname', authUtil.isLoggedin, async (req, res) => {
    const MypageUpdateProfileQuery = 'UPDATE user SET nickname =? WHERE user_id = ?'; 
    //INSERT INTO user 
    const MypageUpdateProfileResult = await db.queryParam_Arr(MypageUpdateProfileQuery , 
        [req.body.nickname,req.decoded.id]);

    if(!MypageUpdateProfileResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 닉네임 수정 실패
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "닉네임 수정 성공"));      // 닉네임 수정 성공
    }
});

/* (3-1) 비밀번호 확인 */
router.post('/checkpw',authUtil.isLoggedin, async (req, res) => {

    id = req.decoded.id;
    password = req.body.password

    const selectUserQuery = 'SELECT * FROM user WHERE user_id = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, id);

    if (!selectUserResult) {
        // 아이디가 존재하지 않으면
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        const salt = selectUserResult[0].salt;
        const hashedEnterPw = await crypto.pbkdf2(password, salt, 1000, 32, 'SHA512')
        const dbPw = selectUserResult[0].password

        if (hashedEnterPw.toString('base64') == dbPw) {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "비밀번호 일치 성공"
                ));
        } else {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, "비밀번호 일치하지 않음"));
        }
    }
});
/* (3-2) 휴대폰번호 변경 */
router.put('/changepb', authUtil.isLoggedin, async (req, res) => {
    const MypageUpdateProfileQuery = 'UPDATE user SET phone =? WHERE user_id = ?'; 
    const MypageUpdateProfileResult = await db.queryParam_Arr(MypageUpdateProfileQuery , 
        [req.body.phone,req.decoded.id]);

    if(!MypageUpdateProfileResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 프로필 수정 실패
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "휴대폰 번호 수정 성공"));      // 프로필 수정 성공
    }
});



/* 비밀번호 변경 */
router.put('/change/password', authUtil.isLoggedin, async (req, res) => {

    id = req.decoded.id; //토큰
    password = req.body.password //기존 비밀번호
    newpassword = req.body.newpassword //새로운 비밀번호
    const selectUserQuery = 'SELECT * FROM user WHERE user_id = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [req.decoded.id]);
    const salt = selectUserResult[0].salt;
    const hashedEnterPw = await crypto.pbkdf2(password, salt, 1000, 32, 'SHA512')
    const dbPw = selectUserResult[0].password

    if (hashedEnterPw.toString('base64') == dbPw) {  // 입력한 비밀번호 True 

        const salt1 = selectUserResult[0].salt; // salt 업데이트

        const hashPassword = await crypto.pbkdf2(newpassword, salt1, 1000, 32, 'SHA512')//새로운 비밀번호
        const PassNew = hashPassword.toString('base64') //새로운 비밀번호
  
        const changePasswordQuery = "UPDATE user SET password = ? WHERE user_id = ?";
        const changePasswordResult = await db.queryParam_Parse(changePasswordQuery, [PassNew, id]);
  
        if(!changePasswordResult){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        else{
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.CHANGE_PASSWORD_SUCCESS));

        }
    } else { // 입력 비밀번호 False
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.INCORRECT_PASSWORD));
    }
});



module.exports = router;