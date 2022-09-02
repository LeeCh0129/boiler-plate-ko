const { request } = require('express')
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

// bodyParser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게함.
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());


const { User } = require("./models/User");
mongoose.connect('mongodb+srv://admin:1424125abb!@cluster0.o2erudw.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/register', (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어줌.
    
    const user = new User(req.body)

    user.save((err, userInfor) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })

})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))