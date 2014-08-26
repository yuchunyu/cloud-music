var querystring = require('querystring'),
	url = require('url');

function router(req, res){
	this.req = req;
	this.res = res;
	this.req.params = {};
	this.req.body = {};
	this.res.render = getRender;
	this.res.send = getSend;
	this.res.redirect = getRedirect;
}

//get
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
		callback(_this.req, _this.res);	
	}	
};

//post
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
 *	支持/testt/:asda/asd/:asd
 */
function isRouter(path, reqPath){
	var reg = /:\w+\//img;
	path = path.replace(reg,'\\w+\\\/');
	var regReqPath = new RegExp('^' + path + '$','img');
	return regReqPath.test(reqPath);
};