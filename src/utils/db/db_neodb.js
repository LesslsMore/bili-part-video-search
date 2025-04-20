import Dexie from 'dexie'
import {exportDB, importDB} from "dexie-export-import"
import {saveAs} from 'file-saver'

// 初始化数据库
const db = new Dexie('neodb')

// 定义所有支持的类型
const categories = ['book', 'movie', 'tv', 'music', 'game']

// 动态创建表结构
const stores = {}
categories.forEach(category => {
    stores[category] = '[type+page], type, page'
})

db.version(1).stores(stores)



export {categories, db}
