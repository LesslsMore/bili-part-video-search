# bilibili 视频合集标题搜索

在 b 站看视频教程时，有时想找单独知识点的视频内容，但是单个视频播放量质量不高，并且没有连贯性，而很多视频合集教程中有较高质量的讲解，可是没有被搜索工具覆盖到。于是把几个高质量教程 up 主的所有视频合集的标题信息全部爬取下来，做了个简单搜索的插件工具。

## 主要功能

爬取 up 主投稿所有视频列表，及详细信息与视频分段信息，根据视频分段标题进行搜索，从而找到合集视频中特定知识点的分段视频地址

- 获取 up 主所有视频
- 获取视频合集信息
- 视频合集标题搜索
- 数据导入导出

## 使用教程

### 获取 up 主所有视频

https://space.bilibili.com/37974444/upload/video

进入 up 主空间，查看投稿页面，点击左下角设置图标，在弹出面板点击 + mids 按键，会自动添加 up 主的唯一标识 mid

在翻页过程中，会自动将该页视频信息存入到浏览器的 indexeddb bili 数据库 vlist 表中

![](https://raw.githubusercontent.com/LesslsMore/blog-img/master/picgo/20250426160940.png)

### 获取视频合集信息

继续在设置图标的弹出面板点击 vlist2bvids 

会自动爬取上面添加的所有视频到浏览器的 indexeddb json 数据库 bivds 表中

继续点击 bvids2cids 按键，会从之前 bvids 表中提取部分搜索需要用到的视频中合集信息

### 视频合集标题搜索

点击左下角搜索图标，会出现一个搜索页面，输入知识点名称，点击搜索，会模糊匹配，视频合集分段标题，以播放量倒序显示结果，点击 url 就能打开对应合集视频中的分段部分

这里默认搜索的数据来源是 index 是浏览器本地数据库，也可以切换成 mongo 云端数据库，里面导入了 尚硅谷、黑马程序员 的所有视频，主要方便编程知识点学习搜索。

也可以根据自身需要按照上面方式导入其他视频合集进行搜索。

![](https://raw.githubusercontent.com/LesslsMore/blog-img/master/picgo/20250426163114.png)

### 数据导入导出 

支持浏览器本地 indexeddb 数据库导入导出，支持上面搜索显示数据全量 excel 表格导入导出

![](https://raw.githubusercontent.com/LesslsMore/blog-img/master/picgo/20250426163153.png)

上面网页搜索如果使用不太方便，可以将数据导出为 excel 表格，进行筛选搜索排序，会更加快速方便。

下图为导出的 尚硅谷、黑马程序员 全部视频合集共计  73278 条记录进行表格筛选的结果

![](https://raw.githubusercontent.com/LesslsMore/blog-img/master/picgo/20250426163453.png)

## 油猴脚本

### 安装地址

https://greasyfork.org/zh-CN/scripts/484122

### 源码地址

https://github.com/LesslsMore/bili-part-video-search

### 更新记录

0.1.1 优化显示布局

0.1.0 vite-plugin-monkey vue3 element-plus interceptor 项目从 bili-part-video-ext vue3-ts-web 迁移完成

### todo

- 迁移 bili_progress_show

## 技术参考

油猴脚本开发 vue3 element-plus
[vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey/blob/main/README_zh.md)

监听拦截请求
fetch

接口调用
[bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

数据保存导出
[dexie](https://www.npmjs.com/package/dexie)   
[exceljs](https://www.npmjs.com/package/exceljs)

## 最后

如果觉得有价值，赞赏当然最好了，转发分享也不错

![](https://raw.githubusercontent.com/LesslsMore/blog-img/master/picgo/%E8%B5%9E%E8%B5%8F.png)