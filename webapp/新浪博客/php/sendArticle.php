<?php 
	require "./config.php";
	$query="INSERT INTO `article`(`user`,`title`,`content`,`date`) VALUES('{$_POST['username']}','{$_POST['title']}','{$_POST['content']}',NOW())";
	@mysql_query($query) or die("插入错误".mysql_error());
	echo mysql_affected_rows();
	mysql_close();
?>