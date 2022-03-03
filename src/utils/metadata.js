import utils from "./utils";

let metadataMap = {};

let dataType = [
  { text: "文本", value: "string" },
  { text: "日期", value: "date" },
  { text: "数字", value: "number" },
  { text: "对象", value: "object" },
  { text: "时间", value: "time" },
  { text: "大对象", value: "longObject" }
];

let mmtype = function(num) {
  let v = {
    "1": { value: "1", text: "基础元数据" },
    "2": { value: "2", text: "系统元数据" },
    "3": { value: "3", text: "业务元数据" }
  };
  return v[num];
};

let getDataType = function(type) {
  return _.find(dataType, v => {
    return v.value == type;
  });
};


// //  express: "",
//       expressName:"",
//       isNumber: false,
//       max: "",
//       min: "",
//       precision: "",
//       required: false,
//       errorMsg: {}

let validate = function() {
  return null;
};

function add(key, metadata) {
  key = utils.kebabCase(key);
  if (!metadataMap[key]) {
    metadataMap[key] = metadata;
  } else {
    dsf.warn(key + "元数据已经存在");
  }
  return metadataMap[key];
}

function get(key, obj) {
  key = utils.kebabCase(key);
  let m = metadataMap[key](dsf);
  m.ckey = key;
  return dsf.mix(m, obj || {});
}

function use(obj) {
  for (let k in obj) {
    add(k, obj[k]);
  }
}

function all() {
  return metadataMap;
}


export default {
  add,
  get,
  all,
  use,
  mmtype,
  dataType,
  getDataType,
  validate
};