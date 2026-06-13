<?php

$conn = require 'Koneksi.php';

if ($conn instanceof mysqli && $conn->ping()) {
    echo 'Koneksi database berhasil!';
} else {
    echo 'Koneksi database gagal.';
}

$conn->close();
