webpackJsonp([57],{160:function(t,e,n){var a=n(4)(n(684),n(788),null,null,null);t.exports=a.exports},684:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(94);e.default={props:{dataList:Array},data:function(){return{green:{color:"#13CE66"},red:{color:"#FF4949"}}},methods:{handleSelectionChange:function(t){this.multipleSelection=t},editAdsInfo:function(t,e){var n=e[t];this.$store.dispatch("adsInfoForm",{edit:!0,formData:n}),this.$router.push("/editAds/"+n._id)},deleteAds:function(t,e){var n=this;this.$confirm(this.$t("main.del_notice"),this.$t("main.scr_modal_title"),{confirmButtonText:this.$t("main.confirmBtnText"),cancelButtonText:this.$t("main.cancelBtnText"),type:"warning"}).then(function(){return a.a.delAds({ids:e[t]._id})}).then(function(t){200===t.data.status?(n.$store.dispatch("getAdsList"),n.$message({message:n.$t("main.scr_modal_del_succes_info"),type:"success"})):n.$message.error(t.data.message)}).catch(function(){n.$message({type:"info",message:n.$t("main.scr_modal_del_error_info")})})}}}},788:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{align:"center",data:t.dataList,"tooltip-effect":"dark"},on:{"selection-change":t.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),n("el-table-column",{attrs:{prop:"name",label:t.$t("ads.name"),width:"120"}}),t._v(" "),n("el-table-column",{attrs:{prop:"type",label:t.$t("ads.type"),width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return["0"==e.row.type?n("span",[t._v(t._s(t.$t("ads.typeText")))]):t._e(),t._v(" "),"1"==e.row.type?n("span",[t._v(t._s(t.$t("ads.typePic")))]):t._e()]}}])}),t._v(" "),n("el-table-column",{attrs:{prop:"state",label:t.$t("ads.enable"),width:"100","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[n("i",{class:e.row.state?"fa fa-check-circle":"fa fa-minus-circle",style:e.row.state?t.green:t.red})]}}])}),t._v(" "),n("el-table-column",{attrs:{prop:"comments",label:t.$t("ads.getCode"),width:"280","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s('<AdsPannel id="'+e.row._id+'" />'))])]}}])}),t._v(" "),n("el-table-column",{attrs:{prop:"comments",label:t.$t("ads.dis"),"show-overflow-tooltip":""}}),t._v(" "),n("el-table-column",{attrs:{label:t.$t("main.dataTableOptions")},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{size:"mini",type:"primary",plain:"",round:""},on:{click:function(n){t.editAdsInfo(e.$index,t.dataList)}}},[n("i",{staticClass:"fa fa-edit"})]),t._v(" "),n("el-button",{attrs:{size:"mini",type:"danger",plain:"",round:"",icon:"el-icon-delete"},on:{click:function(n){t.deleteAds(e.$index,t.dataList)}}})]}}])})],1)],1)},staticRenderFns:[]}}});