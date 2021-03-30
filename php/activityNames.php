<?php
if(!isset($_POST['username'])){
    exit();
}
define('USERNAME', 0);
define('ACTIVITY_NAMES', 1);
$username = $_POST['username'];
$userDataPath = '../csv/activityNames.csv';

//get users data
$usersData = array();
$row = 1;
$file = fopen($userDataPath, "r");
$line = fgetcsv($file);

while($line){
    
    if($row > 1){
        array_push($usersData, $line);
    }
    $row++; 
    $line = fgetcsv($file);
}  

fclose($file);

//check if user has any data
$hasData = false;
foreach($usersData as $userData){
    if($userData[USERNAME] == $username){
        $hasData = true;
    }
}

//check weather to save or retrieve data
if(isset($_POST['data'])){
    $activityNames = /*filter_var(*/$_POST['data']/*, FILTER_SANITIZE_STRING)*/;
    //update or append
    if($hasData){
        update(USERNAME, $username, ACTIVITY_NAMES, $activityNames);
    }else{
        $file = fopen($userDataPath, "a");
        fputcsv($file, array($username, $activityNames));
        fclose($file);
    }
}else{
    $data = '';
    foreach($usersData as $userData){
        if($userData[USERNAME] == $username){
            $data = $userData[ACTIVITY_NAMES];
        }
    }
    echo $data;
}


function update($targetKeyField, $targetKeyValue, $updateKeyField, $updateKeyValue){
    global $userDataPath;
    $file = fopen($userDataPath, "r");
    $copy = array();
    $line = fgetcsv($file);
    
    //copy and update
    while($line){

        if($line[$targetKeyField] == $targetKeyValue){
            $line[$updateKeyField] = $updateKeyValue;
        }

        array_push($copy, $line);
        $line = fgetcsv($file);
    }
    
    fclose($file);
    
    //save
    $file = fopen($userDataPath, "w");

    foreach($copy as $line){
        fputcsv($file, $line);
    }

    fclose($file);
}
?>