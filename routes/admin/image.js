var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
var moment = require('moment');

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

router.get('/all', async(req, res) => {

    let selectQuery =  'SELECT A.name,A.img,A.title,A.background_color FROM food_thumbnail A '
    + "WHERE (background_color = '') "
    + "OR (img ='')"
    + 'ORDER BY regiDate DESC '
  
    console.log(selectQuery);
    let selectResult = await db.queryParam_None(selectQuery);
    console.log(selectQuery);
    
    
    if (!selectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.BOARD_INSERT_FAIL));
    } else { //쿼리문이 성공했을 때
  
       res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공",selectResult));
    }
});

router.post('/', upload.single('thumbImg'), async(req, res) => {

    let insertThumbQuery ="";
    let insertThumbResult ="";
    console.log(req.body);
    if(req.body.color !=''){
         insertThumbQuery =  'UPDATE food_thumbnail '
        +' SET img = ?, background_color = ? '
        +' WHERE name = ?'
         insertThumbResult ="";
        if(req.file){ 
            insertThumbResult = await db.queryParam_Arr(insertThumbQuery, 
                [ req.file.location,req.body.color,req.body.food]);
        }else{
            insertThumbResult = await db.queryParam_Arr(insertThumbQuery, 
                [ req.file.location,req.body.color,req.body.food]);
        }
    }else{
             insertThumbQuery =  'UPDATE food_thumbnail '
            +' SET img = ? '
            +' WHERE name = ?'
             insertThumbResult ="";
            if(req.file){ 
                insertThumbResult = await db.queryParam_Arr(insertThumbQuery, 
                    [ req.file.location,req.body.food]);
            }
    }
    if (!insertThumbResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "실패"));
    } else { //쿼리문이 성공했을 때
  
       res.redirect("/admin/image")
    }
  
});

router.get('/search', async(req, res) => {

    let checked = req.query.checked;

    let keyword = '%'+req.query.keyword+'%';
    let selectQuery ="";
    if(checked == 'true'){
        selectQuery =  'SELECT A.name,A.img,A.title,A.background_color FROM food_thumbnail A '
        + 'WHERE name LIKE ? '
        + 'ORDER BY regiDate DESC '
    }else{
        selectQuery =  'SELECT A.name,A.img,A.title,A.background_color FROM food_thumbnail A '
        + "WHERE ((background_color = '') "
        + "OR (img =''))"
        + 'AND name LIKE ? '
        + 'ORDER BY regiDate DESC '
    }
    
    let selectResult = await db.queryParam_Parse(selectQuery,keyword);
    console.log(selectResult);
    if (!selectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.BOARD_INSERT_FAIL));
    } else { //쿼리문이 성공했을 때
  
       res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.BOARD_INSERT_SUCCESS,selectResult));
    }
 
});

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/image.html')
});



module.exports = router;