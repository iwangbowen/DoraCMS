/**
 * Created by dora on 2015/4/8.
 * 创建数据库连接
 * 该模块只会被加载一次
 */

module.exports = {
//    数据库配置
    COOKIE_SECRET: 'doramart.com',
    URL: 'mongodb://127.0.0.1:27017/doracms',
    DB: 'doracms',
    HOST: '127.0.0.1',
    PORT: 27017,
    USERNAME: 'doracms',
    PASSWORD: '000000',


//    站点基础信息配置

    SITETITLE : '前端开发俱乐部', // 站点名称
    SITEDOMAIN : 'http://www.html-js.cn', // 站点域名
    SITEICP : '粤ICP备111111号-2', // 站点备案号
    SYSTEMMAIL : 'xxxx@163.com', //站点邮箱
    UPDATEFOLDER : process.cwd()+'/public/upload', // 默认上传文件夹本地路径
    TEMPSFOLDER : process.cwd()+'/views/web/temp', // 默认模板文件夹本地路径
    DATAOPERATION : process.cwd()+'/models/db/bat', //数据库操作脚本目录
    DATABACKFORDER : 'C:/softbak/xxxx/', // 服务端数据库操作脚本目录
    CMSDISCRIPTION : '前端开发俱乐部,分享前端知识,丰富前端技能。汇集国内专业的前端开发文档,为推动业内前端开发水平共同奋斗。html,js,css,nodejs,前端开发,jquery,web前端, web前端开发, 前端开发工程师',
    SITEKEYWORDS : '前端开发俱乐部,前端俱乐部,DoraCMS内容管理系统, 前端开发, web前端, web前端开发, 前端开发工程师, 设计, 开发, 前端资源, angularjs, JavaScript,js, Ajax, jQuery, html,html5,css3,浏览器兼容, 前端开发工具, nodejs , node , boostrap',
    SITEBASICKEYWORDS : '前端开发俱乐部,前端开发,前端俱乐部,DoraCMS', // 基础关键词
    STATICFILEPATH : '', // 静态文件空间地址
    UPDATEFILEPATH : '', // 上传文件空间地址
    QINIUACCESS_KEY : '',  // 七牛秘钥
    QINIUSECRET_KEY : '',  // 七牛秘钥
    QINIUCMSBUCKETNAME : '',  // 七牛Bucket_Name

    SYSTEMMANAGE : 'sysTemManage_0',  // 后台模块(系统管理)
    ADMINUSERLIST : 'sysTemManage_0_1',
    ADMINGROUPLIST : 'sysTemManage_0_2',
    EMAILTEMPLIST : 'sysTemManage_0_3',
    ADSLIST : 'sysTemManage_0_4',
    FILESLIST : 'sysTemManage_0_5',
    DATAMANAGE : 'sysTemManage_0_6', // 数据管理
    BACKUPDATA : 'sysTemManage_0_6_1', // 数据备份


    CONTENTMANAGE : 'contentManage_1', // 后台模块(内容管理)
    CONTENTLIST : 'contentManage_1_1',
    CONTENTCATEGORYS : 'contentManage_1_2',
    CONTENTTAGS : 'contentManage_1_3', //标签管理
    CONTENTTEMPS : 'contentManage_1_4', //模板管理
    CONTENTTYPES : 'contentManage_1_5',  // 内容属性管理
    CONTENTFILMTYPES : 'contentManage_1_5_1',  // 内容属性管理
    CONTENTCOUNTRYTYPES : 'contentManage_1_5_2',  // 内容属性管理
    CONTENTYEARSTYPES : 'contentManage_1_5_3',  // 内容属性管理
    MESSAGEMANAGE : 'contentManage_1_6', // 留言管理

    USERMANAGE : 'userManage_2', // 后台模块(会员管理)
    REGUSERSLIST: 'userManage_2_1'

};



