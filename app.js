const express = require('express'),
PORT = 3000 || process.env.PORT,
authRoute = require('./routes/auth'),
postRoute = require('./routes/posts'),
mongoose = require('mongoose'),
 app = express();
const cookieParser =require('cookie-parser');
const auth = require('./routes/verifytoken');


//connect to DB
mongoose.connect('mongodb+srv://admin:admin@jwt-vujji.mongodb.net/test?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true },
() => console.log('connected to db'));

app.set('view engine', 'ejs');
//? MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true })) //* This line is required for html forms to give data
app.use(cookieParser());
//Route middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)



//TODO JWT switches tokens every time only possible way is to use http headers

app.get('/api/check', auth, (req,res)=>{
    res.render('check')
})


app.listen(PORT,() =>{
    console.log(`Server is running on ${PORT}`);
});