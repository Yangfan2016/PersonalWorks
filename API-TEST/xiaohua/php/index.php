<?php  

// POST
$curlPost=function ($url,$data,$callback) {
	$ch=curl_init();
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_HEADER,0);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch,CURLOPT_POST,1);
	$data && curl_setopt($ch,CURLOPT_POSTFIELDS,$data);
	$res=curl_exec($ch);
	curl_close($ch);
	$callback($res);
};



$curpage=1;
$currows=20;


if (!!empty($_POST['page'])) {
	$page=1;
}
if (!!empty($_POST['rows'])) {
	$rows=20;
} else {
	$page=$_POST['page'];
	$rows=$_POST['rows']; 
}

// 请求数据
$curlPost('http://api.avatardata.cn/Joke/NewstImg',array(
	'key'=>'d0b4777207f649c8bc32cec09b24d7ac',
	'page'=>$page,
	'rows'=>$rows,
	'dtype'=>'JSON',
	'format'=>true
	),function ($res) {
		global $arr;
		$arr=@json_decode($res)->result;
		echo $res;

});


?>
