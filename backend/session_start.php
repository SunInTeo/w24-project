<?php
session_start([
    'cookie_lifetime' => 86400, 
    'cookie_secure' => true,  
    'cookie_httponly' => true,
    'use_strict_mode' => true
]);

function secureSessionStart()
{
    if (!isset($_SESSION['initiated'])) {
        session_regenerate_id(true);
        $_SESSION['initiated'] = true;
    }
}
secureSessionStart();
?>