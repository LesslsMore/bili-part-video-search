// ==UserScript==
// @name         bilibili 视频合集标题搜索
// @namespace    https://github.com/LesslsMore/bili-part-video-search
// @version      0.1.0
// @author       lesslsmore
// @description  bilibili 视频合集标题搜索, 分 P 搜索
// @license      MIT
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @match        https://space.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.9.8/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/axios@1.8.4/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/dexie@4.0.11/dist/dexie.min.js
// @require      https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js
// @require      https://cdn.jsdelivr.net/npm/@element-plus/icons-vue@2.3.1/dist/index.iife.min.js
// @require      https://cdn.jsdelivr.net/npm/dexie-export-import@4.1.4/dist/dexie-export-import.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.9.8/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .monkey-el-select-popper[data-v-7754cf6b]{z-index:10001!important} ");

(function (vue, ElementPlusIconsVue, Dexie, dexieExportImport, fileSaver, axios, ExcelJS, ElementPlus) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const ElementPlusIconsVue__namespace = /*#__PURE__*/_interopNamespaceDefault(ElementPlusIconsVue);

  const db_name_bili = "bili";
  const db_name_json = "json";
  const db_schema_bili = {
    vlist: "&bvid, mid",
    cids: "&cid, bvid, mid, view"
    // 主键 索引
    // bvids: '&bvid',
  };
  const mids = [37974444, 302417610];
  const db_schema_json = {
    bvids: "&bvid"
  };
  mids.forEach((mid) => {
    let schema = `pages[${mid}]`;
    db_schema_json[schema] = "&pn";
  });
  const db_bili = get_db(db_name_bili, db_schema_bili);
  const db_json = get_db(db_name_json, db_schema_json);
  function get_db(db_name, db_schema, db_ver = 1) {
    let db2 = new Dexie(db_name);
    db2.version(db_ver).stores(db_schema);
    return db2;
  }
  async function export_db(_, databaseName) {
    console.log("export_db:");
    console.log(/* @__PURE__ */ new Date());
    let databases = await Dexie.getDatabaseNames();
    console.log(databases);
    if (!databases.includes(databaseName)) {
      throw new Error(`数据库 ${databaseName} 不存在`);
    }
    const dbInstance = new Dexie(databaseName);
    await dbInstance.open();
    const blob = await dexieExportImport.exportDB(dbInstance);
    fileSaver.saveAs(blob, `IndexedDB_${databaseName}.json`);
    console.log(/* @__PURE__ */ new Date());
  }
  async function import_db(file) {
    console.log("import_db:");
    console.log(/* @__PURE__ */ new Date());
    console.log(file);
    const blob = new Blob([file.raw], { type: file.raw.type });
    await dexieExportImport.importDB(blob);
    console.log(/* @__PURE__ */ new Date());
  }
  const db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    db_bili,
    db_json,
    export_db,
    get_db,
    import_db,
    mids
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$6 = {
    __name: "Indexed",
    setup(__props) {
      const searchObjRef = vue.ref();
      let total = vue.ref();
      let tableData = vue.ref([]);
      let currentPage4 = vue.ref(1);
      let pageSize4 = vue.ref(10);
      let searchObj = vue.ref({
        name: "",
        mid: "",
        bvid: "",
        part: ""
      });
      let keys = vue.ref(
        {
          "name": 10,
          "title.text": 45,
          "part.text": 45,
          "page": 8,
          "view": 8,
          "duration": 10,
          "mid": 10,
          "bvid": 12,
          "cid": 11,
          "url": 38
        }
      );
      function sort_data({ prop, order }) {
        console.log(prop, order);
      }
      async function fetchData() {
        tableData.value = await filter(searchObj.value.name, currentPage4.value, pageSize4.value);
      }
      async function filter(word, page, limit) {
        console.log(word);
        const collection = db_bili.cids.orderBy("view").filter((item) => {
          try {
            return item.part.text.includes(word);
          } catch (e) {
            console.log(e);
            console.log(item.part);
          }
        });
        const res = await collection.toArray();
        total.value = res.length;
        const result = await collection.reverse().offset((page - 1) * limit).limit(limit).toArray();
        console.log(result);
        return result;
      }
      const small = vue.ref(false);
      const background = vue.ref(false);
      const disabled = vue.ref(false);
      const handleSizeChange = (val) => {
        console.log(`${val} items per page`);
        fetchData();
      };
      const handleCurrentChange = (val) => {
        console.log(`current page: ${val}`);
        fetchData();
      };
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_form, {
            ref_key: "searchObjRef",
            ref: searchObjRef,
            style: { "max-width": "600px" },
            model: vue.unref(searchObj),
            "status-icon": "",
            rules: _ctx.rules,
            "label-width": "auto",
            class: "demo-ruleForm"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, { label: "分段视频名称" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    modelValue: vue.unref(searchObj).name,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(searchObj).name = $event)
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    icon: vue.unref(ElementPlusIconsVue.Search),
                    size: "mini",
                    onClick: _cache[1] || (_cache[1] = ($event) => fetchData())
                  }, {
                    default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                      vue.createTextVNode("搜索")
                    ])),
                    _: 1
                  }, 8, ["icon"]),
                  vue.createVNode(_component_el_button, {
                    icon: vue.unref(ElementPlusIconsVue.Refresh),
                    size: "mini",
                    onClick: _ctx.resetData
                  }, {
                    default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                      vue.createTextVNode("重置")
                    ])),
                    _: 1
                  }, 8, ["icon", "onClick"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["model", "rules"]),
          vue.createVNode(_component_el_table, {
            data: vue.unref(tableData),
            border: "",
            style: { "width": "100%" },
            onSortChange: sort_data
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(Object.entries(vue.unref(keys)), ([head, width], index) => {
                return vue.openBlock(), vue.createBlock(_component_el_table_column, {
                  sortable: "custom",
                  key: index,
                  prop: head,
                  label: head,
                  width: width * 10
                }, null, 8, ["prop", "label", "width"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["data"]),
          vue.createVNode(_component_el_pagination, {
            "current-page": vue.unref(currentPage4),
            "onUpdate:currentPage": _cache[2] || (_cache[2] = ($event) => vue.isRef(currentPage4) ? currentPage4.value = $event : currentPage4 = $event),
            "page-size": vue.unref(pageSize4),
            "onUpdate:pageSize": _cache[3] || (_cache[3] = ($event) => vue.isRef(pageSize4) ? pageSize4.value = $event : pageSize4 = $event),
            "page-sizes": [10, 20, 50, 100, 200, 500, 1e3],
            small: small.value,
            disabled: disabled.value,
            background: background.value,
            layout: "total, sizes, prev, pager, next, jumper",
            total: vue.unref(total),
            onSizeChange: handleSizeChange,
            onCurrentChange: handleCurrentChange
          }, null, 8, ["current-page", "page-size", "small", "disabled", "background", "total"])
        ], 64);
      };
    }
  };
  const service = axios.create({
    baseURL: "https://lesslsmore-api.vercel.app/",
    timeout: 15e3
    // 请求超时时间
  });
  function get_cids_items(part, page, limit) {
    return service({
      url: `/cids`,
      method: "post",
      data: {
        part,
        page,
        limit
      }
    });
  }
  const _sfc_main$5 = {
    __name: "Mongo",
    setup(__props) {
      const searchObjRef = vue.ref();
      let total = vue.ref();
      let tableData = vue.ref([]);
      let currentPage4 = vue.ref(1);
      let pageSize4 = vue.ref(10);
      let searchObj = vue.ref({
        name: "",
        mid: "",
        bvid: "",
        part: ""
      });
      let keys = vue.ref(
        {
          "name": 10,
          "title.text": 45,
          "part.text": 45,
          "page": 8,
          "view": 8,
          "duration": 10,
          "mid": 10,
          "bvid": 12,
          "cid": 11,
          "url": 38
        }
      );
      function sort_data({ prop, order }) {
        console.log(prop, order);
      }
      async function fetchData() {
        const res = await get_cids_items(searchObj.value.name, currentPage4.value, pageSize4.value);
        tableData.value = res.data.data;
        total.value = res.data.total;
      }
      const small = vue.ref(false);
      const background = vue.ref(false);
      const disabled = vue.ref(false);
      const handleSizeChange = (val) => {
        console.log(`${val} items per page`);
        fetchData();
      };
      const handleCurrentChange = (val) => {
        console.log(`current page: ${val}`);
        fetchData();
      };
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_form, {
            ref_key: "searchObjRef",
            ref: searchObjRef,
            style: { "max-width": "600px" },
            model: vue.unref(searchObj),
            "status-icon": "",
            rules: _ctx.rules,
            "label-width": "auto",
            class: "demo-ruleForm"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, { label: "分段视频名称" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    modelValue: vue.unref(searchObj).name,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(searchObj).name = $event)
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    icon: vue.unref(ElementPlusIconsVue.Search),
                    size: "mini",
                    onClick: _cache[1] || (_cache[1] = ($event) => fetchData())
                  }, {
                    default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                      vue.createTextVNode("搜索")
                    ])),
                    _: 1
                  }, 8, ["icon"]),
                  vue.createVNode(_component_el_button, {
                    icon: vue.unref(ElementPlusIconsVue.Refresh),
                    size: "mini",
                    onClick: _ctx.resetData
                  }, {
                    default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                      vue.createTextVNode("重置")
                    ])),
                    _: 1
                  }, 8, ["icon", "onClick"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["model", "rules"]),
          vue.createVNode(_component_el_table, {
            data: vue.unref(tableData),
            border: "",
            style: { "width": "100%" },
            onSortChange: sort_data
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(Object.entries(vue.unref(keys)), ([head, width], index) => {
                return vue.openBlock(), vue.createBlock(_component_el_table_column, {
                  sortable: "custom",
                  key: index,
                  prop: head,
                  label: head,
                  width: width * 10
                }, null, 8, ["prop", "label", "width"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["data"]),
          vue.createVNode(_component_el_pagination, {
            "current-page": vue.unref(currentPage4),
            "onUpdate:currentPage": _cache[2] || (_cache[2] = ($event) => vue.isRef(currentPage4) ? currentPage4.value = $event : currentPage4 = $event),
            "page-size": vue.unref(pageSize4),
            "onUpdate:pageSize": _cache[3] || (_cache[3] = ($event) => vue.isRef(pageSize4) ? pageSize4.value = $event : pageSize4 = $event),
            "page-sizes": [10, 20, 50, 100, 200, 500, 1e3],
            small: small.value,
            disabled: disabled.value,
            background: background.value,
            layout: "total, sizes, prev, pager, next, jumper",
            total: vue.unref(total),
            onSizeChange: handleSizeChange,
            onCurrentChange: handleCurrentChange
          }, null, 8, ["current-page", "page-size", "small", "disabled", "background", "total"])
        ], 64);
      };
    }
  };
  const _sfc_main$4 = {
    __name: "Search",
    setup(__props) {
      const dialogVisible = vue.ref(false);
      const activeTab = vue.ref("Indexed");
      const openDialog = () => {
        dialogVisible.value = true;
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_tab_pane = vue.resolveComponent("el-tab-pane");
        const _component_el_tabs = vue.resolveComponent("el-tabs");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          !dialogVisible.value ? (vue.openBlock(), vue.createBlock(_component_el_button, {
            key: 0,
            type: "primary",
            onClick: openDialog,
            style: { "position": "fixed", "left": "20px", "bottom": "20px", "z-index": "9999" }
          }, {
            default: vue.withCtx(() => _cache[2] || (_cache[2] = [
              vue.createTextVNode(" 搜索 ")
            ])),
            _: 1
          })) : vue.createCommentVNode("", true),
          vue.createVNode(_component_el_dialog, {
            modelValue: dialogVisible.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => dialogVisible.value = $event),
            fullscreen: "",
            top: "40vh",
            width: "70%",
            draggable: ""
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_tabs, {
                modelValue: activeTab.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => activeTab.value = $event),
                onTabClick: _ctx.handleTabClick
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_tab_pane, {
                    label: "Indexed",
                    name: "Indexed"
                  }, {
                    default: vue.withCtx(() => [
                      activeTab.value === "Indexed" ? (vue.openBlock(), vue.createBlock(_sfc_main$6, { key: 0 })) : vue.createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_tab_pane, {
                    label: "Mongo",
                    name: "Mongo"
                  }, {
                    default: vue.withCtx(() => [
                      activeTab.value === "Mongo" ? (vue.openBlock(), vue.createBlock(_sfc_main$5, { key: 0 })) : vue.createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue", "onTabClick"])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 64);
      };
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$3 = {
    __name: "indexeddb",
    setup(__props) {
      let dbNames = vue.ref([]);
      let selectedDb = vue.ref("");
      vue.onMounted(async () => {
        let databases = await Dexie.getDatabaseNames();
        console.log(databases);
        dbNames.value = databases;
        if (dbNames.value.length > 0) selectedDb.value = dbNames.value[0];
      });
      function handleExportDb() {
        if (!selectedDb.value) {
          ElMessage.error("请选择数据库名称");
          return;
        }
        export_db(null, selectedDb.value);
      }
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_upload = vue.resolveComponent("el-upload");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_upload, {
            multiple: "",
            "auto-upload": false,
            accept: ".json",
            "on-change": vue.unref(import_db),
            "show-file-list": false
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                icon: _ctx.Upload,
                type: "primary"
              }, {
                default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                  vue.createTextVNode("import_db")
                ])),
                _: 1
              }, 8, ["icon"])
            ]),
            _: 1
          }, 8, ["on-change"]),
          vue.createVNode(_component_el_button, {
            icon: _ctx.Download,
            type: "primary",
            onClick: handleExportDb
          }, {
            default: vue.withCtx(() => _cache[2] || (_cache[2] = [
              vue.createTextVNode("export_db")
            ])),
            _: 1
          }, 8, ["icon"]),
          vue.createVNode(_component_el_select, {
            modelValue: vue.unref(selectedDb),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(selectedDb) ? selectedDb.value = $event : selectedDb = $event),
            placeholder: "选择数据库名称",
            style: { "width": "100px", "z-index": "10000" },
            "popper-append-to-body": "",
            "popper-class": "monkey-el-select-popper"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(dbNames), (db2) => {
                return vue.openBlock(), vue.createBlock(_component_el_option, {
                  key: db2,
                  label: db2,
                  value: db2
                }, null, 8, ["label", "value"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 64);
      };
    }
  };
  const indexeddb = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-7754cf6b"]]);
  async function export_excel() {
    let tb_name = "cids";
    console.log("export_excel...");
    console.log(/* @__PURE__ */ new Date());
    const res = await db_bili[tb_name].toArray();
    res.sort((a, b) => {
      if (a.view != b.view) {
        return b.view - a.view;
      } else {
        return a.page - b.page;
      }
    });
    console.log(res.length);
    const keys = {
      "name": 10,
      "title": 45,
      "part": 45,
      "page": 4,
      "view": 8,
      "duration": 8,
      "mid": 10,
      "bvid": 12,
      "cid": 10,
      "url": 45
    };
    const columns = [];
    for (const [header, width] of Object.entries(keys)) {
      columns.push({ header, key: header, width: width * 1.2 });
    }
    await exportToExcel(res, tb_name, columns);
    console.log(/* @__PURE__ */ new Date());
  }
  async function exportToExcel(jsonData, tb_name, columns) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(tb_name);
    worksheet.columns = columns;
    jsonData.forEach((record) => {
      worksheet.addRow(record);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${db_bili.name}.xlsx`);
  }
  async function import_excel(_, file) {
    console.log("import_excel:");
    console.log(/* @__PURE__ */ new Date());
    console.log(file);
    console.log(/* @__PURE__ */ new Date());
  }
  function bvid2cids(obj) {
    const bvid = obj.data.bvid;
    let item_info = [];
    obj.data.pages.forEach((el) => {
      let url = `https://www.bilibili.com/video/${bvid}?p=${el.page}`;
      let hyperlink = `https://www.bilibili.com/video/${bvid}`;
      let title = { text: obj.data.title, hyperlink };
      let mid = obj.data.owner.mid;
      let name = obj.data.owner.name;
      let view = obj.data.stat.view;
      let page = el.page;
      let cid = el.cid;
      let part = { text: el.part, hyperlink: url };
      let duration = new Date(el.duration * 1e3).toISOString().substr(11, 8);
      item_info.push({
        name,
        title,
        part,
        page,
        view,
        duration,
        mid,
        bvid,
        cid,
        url
      });
    });
    return item_info;
  }
  const import_json_bvids = async (_, file) => {
    console.log("import_json_bvids...");
    console.log(/* @__PURE__ */ new Date());
    let json_str = await file.raw.text();
    let json_obj = JSON.parse(json_str);
    let bvid = json_obj.data.bvid;
    db_json.bvids.put({ bvid, json_obj });
    console.log(/* @__PURE__ */ new Date());
  };
  async function vlist2bvids() {
    console.log("vlist2bvids...");
    console.log(/* @__PURE__ */ new Date());
    const new_bvids = await db_bili.vlist.orderBy("bvid").primaryKeys();
    const old_bvids = await db_json.bvids.orderBy("bvid").primaryKeys();
    const bvids = new_bvids.filter((item) => !old_bvids.includes(item));
    console.log(bvids.length);
    for (const bvid of bvids) {
      try {
        const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
        if (!response.ok) {
          console.error(`请求失败: ${bvid}`, response.status);
          continue;
        }
        const json_obj = await response.json();
        console.log("fetch 成功：", bvid);
        console.log(json_obj);
        await db_json.bvids.put({ bvid, json_obj });
      } catch (e) {
        console.error("fetch 异常：", bvid, e);
      }
    }
    console.log(/* @__PURE__ */ new Date());
  }
  async function bvids2cids() {
    console.log("bvids2cids...");
    console.log(/* @__PURE__ */ new Date());
    const old_bvids = await db_bili.cids.orderBy("bvid").uniqueKeys();
    let bvids = await db_json.bvids.toArray();
    for (let { bvid, json_obj } of bvids) {
      if (old_bvids.includes(bvid)) continue;
      let cids = bvid2cids(json_obj);
      console.log(`每 bvid 下 cid 数: ${cids.length}`);
      await db_bili.cids.bulkPut(cids);
    }
    console.log(/* @__PURE__ */ new Date());
  }
  const import_json_pages = async (_, file) => {
    console.log("import_json_pages...");
    console.log(/* @__PURE__ */ new Date());
    let json_str = await file.raw.text();
    let json_obj = JSON.parse(json_str);
    let vlist = json_obj.data.list.vlist;
    let mid = vlist[0].mid;
    let pn = json_obj.data.page.pn;
    await db_json[`pages[${mid}]`].put({ pn, json_obj });
    console.log(/* @__PURE__ */ new Date());
  };
  const _hoisted_1 = { style: { "margin": "10px 0" } };
  const _sfc_main$2 = {
    __name: "Storage",
    setup(__props) {
      const midsInput = vue.ref(JSON.stringify(mids));
      vue.watch(midsInput, (val) => {
        try {
          window.monkeyMids = JSON.parse(val);
        } catch (e) {
          window.monkeyMids = [];
        }
      }, { immediate: true });
      return (_ctx, _cache) => {
        const _component_el_tag = vue.resolveComponent("el-tag");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_upload = vue.resolveComponent("el-upload");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createVNode(_component_el_tag, null, {
              default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                vue.createTextVNode("mids")
              ])),
              _: 1
            }),
            vue.createVNode(_component_el_input, {
              modelValue: midsInput.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => midsInput.value = $event),
              placeholder: "请输入 mids 数组，如 [1,2,3]"
            }, null, 8, ["modelValue"])
          ]),
          vue.createVNode(indexeddb),
          vue.createVNode(_component_el_upload, {
            multiple: "",
            "auto-upload": false,
            accept: ".json",
            "on-change": vue.unref(import_json_bvids),
            "show-file-list": false
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                icon: vue.unref(ElementPlusIconsVue.Upload),
                type: "primary"
              }, {
                default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                  vue.createTextVNode("上传 bvids json")
                ])),
                _: 1
              }, 8, ["icon"])
            ]),
            _: 1
          }, 8, ["on-change"]),
          vue.createVNode(_component_el_upload, {
            multiple: "",
            "auto-upload": false,
            accept: ".json",
            "on-change": vue.unref(import_json_pages),
            "show-file-list": false
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                icon: vue.unref(ElementPlusIconsVue.Upload),
                type: "primary"
              }, {
                default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                  vue.createTextVNode("上传 pages json")
                ])),
                _: 1
              }, 8, ["icon"])
            ]),
            _: 1
          }, 8, ["on-change"]),
          vue.createVNode(_component_el_button, { onClick: vue.unref(vlist2bvids) }, {
            default: vue.withCtx(() => _cache[5] || (_cache[5] = [
              vue.createTextVNode("vlist2bvids")
            ])),
            _: 1
          }, 8, ["onClick"]),
          vue.createVNode(_component_el_button, { onClick: vue.unref(bvids2cids) }, {
            default: vue.withCtx(() => _cache[6] || (_cache[6] = [
              vue.createTextVNode("bvids2cids")
            ])),
            _: 1
          }, 8, ["onClick"]),
          vue.createVNode(_component_el_upload, {
            "auto-upload": false,
            accept: ".xlsx, .xls",
            "on-change": vue.unref(import_excel),
            "show-file-list": false
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                icon: vue.unref(ElementPlusIconsVue.Upload),
                type: "primary"
              }, {
                default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                  vue.createTextVNode("import_excel")
                ])),
                _: 1
              }, 8, ["icon"])
            ]),
            _: 1
          }, 8, ["on-change"]),
          vue.createVNode(_component_el_button, {
            icon: vue.unref(ElementPlusIconsVue.Download),
            onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(export_excel)())
          }, {
            default: vue.withCtx(() => _cache[8] || (_cache[8] = [
              vue.createTextVNode("export_excel")
            ])),
            _: 1
          }, 8, ["icon"])
        ], 64);
      };
    }
  };
  const _sfc_main$1 = {
    __name: "Setting",
    setup(__props) {
      vue.ref(false);
      vue.ref("Indexed");
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_popover = vue.resolveComponent("el-popover");
        return vue.openBlock(), vue.createBlock(_component_el_popover, {
          placement: "bottom",
          width: 220,
          trigger: "click"
        }, {
          reference: vue.withCtx(() => [
            vue.createVNode(_component_el_button, {
              class: "m-2",
              style: { "position": "fixed", "left": "80px", "bottom": "20px", "z-index": "9999" }
            }, {
              default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                vue.createTextVNode("设置")
              ])),
              _: 1
            })
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_sfc_main$2)
          ]),
          _: 1
        });
      };
    }
  };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_sfc_main$4),
          vue.createVNode(_sfc_main$1)
        ], 64);
      };
    }
  };
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const scriptRel = /* @__PURE__ */ function detectScriptRel() {
    const relList = typeof document !== "undefined" && document.createElement("link").relList;
    return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
  }();
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (deps && deps.length > 0) {
      let allSettled2 = function(promises) {
        return Promise.all(
          promises.map(
            (p) => Promise.resolve(p).then(
              (value) => ({ status: "fulfilled", value }),
              (reason) => ({ status: "rejected", reason })
            )
          )
        );
      };
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector(
        "meta[property=csp-nonce]"
      );
      const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
      promise = allSettled2(
        deps.map((dep) => {
          dep = assetsURL(dep);
          if (dep in seen) return;
          seen[dep] = true;
          const isCss = dep.endsWith(".css");
          const cssSelector = isCss ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
            return;
          }
          const link = document.createElement("link");
          link.rel = isCss ? "stylesheet" : scriptRel;
          if (!isCss) {
            link.as = "script";
          }
          link.crossOrigin = "";
          link.href = dep;
          if (cspNonce) {
            link.setAttribute("nonce", cspNonce);
          }
          document.head.appendChild(link);
          if (isCss) {
            return new Promise((res, rej) => {
              link.addEventListener("load", res);
              link.addEventListener(
                "error",
                () => rej(new Error(`Unable to preload CSS for ${dep}`))
              );
            });
          }
        })
      );
    }
    function handlePreloadError(err) {
      const e = new Event("vite:preloadError", {
        cancelable: true
      });
      e.payload = err;
      window.dispatchEvent(e);
      if (!e.defaultPrevented) {
        throw err;
      }
    }
    return promise.then((res) => {
      for (const item of res || []) {
        if (item.status !== "rejected") continue;
        handlePreloadError(item.reason);
      }
      return baseModule().catch(handlePreloadError);
    });
  };
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function interceptor() {
    const originalFetch = _unsafeWindow.fetch;
    _unsafeWindow.fetch = async function(input, init) {
      const response = await originalFetch(input, init);
      const url = typeof input === "string" ? input : input.url;
      if (url.includes("api.bilibili.com/x/space/wbi/arc/search")) {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        const mid = urlParams.get("mid");
        const pn = urlParams.get("pn");
        const ps = urlParams.get("ps");
        console.log("提取参数:", { mid, pn, ps });
        let mids2 = [];
        try {
          if (window.monkeyMids) {
            if (typeof window.monkeyMids === "string") {
              mids2 = JSON.parse(window.monkeyMids);
            } else if (Array.isArray(window.monkeyMids)) {
              mids2 = window.monkeyMids;
            }
          }
        } catch (e) {
          console.warn("解析 monkeyMids 失败", e);
        }
        if (mids2.includes(Number(mid)) || mids2.includes(mid)) {
          const cloned = response.clone();
          cloned.json().then(async (data) => {
            console.log("Fetch响应内容:", data);
            if (data && data.data && data.data.list && data.data.list.vlist) {
              const db_bili2 = window.db_bili || (await __vitePreload(async () => {
                const { db_bili: db_bili3 } = await Promise.resolve().then(() => db);
                return { db_bili: db_bili3 };
              }, void 0 )).db_bili;
              await db_bili2.vlist.bulkPut(data.data.list.vlist);
              console.log("已同步 vlist 到 IndexedDB");
            }
          });
        }
      }
      return response;
    };
  }
  interceptor();
  const app = vue.createApp(_sfc_main);
  for (const [key, component] of Object.entries(ElementPlusIconsVue__namespace)) {
    app.component(key, component);
  }
  app.use(ElementPlus);
  app.mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );

})(Vue, ElementPlusIconsVue, Dexie, DexieExportImport, saveAs, axios, ExcelJS, ElementPlus);