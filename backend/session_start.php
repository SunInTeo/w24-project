<?php
session_start([
    'cookie_lifetime' => 3000,  // 1 day session lifetime
    'cookie_secure' => true,     // Only allow cookies over HTTPS
    'cookie_httponly' => true,   // Prevent client-side access to cookies
    'use_strict_mode' => true    // Prevent session fixation
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