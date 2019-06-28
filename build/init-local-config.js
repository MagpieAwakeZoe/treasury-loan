var fs = require('fs');
var path = require('path');

// 生成配置文件的路径
var configPath = path.resolve(__dirname, '../src/local-config.json');

// 生成config文件
fs.writeFileSync(configPath, JSON.stringify({
	env: 'development'
}, null, 4));

console.log(configPath + ' had created');