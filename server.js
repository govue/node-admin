const express = require('express')
const app = new express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser') // post数据插件
const passport = require('passport') // passport
const port = process.env.PORT || 5000

// 路由引入
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')

// DB config
const db = require('./config/keys').mongoURI

// connect mongodb
mongoose.connect(db)
        .then(() => console.log('mongodb connected'))
        .catch((err) => console.log(err))

// passport初始化
app.use(passport.initialize())
require('./config/passport')(passport)

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello world!')
})

// 路由使用
app.use('/api/users', users)
app.use('/api/profiles', profiles)

app.listen(port, () => {
    console.log(`server start at port ${port}`)
})
