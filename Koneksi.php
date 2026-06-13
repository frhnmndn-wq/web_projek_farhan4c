<?php

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'nama_database_anda'; // ganti sesuai nama database di phpMyAdmin

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die('Koneksi database gagal: ' . $conn->connect_error);
}

$conn->set_charset('utf8mb4');

return $conn;
