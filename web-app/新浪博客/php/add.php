<?php 
	// 引入文件
	require './config.php';
	// 编辑SQL查询语句
	$_birth=$_POST['birth_year'].'-'.$_POST['birth_month'].'-'.$_POST['birth_day'];
	$sql="INSERT INTO `users`(`user`,`pwd`,`ques`,`ans`,`email`,`birth`,`memo`) VALUES('{$_POST['newuser']}','{$_POST['newpwd']}','{$_POST['question']}','{$_POST['answer']}','{$_POST['email']}','{$_birth}','{$_POST['memo']}')";
	// 插入SQL语句
	@mysql_query($sql) or die('SQL语句错误：'.mysql_error());
	// 模拟延时
	sleep(2); 
	// echo '数据新增成功，已经影响'.mysql_affected_rows().'行'; // 1	
	echo mysql_affected_rows();
	mysql_close();
?>