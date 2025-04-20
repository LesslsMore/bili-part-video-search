import { GM_cookie, unsafeWindow, monkeyWindow, GM_addElement } from '$';

function interceptor() {
    'use strict';

    // // 1. 拦截XHR请求
    // const originalXHROpen = XMLHttpRequest.prototype.open;
    // XMLHttpRequest.prototype.open = function(method, url) {
    //     if (url.includes('ads.com')) {
    //         console.log('屏蔽广告请求:', url);
    //         return; // 直接阻断请求
    //     }
    //     originalXHROpen.apply(this, arguments);
    // };

    // 2. 拦截Fetch请求
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(input, init) {

        const response = await originalFetch(input, init);

        const url = typeof input === 'string' ? input : input.url;
        // 精准匹配目标接口
        // console.log(`url: `, url)
        if (url.includes('api.bilibili.com/x/space/wbi/arc/search')) {

            // 提取URL参数
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const mid = urlParams.get('mid');
            const pn = urlParams.get('pn');
            const ps = urlParams.get('ps');
            console.log('提取参数:', {mid, pn, ps});

            // 获取全局 mids
            let mids = [];
            try {
                if (window.monkeyMids) {
                    if (typeof window.monkeyMids === 'string') {
                        mids = JSON.parse(window.monkeyMids);
                    } else if (Array.isArray(window.monkeyMids)) {
                        mids = window.monkeyMids;
                    }
                }
            } catch (e) {
                console.warn('解析 monkeyMids 失败', e);
            }
            if (mids.includes(Number(mid)) || mids.includes(mid)) {
                const cloned = response.clone();
                cloned.json().then(async data => {
                    console.log('Fetch响应内容:', data);
                    if (data && data.data && data.data.list && data.data.list.vlist) {
                        const db_bili = (window.db_bili || (await import('@/utils/db/db.js')).db_bili);
                        await db_bili.vlist.bulkPut(data.data.list.vlist);
                        console.log('已同步 vlist 到 IndexedDB');
                    }
                });
            }
        }
        return response;
    };
}

export {
    interceptor 
}