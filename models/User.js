// 유저와 관련된 데이터들을 보관하기 위한 UserModel - Model은 Schema를 감싸주는 역할

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
        // 비밀번호를 암호화 시켜줌.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb) {
    
    // plainPassword 1234567        암호화된 비밀번호 $2b$10$038rCRpnRwYvwZymwItyjulGEJB1T80WipI1NU4bwUHtvoLUv/IeG
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    
    var user = this;
    // console.log('user._id', user._id)

    // jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function ( token, cb) {
    var user = this;

    // user._id + '' = token
    // 토큰을 decode 한다.
    // verify a token symmetric
    // jwt.verify(token, 'shhhhh', function(err, decoded) {
    //     console.log(decoded.foo) // bar
    // });
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })

}

const User = mongoose.model('User', userSchema)

module.exports = { User }