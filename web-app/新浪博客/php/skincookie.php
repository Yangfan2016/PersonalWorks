<?php
	require "./config.php";
	$q1="SELECT `bg`,`bg_color` FROM `skins` WHERE `flag`=1";
	$sql=mysql_query($q1);
	$rows=mysql_fetch_array($sql,MYSQL_ASSOC);
	echo json_encode($rows,JSON_FORCE_OBJECT);
	mysql_close();
?>