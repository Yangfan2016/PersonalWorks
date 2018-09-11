<?php
	require "./config.php";
	$q1="UPDATE `skins` SET `flag`=0"; // 初始化
	$q2="UPDATE `skins` SET `flag`=1 WHERE `text`='{$_POST['active']}'"; // 标记当前
	$sql=mysql_query($q1);
	$sql=mysql_query($q2);
	echo mysql_affected_rows();
	mysql_close();
?>