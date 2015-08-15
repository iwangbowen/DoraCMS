/**
 * Created by Administrator on 2015/4/15.
 * 广告管理
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var types = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },

    type : { type :Number , default : 0}, // 约定属性的类别： 0：影视分类  1:影视地区分类  2:时间年份
    name : String,
    comments: String // 备注
});

var Types = mongoose.model("Types",types);

module.exports = Types;

