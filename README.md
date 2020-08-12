# iTools-Extension-Template

iTools 扩展开发模板，支持直接打包为插件压缩文件。

说明：package.json 文件，特殊标识字段，描述扩展详细信息。

```json
{
    // 扩展打包读取字段
    "extInfo": {
        "name": "Github", // 扩展名称，如果没有会取 package.json 的 name 字段
        "rarName": "github", // 扩展包的名字，必须
        "index": "index.html", // 插件首页文件
        "logo": "", // 扩展 logo 地址，为 png 格式图片
        "width": 700, // 扩展窗口的宽度，默认：700
        "height": 700, // 扩展窗口的高度，默认：700
        "db": [], // 需要支持的数据库名称，可以为空
        "author": "康兵奎", // 作者名称，如果没有会取 package.json 的 author 字段
        "version": "1.0.0", // 插件版本，如果没有会取 package.json 的 version 字段
        "description": "iTools插件开发模板，支持直接打包为插件压缩包。", // 插件描述，如果没有会取 package.json 的 description 字段
    },
}
```
