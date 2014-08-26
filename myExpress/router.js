var querystring = require('querystring'),
	url = require('url'),
	fs = require('fs'),
	mmieTypeConf = require('./mmieType');

function router(req, res){
	this.req = req;
	this.res = res;
	this.req.params = {};
	this.req.query = {};
	this.req.body = {};
	// this.res.render = getRender;
	this.res.send = getSend;
	this.res.redirect = getRedirect;
	//getRender res.render('index', {user: 'ADMIN'});
	this.res.render = function(view, option){
		fs.readFile('views/' + view + '.html', 'utf8', function(err, data){
			if(err){
				console.log('view', view, 'is undefined');
	           	res.end('view', view, 'is undefined');
			}else{
				res.writeHead(200, {'Content-Type':'text/html'});
				res.end(data);
			}
		});
	};
	
	//处理静态文件
	if(url.parse(this.req.url).pathname.indexOf('.') >= 0){
		dealWithStatic(url.parse(this.req.url).pathname,res);
	}
};
//get
router.prototype.get = function(path, callback){
	var _this = this;
	if(_this.req.method != 'GET'){
		return;
	}
	var path = path + '/';
	var reqPath = url.parse(_this.req.url).pathname + '/';
	if(isRouter(path, reqPath)){
		console.log('This method is GET');
		console.log('This router is ', path);
		/*处理冒号后面的参数到params*/
		setParams(_this, path, reqPath);
		console.log('The request params is [', _this.req.params, ']');
		/*处理query -> GET /test?s=123&&t=343 */
		_this.req.query = querystring.parse(url.parse(_this.req.url).query);
		console.log('The request query is [', _this.req.query, ']');
		callback(_this.req, _this.res);
		return;
	}	
};
//post
router.prototype.post = function(path, callback){
	var _this = this;
	if(_this.req.method != 'POST'){
		return;
	}
	var path = path + '/';
	var reqPath = url.parse(_this.req.url).pathname + '/';
	if(isRouter(path, reqPath)){
		console.log('This method is POST');
		console.log('This router is ', path);
		/*处理冒号后面的参数到params*/
		setParams(_this, path, reqPath);
		/*处理body -> POST /test data:{s:222,t:ax} */
		var postData = '';
        _this.req.on('data', function(data){
        	console.log('[data] ',data);
            postData += data;
        });
        _this.req.on('end', function(){
            _this.req.body = querystring.parse(postData);
            r.call( _this, route, callback );
        } );
		callback(_this.req, _this.res);
		return;
	}
};	
//getRender res.render('index', {user: 'ADMIN'});
function getRender(view, option){
	fs.readFile('views/' + view + '.html', 'utf8', function(err, data){
		if(err){
			console.log('view', view, 'is undefined');
            res.end('view', view, 'is undefined');
		}else{
			res.writeHead(200, {'Content-Type':'text/html'});
			res.end(data);
		}
	});
}
//getRender res.send(user: 'ADMIN'});
function getSend(option){
}
//getRender res.redirect('index');
function getRedirect(view){
}
module.exports = router;
/*
 *	支持/testt/:asda/asd/:asd
 *	不支持/*
 */
function isRouter(path, reqPath){
	var reg = /:\w+\//img;
	path = path.replace(reg,'\\w+\\\/');
	var regReqPath = new RegExp('^' + path + '$','img');
	return regReqPath.test(reqPath);
};
/*
 *	处理冒号后面的参数到params
 */
function setParams(obj, path, reqPath){
 	if(path.indexOf(':') >= 0){
		var arrPath = path.split('/');
		var arrReqPath = reqPath.split('/');
		for (var i = 0; i < arrPath.length; i++) {
			if(arrPath[i].indexOf(':') >= 0){
				obj.req.params[arrPath[i].split(':')[1]] = arrReqPath[i];
			}		
		};
	}
};
/*
 *	静态资源处理
 */
function dealWithStatic(pathName, res){
	var realPath = 'public' + pathName;
	//判断是否存在
	fs.exists(realPath, function(exists){
		if(!exists){
			res.writeHead(404, {'Content-Type':'text/plain'});
			res.write('The request url ' + pathName + ' was not found on this server.');
			console.log('The request url ' + pathName + ' was not found on this server.');
			res.end();
		}else{
			var dealType = pathName.substring(pathName.lastIndexOf('.') + 1);
			var mmieType = mmieTypeConf[dealType] || '';
			//读取文件信息，并转化为二进制数据
			fs.readFile(realPath,'binary',function(err,file){
				if(err){
					res.writeHead(500, {'Content-Type':'text/plain'});
					console.log('[err]',err);
					res.end(err);
				}else{
					res.writeHead(200, {'Content-Type':mmieType});
					res.write(file,'binary');
					res.end();
				}
			});
		}
	});
};

