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
    <meta id="themeColor" name="theme-color" content="rgb(204, 241, 255)" />
    <link rel="stylesheet" type="text/css" href="./css/normalize.css" />
    <link rel="stylesheet" type="text/css" href="./css/common.css" />
    <link rel="stylesheet" type="text/css" href="./css/app.css" />
    <script src="./js/jquery-3.6.0.min.js"></script>
    <script>
        const username = '<?= $username ?>';
    </script>
    <script defer src="./js/app.js"></script>
</head>
<body>
    <div id="app">
        <header>
            <h1>YOUTIVITY</h1>
        </header>
        <main>

            <section class="box" id="switchBox">
                <div id="switchBox-wrapper">
                </div>
                <nav id="">
                    <button id="bottomBar-menuBtn" openBox="menuBox">&#9776;</button>
                    <button id="bottomBar-addBtn"openBox="addBox">&#10010;</button>
                </nav>
            </section>

            <section class="box" id="addBox">
                <h2>ADD ACTIVITY</h2><!--
                --><button class="closeBtn" openBox="switchBox">X</button>
                <div class="box-content">
                    <p id="addBox-info">you already have an activity with that name</p>
                    <div>
                        <label for="addBox-name">name</label>
                        <input type="text" id="addBox-name" placeholder="e.g. sleeping"/>
                    </div>
                    <button id="addBox-addBtn" disabled>add</button>
                </div>
            </section>

            <section class="box" id="menuBox">
                <h2>MENU</h2><!--
                --><button class="closeBtn"  openBox="switchBox">X</button>
                <div class="box-content">
                </div>
            </section>

        </main>
    </div>
    <footer>
        <button id="authorBtn">AUTHOR</button>
        <button id="copyrightsBtn">COPYRIGHTS</button>
    </footer>
</body>
</html>