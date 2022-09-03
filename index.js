const { request } = require('express')
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require("./models/User");

// bodyParser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게함.
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))




app.get('/', (req, res) => res.send('Hello World!'))


app.post('/register', (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어줌.
    
    const user = new User(req.body)
    // User.js
    user.save((err, userInfor) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {

    // 요청된 이메일을 데이터베이스에서 있는지 찾음.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 데이터 베이스에서 요청한 E-mail이 있다면 비밀번호가 맞는지 확인. -> Bcrypt를 이용하여 plain pwd와 암호화된 (Hashed) 패스워드가 같은지 확인

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            // 비밀번호 까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장. where ? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })

            })
        })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))