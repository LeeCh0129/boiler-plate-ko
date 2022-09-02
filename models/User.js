// 유저와 관련된 데이터들을 보관하기 위한 UserModel - Model은 Schema를 감싸주는 역할

const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema)

module.exports = { User }