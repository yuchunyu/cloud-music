var querystring = require('querystring'),
	url = require('url'),
	fs = require('fs');

function router(req, res){
	this.req = req;
	this.res = res;
	this.req.params = {};
	this.req.query = {};
	this.req.body = {};
	
	this.res.render = getRender;
	this.res.send = getSend;
	this.res.redirect = getRedirect;
}

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