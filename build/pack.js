const path = require('path');
const fs = require('fs');
const PKG = require('../package.json');
let JSZIP = require('jszip');
let zip = new JSZIP();
const del = require('del');

const checkParam = () => {
    if (!PKG.extInfo) {
        console.error('配置信息不完整，package.json 缺少 extInfo 配置信息');
        return false;
    }
    if (!PKG.extInfo.rarName) {
        console.error('配置信息不完整，extInfo 缺少 rarName 字段');
        return false;
    }
    return true;
};

//读取目录及文件
function readDir(obj, nowPath) {
    let files = fs.readdirSync(nowPath); //读取目录中的所有文件及文件夹（同步操作）
    files.forEach(function (fileName, index) { //遍历检测目录中的文件
        let fillPath = nowPath + '/' + fileName;
        let file = fs.statSync(fillPath); //获取一个文件的属性
        if (file.isDirectory()) { //如果是目录的话，继续查询
            let dirlist = zip.folder(fileName); //压缩对象中生成该目录
            readDir(dirlist, fillPath); //重新检索目录文件
        } else {
            obj.file(fileName, fs.readFileSync(fillPath)); //压缩目录添加文件
        }
    });
}

//开始压缩文件
function compressFolder(name) {
    const folderPath = path.resolve(__dirname, '../dist');
    const targetPath = path.resolve(__dirname, `../dist/${name}.zip`);
    readDir(zip, folderPath);
    zip.generateAsync({ //设置压缩格式，开始打包
        type: 'nodebuffer', //nodejs用
        compression: 'DEFLATE', //压缩算法
        compressionOptions: { //压缩级别
            level: 9
        }
    }).then(function (content) {
        // 删除文件
        del.sync([`${folderPath}/*`]);
        fs.writeFileSync(targetPath, content, 'utf-8'); //将打包的内容写入 当前目录下的 result.zip中
        console.log('打包完成！');
    });
}



const createExtJsonFile = () => {
    if (checkParam()) {
        let extInfo = Object.assign({
            name: PKG.name,
            'description': PKG.dependencies || '',
            'version': PKG.version,
            'author': PKG.author,
            'index': 'index.html',
            'db': [],
            'width': 700,
            'height': 700
        }, PKG.extInfo);
        if (extInfo.logo) {
            // 移动复制logo文件到根目录
            const logoPath = path.resolve(__dirname, `../${extInfo.logo}`);
            const logoTargetPath = path.resolve(__dirname, '../dist/logo.png');
            fs.copyFileSync(logoPath, logoTargetPath);
        }
        const filePath = path.resolve(__dirname, '../dist/ext.json');
        fs.writeFile(filePath, JSON.stringify(extInfo, '', '\t'), { encoding: 'utf-8' }, (err) => {
            if (err) console.error('生成文件出错，请重试！');
            // 执行压缩打包
            compressFolder(extInfo.rarName);
        });
    }
};

createExtJsonFile();
