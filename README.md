cloud-music
===========

这是一个在线音乐播放系统，支持pc端播放，移动端播放，pc端管理


---------
本项目采用nodejs去封装实现

分析：
###1. 首先实现一个简单的http服务器

    var http = require('http');
	http.createServer(function(req,res){
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Hello World');	
	}).listen(9217);
	console.log('Server running at http://127.0.0.1:9217/');

执行命令

	node http.js
	Server running at http://127.0.0.1:9217/

通过页面访问 http://127.0.0.1:9217/  成功显示 Hello World

###2. 认识fs、url模块

	var http = require('http'),
	fs = require('fs'),
	url = require('url');
	http.createServer(function(req,res){
		var pathName = url.parse(req.url).pathname;
		console.log('pathName:',pathName);
		console.log('url:',req.url);
		console.log('method:',req.method);
		console.log('headers:',req.headers);
	}).listen(9217);
	console.log('Server running at http://127.0.0.1:9217/');

通过页面访问后

	pathName: /test
	url: /test
	method: GET
	headers: { 
	  host: '127.0.0.1:9217',
	  connection: 'keep-alive',
	  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
	  'accept-encoding': 'gzip,deflate,sdch',
	  'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6',
	  cookie: 'connect.sess=s%3Aj%3A%7B%22passport%22%3A%7B%22user%22%3A%7B%22provider%22%3A%22yunoauth2%22%2C%22openID%22%3A%22b9c4fcee61876f38e91c088ffe42cef0%22%2C%22name%22%3A%22qd%40lewifi.com%22%2C%22email%22%3A%22qd%40lewifi.com%22%7D%7D%2C%22flash%22%3A%7B%7D%2C%22user%22%3A%7B%22_id%22%3A%22b9c4fcee61876f38e91c088ffe42cef0%22%2C%22number%22%3A%22300000002%22%2C%22nickName%22%3A%22qd%40lewifi.com%22%2C%22email%22%3A%22qd%40lewifi.com%22%2C%22password%22%3A%228878743bef28601a47b8ff5ffc6a2790%22%2C%22mobile%22%3A%22%22%2C%22role%22%3A%22channel%22%2C%22status%22%3A%22verified%22%2C%22emailStatus%22%3A%221%22%2C%22contact%22%3A%22%22%2C%22created%22%3Anull%2C%22updated%22%3A%222014-08-13T02%3A30%3A14.188Z%22%2C%22channel%22%3A%7B%22address%22%3Anull%2C%22area%22%3A%22%E5%8C%97%E4%BA%AC%22%2C%22contact%22%3A%221234567%22%2C%22company%22%3A%22%E5%85%89%E9%9F%B3%E7%9B%9B%E4%B8%96%22%2C%22industry%22%3A%5B%22%E9%A4%90%E9%A5%AE%22%5D%2C%22verifyImg%22%3Anull%2C%22conferProfession%22%3A%5B%22%E7%BD%91%E5%90%A7%22%5D%2C%22conferArea%22%3A%22%E5%8C%97%E4%BA%AC%2C%E4%B8%9C%E5%9F%8E%22%2C%22depositStatus%22%3Anull%2C%22depositMoney%22%3A800000%2C%22depositAdjustMoney%22%3Anull%2C%22depositAdjustType%22%3Anull%2C%22depositAdjustStatus%22%3Anull%2C%22depositAdjustTime%22%3Anull%7D%2C%22competition%22%3A%221%22%2C%22audit%22%3A%221%22%2C%22depositMoney%22%3A20000%2C%22userID%22%3A%22b9c4fcee61876f38e91c088ffe42cef0%22%7D%7D.oq3jVxfJNlCUt9XZ2hBsJjCMoWC%2FHQQYY7V0yhc0QP8; subshow1=1; subshow0=1; connect.sid=s%3As2Li2iAeWkD1zR05JJrjj9UBOQROIS05.L9m513yPOeptT9c9ZsBviW5SmwviXsGc%2ByWguZeYkwE; express:sess=eyJ1c2VyIjpudWxsfQ==; express:sess.sig=OGDtMLnaWiM0hcNB6hfGsWaUy6s; subshow5=1; leftnav=2; Hm_lvt_3f3daee9db40d3961d573d9e3d6388d2=1408702145; Hm_lpvt_3f3daee9db40d3961d573d9e3d6388d2=1408941002; isAudit=true',
	  'ra-ver': '2.4.12',
	  'ra-sid': '7CCAC862-20140716-074632-d630e5-786b4b' }

由此能看出来req这个(request)对象主要获取请求的资源信息，包括请求的url、客户端参数、资源文件、header信息、HTTP版本客户端编码等数据信息。
而res这个(response)对象，主要是响应客户端请求数据，包括header处理、HTTP请求返回码、响应请求数据等。

###3. 根据获取的url路径可以做成一个简单的路由

所谓路由，就是指根据不同客户端的请求资源路径，来分配服务器处理逻辑
（1）通过switch来实现路由
	这种方法，简单易懂，但是请求资源非常复杂时候，会显得臃肿，难以维护和扩展。
（2）通过特定规则去请求路径
	即，根据用户请求的url，依照特定的规则得到响应的执行函数。
	例如，请求路径为index，那么通过一定规则处理得到其处理函数名字resIndex,然后通过 eval(functionName + '()') 的方式执行，新增逻辑，只需要在服务器端新增响应的处理函数即可。
	这种方法，根据路径去判断需要调用的函数和模块，对小项目来说可以实现这种路由处理，缺点是res/req参数必须设置为全局变量，否则函数中无法获取该req和res对象参数。
（3）利用附带参数来实现路由控制
	例如，'/index?c=index' ，表示获取index模块中的index方法
（4）利用斜杠附带内容实现路由控制
	例如，'/index/index' ，表示获取index模块中的index方法

###4. 初步编写自己的express
	
	app.js
	------
	var express = require('./myExpress/express'),
		app = express();
	//启动端口
	app.listen(9217, function(){
		console.log('启动服务端口 9217');
	});

	express.js
	------
	var http = require('http'),
		url = require('url'),
		router = require('../lib/router.js');
	/*
	 * this is my express 在这里创建出来服务器
	 */
	var app = http.createServer();
	function express(){
		console.log('创建服务器');
		return app;
	}		
	/*
	 * this is request log and router 这里处理请求打印在控制台和分发到路由
	 */
	app.on('request',function(req, res){
		var startDate = new Date();  //开始时间
		var pathName = url.parse(req.url).pathname;
		//过滤默认ico请求
		if('/favicon.ico' != pathName){
			/*
			 * 进行路由处理
			 */
			router(req, res);
			//信息处理
			var endDate = new Date(); //结束时间
			/*
			 * 控制台打印格式和颜色
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

	router.js
	------
	var querystring = require('querystring'),
		url = require('url');
	//实例化一个路由对象
	function router(req, res){
		this.req = req;
		this.res = res;
		this.req.params = {};
		this.req.body = {};
		this.res.render = getRender;
		this.res.send = getSend;
		this.res.redirect = getRedirect;
	}
	//处理get方式
	router.prototype.get = function(path, callback){
		var _this = this;
		var path = path + '/';
		var reqPath = _this.req.url + '/';
		if(isRouter(path, reqPath)){
			/*处理冒号后面的参数到params*/
			if(path.indexOf(':') >= 0){
				var arrPath = path.split('/');
				var arrReqPath = reqPath.split('/');
				for (var i = 0; i < arrPath.length; i++) {
					if(arrPath[i].indexOf(':') >= 0){
						_this.req.params[arrPath[i].split(':')[1]] = arrReqPath[i];
					}		
				};
			} 
			/*处理body*/
			//还没写
			callback(_this.req, _this.res);	
		}	
	};
	//处理post方式
	router.prototype.post = function(){
	};	
	//getRender res.render('index', {user: 'ADMIN'});
	function getRender(view, option){
	}
	//getRender res.send(user: 'ADMIN'});
	function getSend(option){
	}
	//getRender res.redirect('index');
	function getRedirect(view){
	}
	module.exports = router;
	/*
	 *	处理路由转发条件
	 *	支持以下格式
	 *	/test
	 *	/test/test
	 *	/test/:name
	 *	/test/:name/:pwd
	 *	/test/:name/update/:pwd
	 *	等常用格式
	 */
	function isRouter(path, reqPath){
		var reg = /:\w+\//img;
		path = path.replace(reg,'\\w+\\\/');
		var regReqPath = new RegExp('^' + path + '$','img');
		return regReqPath.test(reqPath);
	};
