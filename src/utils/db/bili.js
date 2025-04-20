export function get_mid() {
    let url = window.location.href
    // console.log(url)
    let mid = url.split('/')[3]
    return mid;
}

export function get_pn() {
    let items = document.querySelectorAll(".be-pager-item")
    let item = items[items.length - 1]
    let pn = item.textContent
    // console.log(pn);
    // console.log(items);
    return pn
}

export function get_vlist() {
    let items = document.querySelectorAll(".small-item.fakeDanmu-item")
    let vlist = []
    items.forEach(item => {
        // console.log(item)
        vlist.push({bvid: item.dataset.aid})
    })
    return vlist
}

export function mid_map2tree(id_map) {
    let mids = Object.keys(id_map);
    return mids.map(mid => {
        return {
            id: mid,
            pn: id_map[mid].pn,
            children: bvid_obj2list(id_map[mid].bvids)
        }
    })
}

export function bvid_obj2list(bvid_obj) {
    let bvids = Object.keys(bvid_obj);
    return bvids.map(bvid => {
        return {
            id: bvid,
            pn: bvid_obj[bvid]
        }
    })
}

export function bvid2cids(obj) {
    const bvid = obj.data.bvid
    // https://www.bilibili.com/video/BV19K4y1L7MT?p=57
    let item_info = []
    obj.data.pages.forEach(el => {
        let url = `https://www.bilibili.com/video/${bvid}?p=${el.page}`
        let hyperlink = `https://www.bilibili.com/video/${bvid}`
        // console.log(url)
        // console.log(el.part)
        let title = {text:obj.data.title, hyperlink}
        let mid = obj.data.owner.mid
        let name = obj.data.owner.name
        let view = obj.data.stat.view

        let page = el.page
        let cid = el.cid
        let part = {text: el.part, hyperlink: url}
        let duration = new Date(el.duration  * 1000).toISOString().substr(11, 8)

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
            url,
        })
    })
    return item_info
}

export async function get_save_mid_up(mid, pn) {
    let {id_map} = await chrome.storage.local.get('id_map')
    if (id_map === undefined) {
        id_map = {}
    }
    if (!id_map.hasOwnProperty(mid)) {
        id_map[mid] = {pn, bvids: {}}
    }
    console.log(id_map)

    chrome.storage.local.set({id_map}, async function () {
        console.log('保存成功！');
        let {id_map} = await chrome.storage.local.get('id_map')
        console.log(id_map)
    });
}

export async function get_save_mid_bvids(mid, bvids) {
    let {id_map} = await chrome.storage.local.get('id_map')
    if (!id_map.hasOwnProperty(mid)) {
        id_map[mid] = {bvids: {}}
    }
    id_map[mid].bvids = bvids
    chrome.storage.local.set({id_map}, async function () {
        console.log('保存成功！');
        let {id_map} = await chrome.storage.local.get('id_map')
        console.log(id_map)
    });
}
