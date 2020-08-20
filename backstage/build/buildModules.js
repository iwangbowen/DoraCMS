const fs = require('fs');
const path = require('path');
const os = require('os');
const envSetStr = os.type() == 'Windows_NT' ? 'set' : 'export';
var modulesPath = path.resolve(__dirname, '../');
var shell = require('shelljs');
var settings = require('../publicMethods/settings');

const {
    scanFiles,
    scanFolder,
    uploadByQiniu
} = require('./utils');
// 指定打包模块
let designatedModules = ['content'];

let copyType = "dev",
    targetModules = '',
    localDistPath = ''; //  ALL 或 separate 可选
const argv = process.argv;
if (argv[2] == '--type') {
    copyType = argv[3];
}
if (argv[4] == '--modules') {
    targetModules = argv[5];
    if (targetModules && targetModules != 'ALL') {
        if (targetModules.indexOf(',') >= 0 && targetModules.split(',').length > 0) {
            designatedModules = designatedModules.concat(targetModules.split(','));
        } else {
            designatedModules.push(targetModules);
        }
        console.log('begin build target module: ', targetModules);
    }
}

if (argv[6] == '--localDistPath') {
    localDistPath = argv[7];
}

const targetBuildModules = designatedModules.length ? designatedModules : scanFolder(modulesPath);
targetBuildModules
    .filter(dir => dir != '.git' && dir != 'build' && dir != 'publicMethods' && dir != 'dist')
    .forEach(function (name) {
        console.log(modulesPath, name);
        shell.cd(`${modulesPath}/${name}`);
        shell.exec(`npm run build`);
        if (!fs.existsSync(`${modulesPath}/dist/${name}`)) {
            shell.mkdir('-p', `${modulesPath}/dist/${name}`);
        } else {
            shell.rm('-rf', `${modulesPath}/dist/${name}/*`);
        }
        shell.cp('-R', `${modulesPath}/${name}/dist/*`, `${modulesPath}/dist/${name}`);
        console.info(`module ${name} build success!`);
    });

if (copyType == 'prd') {

    let uploadInfo = [];

    let updateQiniu = async (uploadInfo) => {
        console.log('Begin upload to Qiniu');
        for (const uploadItem of uploadInfo) {
            let {
                localFile,
                pathKey
            } = uploadItem;

            console.log(`Begin upload ${pathKey}`);
            await uploadByQiniu(localFile, settings.qiniuStaticPath + pathKey);
            console.log(`Upload ${pathKey} success!`);
        }
        console.log('All upload to Qiniu success!');
    }

    if (designatedModules.length > 0) {
        for (const moduleItem of targetBuildModules) {
            uploadInfo = scanFiles(modulesPath, `${modulesPath}/dist/${moduleItem}`);
            updateQiniu(uploadInfo);

            if (localDistPath) {
                let targetLocalPluginPath = `${localDistPath}/${moduleItem}`;
                if (fs.existsSync(targetLocalPluginPath)) {
                    shell.rm('-rf', `${targetLocalPluginPath}/*`);
                }
                shell.cp('-R', `${modulesPath}/dist/${moduleItem}/*`, `${targetLocalPluginPath}`);
            }

        }
    } else {
        if (localDistPath) {
            if (fs.existsSync(`${modulesPath}/dist`)) {
                shell.rm('-rf', `${modulesPath}/dist/*`);
            }
            shell.cp('-R', `${modulesPath}/dist/*`, `${localDistPath}`);
        }
        uploadInfo = scanFiles(modulesPath, `${modulesPath}/dist`);
        updateQiniu(uploadInfo);
    }
}