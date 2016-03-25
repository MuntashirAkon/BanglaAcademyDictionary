<?php
header('Content-Type: image/*');
$name = filter_input(INPUT_GET, "name", FILTER_SANITIZE_STRING);
$url = "https://raw.githubusercontent.com/MuntashirAkon/Mac-OS-Installation-Helper/master/";
$url .= $name;
header('Content-Disposition: attachment; filename="{$name}"');
readfile($url);