var querystring = require('querystring');

function router(req, res){
	this.req = req;
	this.res = res;
	this.req.params = {};
	this.req.body = {};
	this.res.render = getRender;
	// this.res.send = getSend;
	// this.res.redirect = getRedirect;
}

//get
router.prototype.get = function(path, callback){
	// console.log('&&&',path,this.req.url);
	var _this = this;
	if(isRouter(path, _this.req.url)){
		// console.log('%%%',path);
		if(path.indexOf(':') >= 0){
			_this.req.params[path.split(':')[1]] = _this.req.url.replace(path.split(':')[0],'');
		} 
		callback(_this.req, _this.res);	
	}	
};
//post
router.prototype.post = function(){

};	

//getRender res.render('index', {user: 'ADMIN'});
function getRender(view, option){
	console.log('getRender:',view);
}

module.exports = router;


/*
 *	目前暂时制定支持一下部分
 *	/index
 *	/index/getByID
 *	/index/:id
 */
function isRouter(path, reqPath){
	var path = path.split('/');
	var reqPath = reqPath.split('/');
	if(path == reqPath){
		return true;
	}
	if(path[2] && reqPath[2] && path[1] == reqPath[1]){
		return true;
	}
	return false;
};