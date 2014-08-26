var router = require('../myExpress/router.js');

module.exports = function(req, res){
	//初始化
	var route = new router(req, res);
	//路由分发
	/*
	 *	目前暂时制定支持一下部分
	 *	/index
	 *	/index/getByID
	 *	/index/:id
	 */
	route.get('/test/:name/test/:pwd', function(req, res){
		var name = req.params.name;
		// console.log('[name],',name);
		// console.log('route is test');
	    res.render('index', {user: 'ADMIN'});
	});
	route.get('/', function(req, res){
		var name = req.params.name;
		// console.log('[name],',name);
		// console.log('route is test');
	    res.render('index', {user: 'ADMIN'});
	});
	route.get('/test/:name', function(req, res){
		var name = req.params.name;
		// console.log('[name],',name);
		// console.log('route is test');
	    res.render('index', {user: 'ADMIN'});
	});
	route.get('/test/:name/:pwd', function(req, res){
		var name = req.params.name;
		var pwd = req.params.pwd;
		var s = req.query.s;
		var t = req.query.t;
		// console.log('测试GET方式：');
		// console.log('--> params');
		// console.log('[name],',name);
		// console.log('[pwd],',pwd);
		// console.log('--> query');
		// console.log('[s],',s);
		// console.log('[t],',t);
		// console.log('route is /test/:name/:pwd');
	    res.render('index', {user: 'ADMIN'});
	});
	route.get('/index/test', function(req, res){
		// console.log('route is index');
	    // res.render('views/index.ejs');
	});
	route.post('/index', function(req, res){
		// console.log('route is index post');
	    // res.render('views/index.ejs');
	});
	route.get('/image', function(req, res){
		// console.log('route is image');
	    // res.render('views/image.ejs');
	});
};

