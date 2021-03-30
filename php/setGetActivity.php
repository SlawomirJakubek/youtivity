<?php

    define("USERNAME", "username");
    define("ACTION", "action");
    define("GET", "get");
    define("SET", "set");
    define("NAME", "name");
    define("TIME", "time");

    if(!isset($_REQUEST[USERNAME]) || !isset($_REQUEST[ACTION])){
        exit();
    }
    
    $username = $_REQUEST[USERNAME];
    $filename = "../csv/history/" . $username . ".csv";

    if($_REQUEST[ACTION] == GET){

        if(!file_exists($filename)){
            exit();
        }

        $file = fopen($filename, "r");
        $copy = array();
        $line = fgetcsv($file);
        
        while($line){
            array_push($copy, $line);
            $line = fgetcsv($file);
        }
		
        fclose($file);

        $lastActivity = $copy[count($copy) - 1];
        $lastActivity = array(
            "name" => $lastActivity[0],
            "time" => $lastActivity[1]
        );

        echo json_encode($lastActivity);

        //echo json_encode($lastActivity);

    }else if($_REQUEST[ACTION] == SET && isset($_REQUEST[NAME]) && isset($_REQUEST[TIME])){

        $file = fopen($filename, "a");

        if(filesize($filename) == 0){
            fputcsv($file, array(NAME,TIME));
        }

        fputcsv($file, array($_REQUEST[NAME], $_REQUEST[TIME]));
        fclose($file);
        echo 'true';
    }
?>