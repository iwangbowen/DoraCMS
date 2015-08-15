/**
 * Created by Administrator on 2015/5/30.
 */

var Settings = require("./settings");

var siteFunc = {

    siteInfos : function(title,cmsDescription,keyWords,isDetail){
        var discrip;
        var key;

        if(cmsDescription){
            discrip = cmsDescription;
        }else{
            discrip = Settings.CMSDISCRIPTION;
        }

        if(keyWords){
            key = keyWords + ',' + Settings.SITEBASICKEYWORDS;
        }else{
            key = Settings.SITEKEYWORDS;
        }


        return {
            title : title + " | " + Settings.SITETITLE,
            cmsDescription : discrip,
            keywords : key,
            siteIcp : Settings.SITEICP,
            isDetail : isDetail
        }
    }
}

module.exports = siteFunc;