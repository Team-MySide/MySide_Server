var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');


router.put('/', async (req, res) => {
    user_id = req.body.user_id
    receipe_id = req.body.receipe_id
    let WishQuery;
    let UpdateWishQuery;

    const likeExit = 'SELECT * FROM receipe_save WHERE user_id = ? AND receipe_id = ?'
    const likeExitResult = await db.queryParam_Parse(likeExit, [user_id, receipe_id]);
    console.log('likeExitResult')
    console.log(likeExitResult)

    if(likeExitResult[0]==null){ // 좋아요 아닌 상태
        WishQuery = 'INSERT INTO receipe_save (user_id,receipe_id) VALUES (?, ?)'; 
        UpdateWishQuery = 'UPDATE receipe SET receipe_savesum = receipe_savesum+ 1 WHERE receipe_id = ?'
        console.log('0')
    } else{ // 좋아요 상태
        WishQuery = 'DELETE FROM receipe_save WHERE user_id =? AND receipe_id =?'
        UpdateWishQuery = 'UPDATE receipe SET receipe_savesum = receipe_savesum-1 WHERE receipe_id = ?'
        console.log('1')
    } 
    
    const WishResult = await db.queryParam_Arr(WishQuery, [user_id, receipe_id]);
    const UpdateWishResult = await db.queryParam_Arr(UpdateWishQuery, receipe_id);
    
    if(!WishResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "저장 상태 변경 성공"));      
    }
});

module.exports = router;