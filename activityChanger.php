<?php
session_start();

if(isset($_SESSION["username"])){
    $username = $_SESSION["username"];
    /*
    if(isset($_SESSION['lastRefreshTime'])){
        $timeSinceLastRefresh = time() - $_SESSION['lastRefreshTime'];
        if($timeSinceLastRefresh > 10){
            logout();
        }
    }

    $_SESSION['lastRefreshTime'] = time();
    */

}else{
    logout();
}

function logout(){
    unset($_SESSION["username"]);
    $_SESSION['loggedOut'] = 'true';
    header('Location: index.php');
}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <title>Youtivity</title>
    <meta name="author" content="Slawomir Jakubek" />
    <meta name="description" content="An app that helps you track your activity" />
    <meta name="keywords" content="activity, track, monitor" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8" />
    <meta id="themeColor" name="theme-color" content="coral" />
    <link rel="stylesheet" type="text/css" href="./css/normalize.css" />
    <link rel="stylesheet" type="text/css" href="./css/common.css" />
    <link rel="stylesheet" type="text/css" href="./css/activityChangerStyle.css" />
    <script src="./js/jquery-3.6.0.min.js"></script>
    <script defer src="./js/activityChangerJavaScript.js"></script>
</head>
<body>
    <main>
        <section class="box" id="activities">
        </section>
        <section class="box" id="addActivity">
            <h2>ADD ACTIVITY</h2><!--
            --><button class="close-btn">X</button>
        </section>
        <section class="box" id="menu">
            <h2>MENU</h2><!--
            --><button class="close-btn">X</button>
        </section>
    </main>
    <nav>
        <button id="menuBtn">&#9776;</button>
        <button id="addBtn">&#10010;</button>
    </nav>
</body>
</html>