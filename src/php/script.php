<?php
	// requires php5
	// define('UPLOAD_DIR', 'images/');
	// $img = $_POST['data'];
	// $img = str_replace('data:image/png;base64,', '', $img);
	// $img = str_replace(' ', '+', $img);
	// $data = base64_decode($img);
	// $file = UPLOAD_DIR . uniqid() . '.png';
	// $success = file_put_contents($file, $data);
	// print $success ? $file : 'Unable to save the file.';
    $img = $_POST['imgBase64'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);
    print $img;
    echo $img;
    //saving
    $fileName = 'photo.png';
    file_put_contents($fileName, $fileData);
    // ob_start();
    // var_dump($img);
    // error_log(ob_get_clean(), 4);
?>

