var express = require('./myExpress/express'),
	app = express();

//启动端口
app.listen(9217, function(){
	console.log('启动服务端口 9217');
});
