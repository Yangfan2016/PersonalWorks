<?php
	require "./config.php";
	$query="SELECT * FROM `skins` LIMIT 0,6";
	$sql=mysql_query($query);
	$arr=array();	
	while(!!$row=mysql_fetch_array($sql,MYSQL_ASSOC)) {
		array_push($arr,json_encode($row,JSON_FORCE_OBJECT));
	};
	echo '['.implode(",",$arr).']';
	mysql_close();
?>