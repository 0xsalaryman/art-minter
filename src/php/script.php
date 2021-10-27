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
    $img = $_POST['data_url'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);
    print $img;
    echo $img;
    //saving
    $location = $_POST['location'];
    $name = $_POST['name'];

    $fileName = $location . $name;
    file_put_contents($fileName, $fileData);
    // ob_start();
    // var_dump($img);
    // error_log(ob_get_clean(), 4);
?>

