<?php  
	require "./config.php";
	$sql="SELECT `user`,`pwd` FROM `users` WHERE `user`='{$_POST['user']}' AND `pwd`='{$_POST['pwd']}'";
	$q1=@mysql_query($sql) or die('错误');
	if (!!mysql_fetch_array($q1)) {
		echo 1; // 登录成功
	}
	mysql_close();
?>