<?php 
	header('Content-Type:text/html;charset:UTF-8');
	// 定义常量
	define('DB_HOST','127.0.0.1:82');
	define('DB_USER', 'root');
	define('DB_PWD', '123456');
	define('DB_NAME', 'school');
	// 连接数据库
	@mysql_connect(DB_HOST,DB_USER,DB_PWD) or die('数据库连接错误：'.mysql_error());
	// 选择数据库
	@mysql_select_db(DB_NAME) or die('选择数据库错误：'.mysql_error());
	// 设置SQL语句编码
	mysql_query('SET NAMES UTF8');

	// echo 'success';
 ?>