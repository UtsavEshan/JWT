const router = require('express').Router();
const verify = require('./verifytoken');


router.get('/', verify, (req,res) => {
    res.json({
        posts: {
            title:'my first pet',
            description: 'random data you shoudn\'t access'
        }
    })
})


module.exports = router;


//ZHANGJIAJIE