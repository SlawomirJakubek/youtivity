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
    <meta id="themeColor" name="theme-color" content="rgb(0, 80, 80)" />
    <link rel="stylesheet" type="text/css" href="./css/normalize.css" />
    <link rel="stylesheet" type="text/css" href="./css/common.css" />
    <link rel="stylesheet" type="text/css" href="./css/activityChangerStyle.css" />
    <script src="./js/jquery-3.6.0.min.js"></script>
    <script>
        const username = '<?= $username ?>';
    </script>
    <script defer src="./js/activityChangerJavaScript.js"></script>
</head>
<body>
    <main>
        <section class="box" id="activitySwitcher">
            <div id="activitiesWrapper">
            </div>
        </section>
        <section class="box" id="addActivity">
            <h2>ADD ACTIVITY</h2><!--
            --><button class="closeBtn" openBox="activitySwitcher">X</button>
            <div class="box-content">
                <p id="addActivityInfo">you already have an activity with that name</p>
                <div>
                    <label for="activityName">name</label>
                    <input type="text" id="addActivityName" placeholder="e.g. sleeping"/>
                </div>
                <button id="addActivityBtn" disabled>add</button>
            </div>
        </section>
        <section class="box" id="menu">
            <h2>MENU</h2><!--
            --><button class="closeBtn"  openBox="activitySwitcher">X</button>
        </section>
    </main>
    <nav id="bottomBar">
        <button id="menuBtn" openBox="menu">&#9776;</button>
        <button id="addBtn"openBox="addActivity">&#10010;</button>
    </nav>
</body>
</html>