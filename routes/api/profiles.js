const express = require('express')
const router = express.Router()
const passport = require('passport')
const Profile = require('../../models/profile') // 模型

// $route GET /api/profiles/test
// @desc
// @access public
router.get('/test', (req, res) => {
    res.json({msg: 'profile....'})
})

// $route POST /api/profiles/add
// @desc 添加信息接口
// @access private
router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileFields = {}

    if (req.body.type) profileFields.type = req.body.type
    if (req.body.describe) profileFields.describe = req.body.describe
    if (req.body.income) profileFields.income = req.body.income
    if (req.body.expend) profileFields.expend = req.body.expend
    if (req.body.cash) profileFields.cash = req.body.cash
    if (req.body.remark) profileFields.remark = req.body.remark

    // 将数据写入数据库
    new Profile(profileFields).save()
        .then((profile) => {
            res.json(profile)
        })
})

// $route DELETE /
// @desc 删除一条信息接口
// @access private
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOneAndRemove({_id: req.params.id})
               .then(profile => {
                   profile.save()
                          .then(profile => res.json(profile))
               })
               .catch(err => res.status(404).json('删除失败！'))
    })

// $route POST /api/profiles/edit
// @desc 修改信息接口
// @access private
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileFields = {}

    if (req.body.type) profileFields.type = req.body.type
    if (req.body.describe) profileFields.describe = req.body.describe
    if (req.body.income) profileFields.income = req.body.income
    if (req.body.expend) profileFields.expend = req.body.expend
    if (req.body.cash) profileFields.cash = req.body.cash
    if (req.body.remark) profileFields.remark = req.body.remark

    // 在数据库中修改数据
    Profile.findOneAndUpdate(
        {_id: req.params.id},
        {$set: profileFields},
        {new: true}
    ).then(profile => res.json(profile))
})

// $route GET api/profiles
// @desc 获取所有信息接口
// @access private
router.get(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.find()
            .then(profile => {
                if (!profile) {
                    return res.status(404).json('没有任何内容')
                }
                res.json(profile) // 返回数据
            })
            .catch(err => res.status(404).json(err))
    })

// $route GET /
// @desc 获取一条信息接口
// @access private
router.get(
    '/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Profile.findOne({_id: req.params.id})
            .then(profile => {
                if (!profile) {
                    return res.status(404).json('没有任何内容')
                }

                res.json(profile) // 返回数据
            })
            .catch(err => res.status(404).json(err))
    })

module.exports = router
