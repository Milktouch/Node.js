const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
   res.redirect('/homepage')
})
router.get('/homepage',(req,res)=>{
    res.send('you are at the homepage ')

})

module.exports = router