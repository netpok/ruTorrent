<?php

require_once( "../../php/util.php" );

if(!isset($HTTP_RAW_POST_DATA))
	$HTTP_RAW_POST_DATA = file_get_contents("php://input");
$ret = array();
if(isset($HTTP_RAW_POST_DATA))
{
	$vars = explode('&', $HTTP_RAW_POST_DATA);
	foreach($vars as $var)
	{
		$parts = explode("=",$var);
		if($parts[0]=="hash")
			$ret[] = $parts[1];
	}
	if(count($ret))
	{
		$fname = '/tmp/rutorrent-prm-'.getUser().time();
		file_put_contents( $fname, serialize( $ret ) );
		shell_exec( getPHP()." -f ".escapeshellarg(dirname( __FILE__)."/batch_check.php")." ".escapeshellarg($fname)." ".getUser()." > /dev/null 2>&1 &" );
	}
}

cachedEcho('{}',"application/json");

?>