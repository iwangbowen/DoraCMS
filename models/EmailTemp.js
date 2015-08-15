/**
 * Created by Administrator on 2015/4/15.
 * 邮件模板
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var emailTemp = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    title:  String,
    type: String, // 模板类别
    subject : String, // 邮件概要
    date: { type: Date, default: Date.now },
    comments : {} // 邮件详情
});

var EmailTemp = mongoose.model("EmailTemp",emailTemp);

module.exports = EmailTemp;

