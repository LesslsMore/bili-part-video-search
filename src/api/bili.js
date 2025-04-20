import request from "@/utils/request.js";

function getPageList(data, page, size) {
  return request({
    url: `/video/list/${page}/${size}`,
    method: 'post',
    data
  })
}

function get_cids_items(part, page, limit) {
  return request({
    url: `/cids`,
    method: 'post',
    data: {
      part,
      page,
      limit,
    }
  })
}

export {
  getPageList,
  get_cids_items,
}
