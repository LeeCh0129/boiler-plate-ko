// 유저와 관련된 데이터들을 보관하기 위한 UserModel - Model은 Schema를 감싸주는 역할

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// saltRounds -> salt를 생성 -> Salt를 이용해서 비밀번호를 암호화 해야함.

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 공백을 없애주는 역할
        unique: 1 // 중복 불가능
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number // 토큰을 사용할 수 있는 기간
    }

})


userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')){
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }
})


const User = mongoose.model('User', userSchema)

module.exports = { User }