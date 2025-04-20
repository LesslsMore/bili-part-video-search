import Dexie from 'dexie'
import {exportDB, importDB} from "dexie-export-import"
import {saveAs} from 'file-saver'

const db_name_bili = 'bili'
const db_name_json = 'json'

const db_schema_bili = {
    vlist: '&bvid, mid',
    cids: '&cid, bvid, mid, view', // 主键 索引
    // bvids: '&bvid',
}

const mids = [37974444, 302417610]

// 原始数据
// const db_schemas = {
//     pages: '&pn',
// }

const db_schema_json = {
    bvids: '&bvid',
}

mids.forEach(mid => {
    let schema = `pages[${mid}]`
    db_schema_json[schema] = '&pn'
})

const db_bili = get_db(db_name_bili, db_schema_bili)
const db_json = get_db(db_name_json, db_schema_json)

const db_obj = {
    [db_name_bili]: db_bili,
    [db_name_json]: db_json,
}

function get_db(db_name, db_schema, db_ver = 1) {
    let db = new Dexie(db_name)
    // 默认版本为从 1 开始
    db.version(db_ver).stores(db_schema)
    return db
}

// 导出 indexeddb 数据
async function export_db(_, databaseName) {
    console.log('export_db:')
    console.log(new Date())
    let databases = await Dexie.getDatabaseNames()
    console.log(databases)

    if (!databases.includes(databaseName)) {
        throw new Error(`数据库 ${databaseName} 不存在`)
    }
    const dbInstance = new Dexie(databaseName)
    await dbInstance.open()
    const blob = await exportDB(dbInstance);
    saveAs(blob, `IndexedDB_${databaseName}.json`);

    console.log(new Date())
}

// 导入 indexeddb 数据
async function import_db(file) {
    console.log('import_db:')
    console.log(new Date())
    console.log(file)
    const blob = new Blob([file.raw], { type: file.raw.type });
    await importDB(blob);
    console.log(new Date())
}


export {
    get_db, 
    export_db, 
    import_db, 
    db_bili, 
    db_json,
    mids,
}
