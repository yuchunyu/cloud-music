var express = require('./myExpress/express'),
	app = express();

//启动端口
app.listen(9217, function(){
	console.log('Start the service port 9217');
});
