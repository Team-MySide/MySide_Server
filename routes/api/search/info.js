var express = require('express');
var router = express.Router();

const authUtil = require("../../../module/utils/authUtils");   // 토큰 있을 때 사용ßß

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const db = require('../../../module/pool');

router.get('/header/:food', authUtil.checkLogin,async (req, res) => {

    let resData ={
        name: "",
        img: "",
        title: "",
        cancer :[],
        nutrition1 :"",
        nutrition2 :"",
        nutrition3 :"",
        nutrition4 :"",
        likes : 0,
        wishes : 0,
        views : 0,
        likeStatus :0,
        wishStatus :0
    }

    try{
  
        const SelectQuery1 = 'SELECT food_id, name,title,img,category,wishes,views,likes,nutrition1,nutrition2,nutrition3,nutrition4 FROM food_thumbnail WHERE name = ?'; 
        const SelectResult1 = await db.queryParam_Arr(SelectQuery1, [req.params.food]);
        const SelectQuery2 = 'SELECT cancerNm from cancer_food WHERE food = ?'; 
        const SelectResult2 = await db.queryParam_Arr(SelectQuery2, [req.params.food]);
        console.log(SelectResult2);
        
        resData.name =SelectResult1[0].name;
        resData.img =SelectResult1[0].img;
        resData.title =SelectResult1[0].title;
        resData.nutrition1 =SelectResult1[0].nutrition1;
        resData.nutrition2 =SelectResult1[0].nutrition2;
        resData.nutrition3 =SelectResult1[0].nutrition3;
        resData.nutrition4 =SelectResult1[0].nutrition4;
        resData.likes =SelectResult1[0].likes;
        resData.views =SelectResult1[0].views;
        resData.wishes =SelectResult1[0].wishes;
    
        for(let i =0;i<SelectResult2.length;i++){
            resData.cancer.push(SelectResult2[i].cancerNm);
        }
    
        if(req.decoded != "NL"){
            const SelectQuery3 = 'SELECT * FROM likelist WHERE food = ?'; 
            const SelectResult3 = await db.queryParam_Arr(SelectQuery3, [req.params.food]);
            if(SelectResult3[0]){
                resData.likeStatus = 1;
            }
    
            const SelectQuery4 = 'SELECT * FROM wishlist WHERE food = ?'; 
            const SelectResult4 = await db.queryParam_Arr(SelectQuery4, [req.params.food]);
            if(SelectResult4[0]){
                resData.wishStatus = 1;
            }
            
        }
    
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "음식 상세 헤더 조회 성공", resData));      
    }catch(error){
      console.log(error);
      res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }
   
});

router.get('/status/:food', async (req, res) => {
    const SelectQuery = 'SELECT status FROM food_detail WHERE name = ?'; 
    const SelectResult = await db.queryParam_Arr(SelectQuery, [req.params.food]);
    let resData = [];

    for(let i =0; i<SelectResult.length;i++){
        resData.push(SelectResult[i].status);
    }

    if(!SelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "음식 상세 상태 조회 성공",resData ));      
    }
});

router.get('/configuration/:food', async (req, res) => {


    let resData = {
        good: 10,
        bad: 2,
        function: 10,
        etc:110
    };

    res.status(200).send(defaultRes.successTrue(statusCode.OK, "음식 성분 구성 조회 성공",resData ));      
    
});


router.get('/configuration/detail', async (req, res) => {



});

router.get('/percent/:food/:status', async (req, res) => {
    const SelectCancerQuery = 'SELECT * FROM wishlist WHERE user_id = ?'; 
    const SelectCancerResult = await db.queryParam_Arr(SelectCancerQuery, [req.decoded.id]);

    if(!SelectCancerResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 마이페이지  조회 실패
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "내 리스트 조회 성공", SelectResult));      // 마이페이지  조회 성공
    }
});

router.get('/percent/:food/:status', async (req, res) => {

    let food = req.params.food;
    let status = req.params.status;
    const SelectQuery = 
    `		select	energy	* 	0	as g	,	'energy'	as nutname	,	'에너지'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	moisture	* 	1	as g	,	'moisture'	as nutname	,	'수분'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	protein	* 	1	as g	,	'protein'	as nutname	,	'단백질'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lipid	* 	1	as g	,	'Lipid'	as nutname	,	'지질'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Ash	* 	1	as g	,	'Ash'	as nutname	,	'회분'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	carbohydrate	* 	1	as g	,	'carbohydrate'	as nutname	,	'탄수화물'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_sugars	* 	1	as g	,	'Total_sugars'	as nutname	,	'총 당류'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	saccharose	* 	1	as g	,	'saccharose'	as nutname	,	'자당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	glucose	* 	1	as g	,	'glucose'	as nutname	,	'포도당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	fruit_sugar	* 	1	as g	,	'fruit_sugar'	as nutname	,	'과당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lactose	* 	1	as g	,	'Lactose'	as nutname	,	'유당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Maltose	* 	1	as g	,	'Maltose'	as nutname	,	'맥아당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Galactose	* 	1	as g	,	'Galactose'	as nutname	,	'갈락토오스'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_dietary_fiber	* 	1	as g	,	'Total_dietary_fiber'	as nutname	,	'총 식이섬유'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Water_soluble_dietary_fiber	* 	1	as g	,	'Water_soluble_dietary_fiber'	as nutname	,	'수용성 식이섬유'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Insoluble_dietary_fiber	* 	1	as g	,	'Insoluble_dietary_fiber'	as nutname	,	'불용성 식이섬유'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_amino_acids	* 	0.001	as g	,	'Total_amino_acids'	as nutname	,	'총 아미노산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Essential_amino_acids	* 	0.001	as g	,	'Essential_amino_acids'	as nutname	,	'필수 아미노산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Isoleucine	* 	0.001	as g	,	'Isoleucine'	as nutname	,	'이소루신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Leucine	* 	0.001	as g	,	'Leucine'	as nutname	,	'루신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lysine	* 	0.001	as g	,	'Lysine'	as nutname	,	'라이신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Methionine	* 	0.001	as g	,	'Methionine'	as nutname	,	'메티오닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Phenylalanine	* 	0.001	as g	,	'Phenylalanine'	as nutname	,	'페닐알라닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Threonine	* 	0.001	as g	,	'Threonine'	as nutname	,	'트레오닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Tryptophan	* 	0.001	as g	,	'Tryptophan'	as nutname	,	'트립토판'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Valine	* 	0.001	as g	,	'Valine'	as nutname	,	'발린'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Histidine	* 	0.001	as g	,	'Histidine'	as nutname	,	'히스티딘'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Arginine	* 	0.001	as g	,	'Arginine'	as nutname	,	'아르기닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Non_essential_amino_acids	* 	0.001	as g	,	'Non_essential_amino_acids'	as nutname	,	'비필수 아미노산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Tyrosine	* 	0.001	as g	,	'Tyrosine'	as nutname	,	'티로신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Cysteine	* 	0.001	as g	,	'Cysteine'	as nutname	,	'시스테인'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Alanine	* 	0.001	as g	,	'Alanine'	as nutname	,	'알라닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Aspartic_acid	* 	0.001	as g	,	'Aspartic_acid'	as nutname	,	'아스파르트산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Glutamic_acid	* 	0.001	as g	,	'Glutamic_acid'	as nutname	,	'글루탐산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Glycine	* 	0.001	as g	,	'Glycine'	as nutname	,	'글리신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Proline	* 	0.001	as g	,	'Proline'	as nutname	,	'프롤린'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Serine	* 	0.001	as g	,	'Serine'	as nutname	,	'세린'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Taurine	* 	0.001	as g	,	'Taurine'	as nutname	,	'타우린'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_fatty_acids	* 	1	as g	,	'Total_fatty_acids'	as nutname	,	'총 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_essential_fatty_acids	* 	1	as g	,	'Total_essential_fatty_acids'	as nutname	,	'총 필수 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_saturated_fatty_acids	* 	1	as g	,	'Total_saturated_fatty_acids'	as nutname	,	'총 포화 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Butyric_acid	* 	0.001	as g	,	'Butyric_acid'	as nutname	,	'부티르산(4:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Caproic_acid	* 	0.001	as g	,	'Caproic_acid'	as nutname	,	'카프로산(6:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Caprylic_acid	* 	0.001	as g	,	'Caprylic_acid'	as nutname	,	'카프릴산(8:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Capric_acid	* 	0.001	as g	,	'Capric_acid'	as nutname	,	'카프르산(10:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lauric_acid	* 	0.001	as g	,	'Lauric_acid'	as nutname	,	'라우르산(12:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Tridecanoic_acid	* 	0.001	as g	,	'Tridecanoic_acid'	as nutname	,	'트라이데칸산(13:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Myristic_acid	* 	0.001	as g	,	'Myristic_acid'	as nutname	,	'미리스트산(14:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Pentadecanoic_acid	* 	0.001	as g	,	'Pentadecanoic_acid'	as nutname	,	'펜타데칸산(15:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Palmitic_acid	* 	0.001	as g	,	'Palmitic_acid'	as nutname	,	'팔미트산(16:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Heptadecanoic_acid	* 	0.001	as g	,	'Heptadecanoic_acid'	as nutname	,	'헵타데칸산(17:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Stearic_acid	* 	0.001	as g	,	'Stearic_acid'	as nutname	,	'스테아르산(18:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Arachidic_acid	* 	0.001	as g	,	'Arachidic_acid'	as nutname	,	'아라키드산(20:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Heneikosan_Mountain	* 	0.001	as g	,	'Heneikosan_Mountain'	as nutname	,	'헨에이코산산(21:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Mount_Behen	* 	0.001	as g	,	'Mount_Behen'	as nutname	,	'베헨산(22:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Trichoic_acid	* 	0.001	as g	,	'Trichoic_acid'	as nutname	,	'트리코산산(23:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lignoceric_acid	* 	0.001	as g	,	'Lignoceric_acid'	as nutname	,	'리그노세르산(24:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_monounsaturated_fatty_acids	* 	1	as g	,	'Total_monounsaturated_fatty_acids'	as nutname	,	'총 단일불포화 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Myristoleic_acid	* 	0.001	as g	,	'Myristoleic_acid'	as nutname	,	'미리스톨레산(14:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Palmitoleic_acid	* 	0.001	as g	,	'Palmitoleic_acid'	as nutname	,	'팔미톨레산(16:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Heptadecenic_acid	* 	0.001	as g	,	'Heptadecenic_acid'	as nutname	,	'헵타데센산(17:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Oleic_acid	* 	0.001	as g	,	'Oleic_acid'	as nutname	,	'올레산(18:1(n-9))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Baksensan	* 	0.001	as g	,	'Baksensan'	as nutname	,	'박센산(18:1(n-7))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Mount_Gadole	* 	0.001	as g	,	'Mount_Gadole'	as nutname	,	'가돌레산(20:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Mount_Eruk	* 	0.001	as g	,	'Mount_Eruk'	as nutname	,	'에루크산(22:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Mount_Nerbon	* 	0.001	as g	,	'Mount_Nerbon'	as nutname	,	'네르본산(24:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_polyunsaturated_fatty_acids	* 	1	as g	,	'Total_polyunsaturated_fatty_acids'	as nutname	,	'총 다중불포화 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Linoleic_acid	* 	0.001	as g	,	'Linoleic_acid'	as nutname	,	'리놀레산(18:2(n-6)c)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Alpha_Linolenic_Acid	* 	0.001	as g	,	'Alpha_Linolenic_Acid'	as nutname	,	'알파 리놀렌산(18:3 (n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Gamma_Linolenic_Acid	* 	0.001	as g	,	'Gamma_Linolenic_Acid'	as nutname	,	'감마 리놀렌산(18:3 (n-6))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Eicosadienoic_acid	* 	0.001	as g	,	'Eicosadienoic_acid'	as nutname	,	'에이코사디에노산(20:2(n-6))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Eicosatrienoic_acid	* 	0.001	as g	,	'Eicosatrienoic_acid'	as nutname	,	'에이코사트리에노산(20:3(n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Eicosatrienoic_acid	* 	0.001	as g	,	'Eicosatrienoic_acid'	as nutname	,	'에이코사트리에노산(20:3(n-6))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Arachidonic_acid	* 	0.001	as g	,	'Arachidonic_acid'	as nutname	,	'아라키돈산(20:4(n-6))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Eicosapentaenoic_acid	* 	0.001	as g	,	'Eicosapentaenoic_acid'	as nutname	,	'에이코사펜타에노산(20:5(n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Docosadienosan	* 	0.001	as g	,	'Docosadienosan'	as nutname	,	'도코사디에노산(22:2)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Docosapentaenoic_acid	* 	0.001	as g	,	'Docosapentaenoic_acid'	as nutname	,	'도코사펜타에노산(22:5(n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Docosahexaenoic_acid	* 	0.001	as g	,	'Docosahexaenoic_acid'	as nutname	,	'도코사헥사에노산(22:6(n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Omega_3	* 	1	as g	,	'Omega_3'	as nutname	,	'오메가3 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Omega_6	* 	1	as g	,	'Omega_6'	as nutname	,	'오메가6 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_trans_fatty_acids	* 	1	as g	,	'Total_trans_fatty_acids'	as nutname	,	'총 트랜스 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Trans_oleic_acid	* 	0.001	as g	,	'Trans_oleic_acid'	as nutname	,	'트랜스 올레산(18:1(n-9)t)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Trans_linoleic_acid	* 	0.001	as g	,	'Trans_linoleic_acid'	as nutname	,	'트랜스 리놀레산 (18:2t)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Trans_linolenic_acid	* 	0.001	as g	,	'Trans_linolenic_acid'	as nutname	,	'트랜스 리놀렌산(18:3t)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	calcium	* 	0.001	as g	,	'calcium'	as nutname	,	'칼슘'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	iron	* 	0.001	as g	,	'iron'	as nutname	,	'철'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	magnesium	* 	0.001	as g	,	'magnesium'	as nutname	,	'마그네슘'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	sign	* 	0.001	as g	,	'sign'	as nutname	,	'인'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	potassium	* 	0.001	as g	,	'potassium'	as nutname	,	'칼륨'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	salt	* 	0.001	as g	,	'salt'	as nutname	,	'나트륨'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	zinc	* 	0.001	as g	,	'zinc'	as nutname	,	'아연'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Copper	* 	0.001	as g	,	'Copper'	as nutname	,	'구리'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	manganese	* 	0.001	as g	,	'manganese'	as nutname	,	'망간'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Selenium	* 	0.000001	as g	,	'Selenium'	as nutname	,	'셀레늄'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	molybdenum	* 	0.000001	as g	,	'molybdenum'	as nutname	,	'몰리브덴'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	iodine	* 	0.000001	as g	,	'iodine'	as nutname	,	'요오드'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Retinol	* 	0.000001	as g	,	'Retinol'	as nutname	,	'레티놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Beta_carotene	* 	0.000001	as g	,	'Beta_carotene'	as nutname	,	'베타카로틴'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_B1	* 	0.001	as g	,	'Vitamin_B1'	as nutname	,	'비타민 B1'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_B2	* 	0.001	as g	,	'Vitamin_B2'	as nutname	,	'비타민 B2'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Niacin	* 	0.001	as g	,	'Niacin'	as nutname	,	'니아신'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Niacin_NE	* 	0.001	as g	,	'Niacin_NE'	as nutname	,	'나이아신(NE)'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Nicotinic_acid	* 	0.001	as g	,	'Nicotinic_acid'	as nutname	,	'니코틴산'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Nicotinamide	* 	0.001	as g	,	'Nicotinamide'	as nutname	,	'니코틴아마이드'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Pantothenic_acid	* 	0.001	as g	,	'Pantothenic_acid'	as nutname	,	'판토텐산'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_B6	* 	0.001	as g	,	'Vitamin_B6'	as nutname	,	'비타민 B6'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Pyridoxine	* 	0.001	as g	,	'Pyridoxine'	as nutname	,	'피리독신'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Biotin	* 	0.000001	as g	,	'Biotin'	as nutname	,	'비오틴'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Folic_acid_DFE	* 	0.000001	as g	,	'Folic_acid_DFE'	as nutname	,	'엽산(DFE)'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Folic_Acid_Food_Folic_Acid	* 	0.000001	as g	,	'Folic_Acid_Food_Folic_Acid'	as nutname	,	'엽산 - 식품 엽산'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Folic_acid_added_folic_acid	* 	0.000001	as g	,	'Folic_acid_added_folic_acid'	as nutname	,	'엽산 - 첨가 엽산'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_B12	* 	0.000001	as g	,	'Vitamin_B12'	as nutname	,	'비타민 B12'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_C	* 	0.001	as g	,	'Vitamin_C'	as nutname	,	'비타민 C'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_D	* 	0.000001	as g	,	'Vitamin_D'	as nutname	,	'비타민 D'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_D2	* 	0.000001	as g	,	'Vitamin_D2'	as nutname	,	'비타민 D2'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_D3	* 	0.000001	as g	,	'Vitamin_D3'	as nutname	,	'비타민 D3'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_E	* 	0.001	as g	,	'Vitamin_E'	as nutname	,	'비타민 E'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Alpha_tocopherol	* 	0.001	as g	,	'Alpha_tocopherol'	as nutname	,	'알파 토코페롤'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Beta_tocopherol	* 	0.001	as g	,	'Beta_tocopherol'	as nutname	,	'베타 토코페롤'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Gamma_Tocopherol	* 	0.001	as g	,	'Gamma_Tocopherol'	as nutname	,	'감마 토코페롤'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Delta_tocopherol	* 	0.001	as g	,	'Delta_tocopherol'	as nutname	,	'델타 토코페롤'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Alpha_tocotrienol	* 	0.001	as g	,	'Alpha_tocotrienol'	as nutname	,	'알파 토코트리에놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Beta_tocotrienol	* 	0.001	as g	,	'Beta_tocotrienol'	as nutname	,	'베타 토코트리에놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Gamma_Tocotrienol	* 	0.001	as g	,	'Gamma_Tocotrienol'	as nutname	,	'감마 토코트리에놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Delta_Tocotrienol	* 	0.001	as g	,	'Delta_Tocotrienol'	as nutname	,	'델타 토코트리에놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_K	* 	0.000001	as g	,	'Vitamin_K'	as nutname	,	'비타민 K'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_K1	* 	0.000001	as g	,	'Vitamin_K1'	as nutname	,	'비타민 K1'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_K2	* 	0.000001	as g	,	'Vitamin_K2'	as nutname	,	'비타민 K2'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	cholesterol	* 	0.001	as g	,	'cholesterol'	as nutname	,	'콜레스테롤'	as nutnamekr	,	'기타'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Salt_equivalent	* 	1	as g	,	'Salt_equivalent'	as nutname	,	'식염상당량'	as nutnamekr	,	'기타'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Discard_rate	* 	0	as g	,	'Discard_rate'	as nutname	,	'폐기율'	as nutnamekr	,	'기타'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +   'ORDER BY g DESC '
    +   'LIMIT 4';
     console.log(SelectQuery);
    const SelectResult = await db.queryParam_None(SelectQuery);

 
    if(!SelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));   
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "성분 퍼센트 차트 조회 성공", SelectResult));      
    }
});

router.get('/percent/detail/:food',async (req, res) => {

    let food = req.params.food;
    let status = req.params.status;
    const SelectQuery = 
    `		select	energy	* 	0	as g	,	'energy'	as nutname	,	'에너지'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	moisture	* 	1	as g	,	'moisture'	as nutname	,	'수분'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	protein	* 	1	as g	,	'protein'	as nutname	,	'단백질'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lipid	* 	1	as g	,	'Lipid'	as nutname	,	'지질'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Ash	* 	1	as g	,	'Ash'	as nutname	,	'회분'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	carbohydrate	* 	1	as g	,	'carbohydrate'	as nutname	,	'탄수화물'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_sugars	* 	1	as g	,	'Total_sugars'	as nutname	,	'총 당류'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	saccharose	* 	1	as g	,	'saccharose'	as nutname	,	'자당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	glucose	* 	1	as g	,	'glucose'	as nutname	,	'포도당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	fruit_sugar	* 	1	as g	,	'fruit_sugar'	as nutname	,	'과당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lactose	* 	1	as g	,	'Lactose'	as nutname	,	'유당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Maltose	* 	1	as g	,	'Maltose'	as nutname	,	'맥아당'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Galactose	* 	1	as g	,	'Galactose'	as nutname	,	'갈락토오스'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_dietary_fiber	* 	1	as g	,	'Total_dietary_fiber'	as nutname	,	'총 식이섬유'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Water_soluble_dietary_fiber	* 	1	as g	,	'Water_soluble_dietary_fiber'	as nutname	,	'수용성 식이섬유'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Insoluble_dietary_fiber	* 	1	as g	,	'Insoluble_dietary_fiber'	as nutname	,	'불용성 식이섬유'	as nutnamekr	,	'일반성분'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_amino_acids	* 	0.001	as g	,	'Total_amino_acids'	as nutname	,	'총 아미노산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Essential_amino_acids	* 	0.001	as g	,	'Essential_amino_acids'	as nutname	,	'필수 아미노산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Isoleucine	* 	0.001	as g	,	'Isoleucine'	as nutname	,	'이소루신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Leucine	* 	0.001	as g	,	'Leucine'	as nutname	,	'루신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lysine	* 	0.001	as g	,	'Lysine'	as nutname	,	'라이신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Methionine	* 	0.001	as g	,	'Methionine'	as nutname	,	'메티오닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Phenylalanine	* 	0.001	as g	,	'Phenylalanine'	as nutname	,	'페닐알라닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Threonine	* 	0.001	as g	,	'Threonine'	as nutname	,	'트레오닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Tryptophan	* 	0.001	as g	,	'Tryptophan'	as nutname	,	'트립토판'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Valine	* 	0.001	as g	,	'Valine'	as nutname	,	'발린'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Histidine	* 	0.001	as g	,	'Histidine'	as nutname	,	'히스티딘'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Arginine	* 	0.001	as g	,	'Arginine'	as nutname	,	'아르기닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Non_essential_amino_acids	* 	0.001	as g	,	'Non_essential_amino_acids'	as nutname	,	'비필수 아미노산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Tyrosine	* 	0.001	as g	,	'Tyrosine'	as nutname	,	'티로신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Cysteine	* 	0.001	as g	,	'Cysteine'	as nutname	,	'시스테인'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Alanine	* 	0.001	as g	,	'Alanine'	as nutname	,	'알라닌'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Aspartic_acid	* 	0.001	as g	,	'Aspartic_acid'	as nutname	,	'아스파르트산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Glutamic_acid	* 	0.001	as g	,	'Glutamic_acid'	as nutname	,	'글루탐산'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Glycine	* 	0.001	as g	,	'Glycine'	as nutname	,	'글리신'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Proline	* 	0.001	as g	,	'Proline'	as nutname	,	'프롤린'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Serine	* 	0.001	as g	,	'Serine'	as nutname	,	'세린'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Taurine	* 	0.001	as g	,	'Taurine'	as nutname	,	'타우린'	as nutnamekr	,	'아미노산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_fatty_acids	* 	1	as g	,	'Total_fatty_acids'	as nutname	,	'총 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_essential_fatty_acids	* 	1	as g	,	'Total_essential_fatty_acids'	as nutname	,	'총 필수 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_saturated_fatty_acids	* 	1	as g	,	'Total_saturated_fatty_acids'	as nutname	,	'총 포화 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Butyric_acid	* 	0.001	as g	,	'Butyric_acid'	as nutname	,	'부티르산(4:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Caproic_acid	* 	0.001	as g	,	'Caproic_acid'	as nutname	,	'카프로산(6:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Caprylic_acid	* 	0.001	as g	,	'Caprylic_acid'	as nutname	,	'카프릴산(8:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Capric_acid	* 	0.001	as g	,	'Capric_acid'	as nutname	,	'카프르산(10:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lauric_acid	* 	0.001	as g	,	'Lauric_acid'	as nutname	,	'라우르산(12:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Tridecanoic_acid	* 	0.001	as g	,	'Tridecanoic_acid'	as nutname	,	'트라이데칸산(13:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Myristic_acid	* 	0.001	as g	,	'Myristic_acid'	as nutname	,	'미리스트산(14:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Pentadecanoic_acid	* 	0.001	as g	,	'Pentadecanoic_acid'	as nutname	,	'펜타데칸산(15:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Palmitic_acid	* 	0.001	as g	,	'Palmitic_acid'	as nutname	,	'팔미트산(16:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Heptadecanoic_acid	* 	0.001	as g	,	'Heptadecanoic_acid'	as nutname	,	'헵타데칸산(17:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Stearic_acid	* 	0.001	as g	,	'Stearic_acid'	as nutname	,	'스테아르산(18:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Arachidic_acid	* 	0.001	as g	,	'Arachidic_acid'	as nutname	,	'아라키드산(20:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Heneikosan_Mountain	* 	0.001	as g	,	'Heneikosan_Mountain'	as nutname	,	'헨에이코산산(21:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Mount_Behen	* 	0.001	as g	,	'Mount_Behen'	as nutname	,	'베헨산(22:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Trichoic_acid	* 	0.001	as g	,	'Trichoic_acid'	as nutname	,	'트리코산산(23:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Lignoceric_acid	* 	0.001	as g	,	'Lignoceric_acid'	as nutname	,	'리그노세르산(24:0)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_monounsaturated_fatty_acids	* 	1	as g	,	'Total_monounsaturated_fatty_acids'	as nutname	,	'총 단일불포화 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Myristoleic_acid	* 	0.001	as g	,	'Myristoleic_acid'	as nutname	,	'미리스톨레산(14:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Palmitoleic_acid	* 	0.001	as g	,	'Palmitoleic_acid'	as nutname	,	'팔미톨레산(16:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Heptadecenic_acid	* 	0.001	as g	,	'Heptadecenic_acid'	as nutname	,	'헵타데센산(17:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Oleic_acid	* 	0.001	as g	,	'Oleic_acid'	as nutname	,	'올레산(18:1(n-9))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Baksensan	* 	0.001	as g	,	'Baksensan'	as nutname	,	'박센산(18:1(n-7))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Mount_Gadole	* 	0.001	as g	,	'Mount_Gadole'	as nutname	,	'가돌레산(20:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Mount_Eruk	* 	0.001	as g	,	'Mount_Eruk'	as nutname	,	'에루크산(22:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Mount_Nerbon	* 	0.001	as g	,	'Mount_Nerbon'	as nutname	,	'네르본산(24:1)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_polyunsaturated_fatty_acids	* 	1	as g	,	'Total_polyunsaturated_fatty_acids'	as nutname	,	'총 다중불포화 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Linoleic_acid	* 	0.001	as g	,	'Linoleic_acid'	as nutname	,	'리놀레산(18:2(n-6)c)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Alpha_Linolenic_Acid	* 	0.001	as g	,	'Alpha_Linolenic_Acid'	as nutname	,	'알파 리놀렌산(18:3 (n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Gamma_Linolenic_Acid	* 	0.001	as g	,	'Gamma_Linolenic_Acid'	as nutname	,	'감마 리놀렌산(18:3 (n-6))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Eicosadienoic_acid	* 	0.001	as g	,	'Eicosadienoic_acid'	as nutname	,	'에이코사디에노산(20:2(n-6))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Eicosatrienoic_acid	* 	0.001	as g	,	'Eicosatrienoic_acid'	as nutname	,	'에이코사트리에노산(20:3(n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Eicosatrienoic_acid	* 	0.001	as g	,	'Eicosatrienoic_acid'	as nutname	,	'에이코사트리에노산(20:3(n-6))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Arachidonic_acid	* 	0.001	as g	,	'Arachidonic_acid'	as nutname	,	'아라키돈산(20:4(n-6))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Eicosapentaenoic_acid	* 	0.001	as g	,	'Eicosapentaenoic_acid'	as nutname	,	'에이코사펜타에노산(20:5(n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Docosadienosan	* 	0.001	as g	,	'Docosadienosan'	as nutname	,	'도코사디에노산(22:2)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Docosapentaenoic_acid	* 	0.001	as g	,	'Docosapentaenoic_acid'	as nutname	,	'도코사펜타에노산(22:5(n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Docosahexaenoic_acid	* 	0.001	as g	,	'Docosahexaenoic_acid'	as nutname	,	'도코사헥사에노산(22:6(n-3))'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Omega_3	* 	1	as g	,	'Omega_3'	as nutname	,	'오메가3 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Omega_6	* 	1	as g	,	'Omega_6'	as nutname	,	'오메가6 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Total_trans_fatty_acids	* 	1	as g	,	'Total_trans_fatty_acids'	as nutname	,	'총 트랜스 지방산'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Trans_oleic_acid	* 	0.001	as g	,	'Trans_oleic_acid'	as nutname	,	'트랜스 올레산(18:1(n-9)t)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Trans_linoleic_acid	* 	0.001	as g	,	'Trans_linoleic_acid'	as nutname	,	'트랜스 리놀레산 (18:2t)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Trans_linolenic_acid	* 	0.001	as g	,	'Trans_linolenic_acid'	as nutname	,	'트랜스 리놀렌산(18:3t)'	as nutnamekr	,	'지방산'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	calcium	* 	0.001	as g	,	'calcium'	as nutname	,	'칼슘'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	iron	* 	0.001	as g	,	'iron'	as nutname	,	'철'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	magnesium	* 	0.001	as g	,	'magnesium'	as nutname	,	'마그네슘'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	sign	* 	0.001	as g	,	'sign'	as nutname	,	'인'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	potassium	* 	0.001	as g	,	'potassium'	as nutname	,	'칼륨'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	salt	* 	0.001	as g	,	'salt'	as nutname	,	'나트륨'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	zinc	* 	0.001	as g	,	'zinc'	as nutname	,	'아연'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Copper	* 	0.001	as g	,	'Copper'	as nutname	,	'구리'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	manganese	* 	0.001	as g	,	'manganese'	as nutname	,	'망간'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Selenium	* 	0.000001	as g	,	'Selenium'	as nutname	,	'셀레늄'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	molybdenum	* 	0.000001	as g	,	'molybdenum'	as nutname	,	'몰리브덴'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	iodine	* 	0.000001	as g	,	'iodine'	as nutname	,	'요오드'	as nutnamekr	,	'무기질'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Retinol	* 	0.000001	as g	,	'Retinol'	as nutname	,	'레티놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Beta_carotene	* 	0.000001	as g	,	'Beta_carotene'	as nutname	,	'베타카로틴'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_B1	* 	0.001	as g	,	'Vitamin_B1'	as nutname	,	'비타민 B1'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_B2	* 	0.001	as g	,	'Vitamin_B2'	as nutname	,	'비타민 B2'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Niacin	* 	0.001	as g	,	'Niacin'	as nutname	,	'니아신'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Niacin_NE	* 	0.001	as g	,	'Niacin_NE'	as nutname	,	'나이아신(NE)'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Nicotinic_acid	* 	0.001	as g	,	'Nicotinic_acid'	as nutname	,	'니코틴산'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Nicotinamide	* 	0.001	as g	,	'Nicotinamide'	as nutname	,	'니코틴아마이드'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Pantothenic_acid	* 	0.001	as g	,	'Pantothenic_acid'	as nutname	,	'판토텐산'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_B6	* 	0.001	as g	,	'Vitamin_B6'	as nutname	,	'비타민 B6'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Pyridoxine	* 	0.001	as g	,	'Pyridoxine'	as nutname	,	'피리독신'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Biotin	* 	0.000001	as g	,	'Biotin'	as nutname	,	'비오틴'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Folic_acid_DFE	* 	0.000001	as g	,	'Folic_acid_DFE'	as nutname	,	'엽산(DFE)'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Folic_Acid_Food_Folic_Acid	* 	0.000001	as g	,	'Folic_Acid_Food_Folic_Acid'	as nutname	,	'엽산 - 식품 엽산'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Folic_acid_added_folic_acid	* 	0.000001	as g	,	'Folic_acid_added_folic_acid'	as nutname	,	'엽산 - 첨가 엽산'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_B12	* 	0.000001	as g	,	'Vitamin_B12'	as nutname	,	'비타민 B12'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_C	* 	0.001	as g	,	'Vitamin_C'	as nutname	,	'비타민 C'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_D	* 	0.000001	as g	,	'Vitamin_D'	as nutname	,	'비타민 D'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_D2	* 	0.000001	as g	,	'Vitamin_D2'	as nutname	,	'비타민 D2'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_D3	* 	0.000001	as g	,	'Vitamin_D3'	as nutname	,	'비타민 D3'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_E	* 	0.001	as g	,	'Vitamin_E'	as nutname	,	'비타민 E'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Alpha_tocopherol	* 	0.001	as g	,	'Alpha_tocopherol'	as nutname	,	'알파 토코페롤'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Beta_tocopherol	* 	0.001	as g	,	'Beta_tocopherol'	as nutname	,	'베타 토코페롤'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Gamma_Tocopherol	* 	0.001	as g	,	'Gamma_Tocopherol'	as nutname	,	'감마 토코페롤'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Delta_tocopherol	* 	0.001	as g	,	'Delta_tocopherol'	as nutname	,	'델타 토코페롤'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Alpha_tocotrienol	* 	0.001	as g	,	'Alpha_tocotrienol'	as nutname	,	'알파 토코트리에놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Beta_tocotrienol	* 	0.001	as g	,	'Beta_tocotrienol'	as nutname	,	'베타 토코트리에놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Gamma_Tocotrienol	* 	0.001	as g	,	'Gamma_Tocotrienol'	as nutname	,	'감마 토코트리에놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Delta_Tocotrienol	* 	0.001	as g	,	'Delta_Tocotrienol'	as nutname	,	'델타 토코트리에놀'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_K	* 	0.000001	as g	,	'Vitamin_K'	as nutname	,	'비타민 K'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_K1	* 	0.000001	as g	,	'Vitamin_K1'	as nutname	,	'비타민 K1'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Vitamin_K2	* 	0.000001	as g	,	'Vitamin_K2'	as nutname	,	'비타민 K2'	as nutnamekr	,	'비타민'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	cholesterol	* 	0.001	as g	,	'cholesterol'	as nutname	,	'콜레스테롤'	as nutnamekr	,	'기타'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Salt_equivalent	* 	1	as g	,	'Salt_equivalent'	as nutname	,	'식염상당량'	as nutnamekr	,	'기타'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +	`	union all	select	Discard_rate	* 	0	as g	,	'Discard_rate'	as nutname	,	'폐기율'	as nutnamekr	,	'기타'	as category	from	food_detail	where	name = ${food}	AND	status = ${status}	`
    +   'ORDER BY g DESC '
    +   'LIMIT 4';
     
    const SelectResult = await db.queryParam_None(SelectQuery);
 
    if(!SelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));   
    }else{
        let nutritions =[];
        for(let i=0;i<SelectResult.length;i++){
           nutritions.push(SelectResult[i].nutname);
        }
        
        const SelectDetailQuery = "SELECT nutrition_id, category,name_kr,name,physiological,lack,overabundance,representation_food,ref_link FROM nutrition WHERE name IN (?,?,?,?,?)";
        const SelectDetailResult = await db.queryParam_Arr(SelectDetailQuery,nutritions);

        res.status(200).send(defaultRes.successTrue(statusCode.OK, "성분 퍼센트 차트 상세조회 성공", SelectDetailResult));      
    }
});


router.get('/nutrition/detail/:food', async (req, res) => {

    const SelectQuery = 	"	SELECT energy	* 	1	,	"
    +	"	moisture	* 	1	,	"
    +	"	protein	* 	1	,	"
    +	"	Lipid	* 	1	,	"
    +	"	Ash	* 	1	,	"
    +	"	carbohydrate	* 	1	,	"
    +	"	Total_sugars	* 	1	,	"
    +	"	saccharose	* 	1	,	"
    +	"	glucose	* 	1	,	"
    +	"	fruit_sugar	* 	1	,	"
    +	"	Lactose	* 	1	,	"
    +	"	Maltose	* 	1	,	"
    +	"	Galactose	* 	1	,	"
    +	"	Total_dietary_fiber	* 	1	,	"
    +	"	Water_soluble_dietary_fiber	* 	1	,	"
    +	"	Insoluble_dietary_fiber	* 	1	,	"
    +	"	Total_amino_acids	* 	0.001	,	"
    +	"	Essential_amino_acids	* 	0.001	,	"
    +	"	Isoleucine	* 	0.001	,	"
    +	"	Leucine	* 	0.001	,	"
    +	"	Lysine	* 	0.001	,	"
    +	"	Methionine	* 	0.001	,	"
    +	"	Phenylalanine	* 	0.001	,	"
    +	"	Threonine	* 	0.001	,	"
    +	"	Tryptophan	* 	0.001	,	"
    +	"	Valine	* 	0.001	,	"
    +	"	Histidine	* 	0.001	,	"
    +	"	Arginine	* 	0.001	,	"
    +	"	Non_essential_amino_acids	* 	0.001	,	"
    +	"	Tyrosine	* 	0.001	,	"
    +	"	Cysteine	* 	0.001	,	"
    +	"	Alanine	* 	0.001	,	"
    +	"	Aspartic_acid	* 	0.001	,	"
    +	"	Glutamic_acid	* 	0.001	,	"
    +	"	Glycine	* 	0.001	,	"
    +	"	Proline	* 	0.001	,	"
    +	"	Serine	* 	0.001	,	"
    +	"	Taurine	* 	0.001	,	"
    +	"	Total_fatty_acids	* 	1	,	"
    +	"	Total_essential_fatty_acids	* 	1	,	"
    +	"	Total_saturated_fatty_acids	* 	1	,	"
    +	"	Butyric_acid	* 	0.001	,	"
    +	"	Caproic_acid	* 	0.001	,	"
    +	"	Caprylic_acid	* 	0.001	,	"
    +	"	Capric_acid	* 	0.001	,	"
    +	"	Lauric_acid	* 	0.001	,	"
    +	"	Tridecanoic_acid	* 	0.001	,	"
    +	"	Myristic_acid	* 	0.001	,	"
    +	"	Pentadecanoic_acid	* 	0.001	,	"
    +	"	Palmitic_acid	* 	0.001	,	"
    +	"	Heptadecanoic_acid	* 	0.001	,	"
    +	"	Stearic_acid	* 	0.001	,	"
    +	"	Arachidic_acid	* 	0.001	,	"
    +	"	Heneikosan_Mountain	* 	0.001	,	"
    +	"	Mount_Behen	* 	0.001	,	"
    +	"	Trichoic_acid	* 	0.001	,	"
    +	"	Lignoceric_acid	* 	0.001	,	"
    +	"	Total_monounsaturated_fatty_acids	* 	1	,	"
    +	"	Myristoleic_acid	* 	0.001	,	"
    +	"	Palmitoleic_acid	* 	0.001	,	"
    +	"	Heptadecenic_acid	* 	0.001	,	"
    +	"	Oleic_acid	* 	0.001	,	"
    +	"	Baksensan	* 	0.001	,	"
    +	"	Mount_Gadole	* 	0.001	,	"
    +	"	Mount_Eruk	* 	0.001	,	"
    +	"	Mount_Nerbon	* 	0.001	,	"
    +	"	Total_polyunsaturated_fatty_acids	* 	1	,	"
    +	"	Linoleic_acid	* 	0.001	,	"
    +	"	Alpha_Linolenic_Acid	* 	0.001	,	"
    +	"	Gamma_Linolenic_Acid	* 	0.001	,	"
    +	"	Eicosadienoic_acid	* 	0.001	,	"
    +	"	Eicosatrienoic_acid	* 	0.001	,	"
    +	"	Eicosatrienoic_acid	* 	0.001	,	"
    +	"	Arachidonic_acid	* 	0.001	,	"
    +	"	Eicosapentaenoic_acid	* 	0.001	,	"
    +	"	Docosadienosan	* 	0.001	,	"
    +	"	Docosapentaenoic_acid	* 	0.001	,	"
    +	"	Docosahexaenoic_acid	* 	0.001	,	"
    +	"	Omega_3	* 	1	,	"
    +	"	Omega_6	* 	1	,	"
    +	"	Total_trans_fatty_acids	* 	1	,	"
    +	"	Trans_oleic_acid	* 	0.001	,	"
    +	"	Trans_linoleic_acid	* 	0.001	,	"
    +	"	Trans_linolenic_acid	* 	0.001	,	"
    +	"	calcium	* 	0.001	,	"
    +	"	iron	* 	0.001	,	"
    +	"	magnesium	* 	0.001	,	"
    +	"	sign	* 	0.001	,	"
    +	"	potassium	* 	0.001	,	"
    +	"	salt	* 	0.001	,	"
    +	"	zinc	* 	0.001	,	"
    +	"	Copper	* 	0.001	,	"
    +	"	manganese	* 	0.001	,	"
    +	"	Selenium	* 	0.000001	,	"
    +	"	molybdenum	* 	0.000001	,	"
    +	"	iodine	* 	0.000001	,	"
    +	"	Retinol	* 	0.000001	,	"
    +	"	Beta_carotene	* 	0.000001	,	"
    +	"	Vitamin_B1	* 	0.001	,	"
    +	"	Vitamin_B2	* 	0.001	,	"
    +	"	Niacin	* 	0.001	,	"
    +	"	Niacin_NE	* 	0.001	,	"
    +	"	Nicotinic_acid	* 	0.001	,	"
    +	"	Nicotinamide	* 	0.001	,	"
    +	"	Pantothenic_acid	* 	0.001	,	"
    +	"	Vitamin_B6	* 	0.001	,	"
    +	"	Pyridoxine	* 	0.001	,	"
    +	"	Biotin	* 	0.000001	,	"
    +	"	Folic_acid_DFE	* 	0.000001	,	"
    +	"	Folic_Acid_Food_Folic_Acid	* 	0.000001	,	"
    +	"	Folic_acid_added_folic_acid	* 	0.000001	,	"
    +	"	Vitamin_B12	* 	0.000001	,	"
    +	"	Vitamin_C	* 	0.001	,	"
    +	"	Vitamin_D	* 	0.000001	,	"
    +	"	Vitamin_D2	* 	0.000001	,	"
    +	"	Vitamin_D3	* 	0.000001	,	"
    +	"	Vitamin_E	* 	0.001	,	"
    +	"	Alpha_tocopherol	* 	0.001	,	"
    +	"	Beta_tocopherol	* 	0.001	,	"
    +	"	Gamma_Tocopherol	* 	0.001	,	"
    +	"	Delta_tocopherol	* 	0.001	,	"
    +	"	Alpha_tocotrienol	* 	0.001	,	"
    +	"	Beta_tocotrienol	* 	0.001	,	"
    +	"	Gamma_Tocotrienol	* 	0.001	,	"
    +	"	Delta_Tocotrienol	* 	0.001	,	"
    +	"	Vitamin_K	* 	0.000001	,	"
    +	"	Vitamin_K1	* 	0.000001	,	"
    +	"	Vitamin_K2	* 	0.000001	,	"
    +	"	cholesterol	* 	0.001	,	"
    +	"	Salt_equivalent	* 	1	,	"
    +	"	Discard_rate	* 	1		"
    +   "   FROM food_detail WHERE name = ? "
    const SelectResult = await db.queryParam_Parse(SelectQuery,[req.params.food]);

    let resData = SelectResult[0];

     console.log(req.params.food);
    if(!SelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));   
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "음식성분 전체조회", resData));      
    }
});


module.exports = router;