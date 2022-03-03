export default {
  webRoot:{
    default: "/",
    dsfa: '/',
    webPath: '/DreamWeb/'
  },
  defaultTheme: "red-theme",
  assetsDir: "./static/",
  htmlDir:"./",
  // viewsPCDir:"./pc/views/",
  // viewsMobileDir:"./mobile/views/",
  designer: {
    //设计器编辑页面自定义样式时的基础样式变量
    scss: ["variable.scss", "themes.scss", "mixins.scss"],
  },
  kw: {
    id: "_id",
    order: "ds_order",
    deleted: "ds_deleted",
    unitid: "ds_unit_id",
    createtime: "ds_create_time",
    updatetime: "ds_update_time",
    updateusername: "ds_update_user_name",
    updateuserid: "ds_update_user_id",
    createusername: "ds_create_user_name",
    createuserid: "ds_create_user_id",
  },
};