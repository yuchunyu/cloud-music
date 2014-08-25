var http = require('http'),
	url = require('url'),
	router = require('../lib/router.js');


/*
 * this is my express
 */
var app = http.createServer();
function express(){
	console.log('创建服务器');
	return app;
}
	
/*
 * this is request log and router
 */
app.on('request',function(req, res){
	var startDate = new Date();  //开始时间
	var pathName = url.parse(req.url).pathname;

	//过滤默认ico请求
	if('/favicon.ico' != pathName){
		//进行路由处理
		router(req, res);
		//信息处理
		var endDate = new Date();  //结束时间
		/*
		 * GET /images/loding.gif 304 1ms
		 * POST /getIndex 200 43ms - 29b
		 */
		var colorStatus = '';
        switch( res.statusCode ){
            case 200 :
                colorStatus = '\x1B[32m';
                break;
            case 404 :
                colorStatus = '\x1B[31m';
                break;
            case 302 :
                colorStatus = '\x1B[36m';
                break;
            default:
            	colorStatus = '\x1B[33m';
                break;
        }
		console.log('\x1B[90m', req.method, req.url, colorStatus, res.statusCode, '\x1B[90m', endDate - startDate + 'ms', '\x1B[39m');
	}
});




exports = module.exports = express;