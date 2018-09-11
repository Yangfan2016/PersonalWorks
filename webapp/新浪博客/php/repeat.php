<?php 
	require './config.php';
	$sql="SELECT `user` FROM `users` WHERE `user`='{$_POST['username']}'";
	$q1=mysql_query($sql);
	if (!!mysql_fetch_array($q1)) {
		sleep(2);
		echo 1; //'用户名已存在'
	}
	mysql_close();
?>