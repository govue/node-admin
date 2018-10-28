// loing & regist
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt') // 加密
const gravatar = require('gravatar') // 全球公认头像
const passport = require('passport')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const User = require('../../models/user') // 用户模型

// $route GET /api/users/test
// @desc
// @access public
// router.get('/test', (req, res) => {
//     res.json({msg: 'login....'})
// })

//$route POST /api/users/register
//@desc 返回注册信息
//@access public
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                return res.status(400).json('邮箱已被占用')
            } else {
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'})
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if (err) throw err
                        newUser.password = hash

                        // 将数据写入数据库
                        newUser.save()
                               .then(user => res.json(user))
                               .catch(err => console.log(err))
                    })
                })
            }
        })
})

// $route POST /api/users/login
// @desc 返回token jwt password
// @access public
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // 查询数据库
    User.findOne({email})
        .then(user => {
            if (!user) {
                return res.status(404).json('用户不存在')
            }

            // 如果邮箱存在，验证密码
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                      if (isMatch) {
                          const rule = {
                              id: user.id,
                              name: user.name,
                              avatar: user.avatar,
                              identity: user.identity
                          }
                          jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                              if (err) throw err
                              return res.json({
                                  success: true,
                                  token: 'Bearer ' + token
                              })
                          })
                      } else {
                          return res.status(400).json('密码错误')
                      }
                  })
        })
})

// $route GET /api/users/current
// @desc return current user
// @access private
router.get('/current',passport.authenticate('jwt', {session: false}) ,(req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})

module.exports = router
