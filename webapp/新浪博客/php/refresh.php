<?php  
	require "./config.php";
	$sql="SELECT `title`,`content`,`date` FROM `article` WHERE `user`='{$_POST['username']}' ORDER BY `date` desc LIMIT 5";
	$q1=mysql_query($sql);
	$arr=array();
	while(!!$row=mysql_fetch_array($q1,MYSQL_ASSOC)) {
		array_push($arr,json_encode($row,JSON_FORCE_OBJECT));
	}
	$str='['.implode(',',$arr).']';
	echo $str;
	mysql_close();
?>