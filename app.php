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
                    <button id="openAddBtn"openBox="addBox">&#10010;</button>
                </div>
                
                <!--<nav>
                    <button id="openMenuBtn" openBox="menuBox">&#9776;</button>
                </nav>-->
            </section>

            <section class="box" id="addBox">
                <div class="box-header">
                    <h2>ADD ACTIVITY</h2><!--
                    --><button class="closeBtn" openBox="switchBox">X</button>
                </div>
                <div class="box-content">
                    <p id="addBox-info" class="warning"></p>
                    <div class="formElement">
                        <label for="addBox-name">name</label>
                        <input type="text" id="addBox-name" minlength="1" maxlength="30" placeholder="e.g. sleeping"/>
                    </div>
                    <div class="formElement">
                        <button id="addBox-addBtn" disabled>add</button>
                    </div>
                </div>
            </section>

            <section class="box" id="menuBox">
                <div class="box-header">
                    <h2>MENU</h2><!--
                    --><button class="closeBtn"  openBox="switchBox">X</button>
                </div>
                <div class="box-content">
                </div>
            </section>

            <section class="box" id="author">
                <div class="box-header">
                    <h2>AUTHOR</h2><!--
                    --><button class="closeBtn">X</button>
                </div>
                <div class="box-content">
                    <div>
                        <p>Hi, my name is Slawomir Jakubek and I am a software developer from Telford, England.</p>
                        <p>You can contact me by:</p>
                        <p><a href="mailto:contact@jakubek.co.uk">email</a></p>
                        <p>or you can visit my website @ <a href="https://jakubek.co.uk" target="_blank">jakubek.co.uk</a></p>
                    </div>
                    <div>
                        <p class="copyrights">&#169; Slawomir Jakubek <?= date("Y"); ?></p>
                    </div>
                </div>
            </section>
            
            <section class="box" id="infoBox">
                <div class="box-header">
                    <h2 id="info-header"></h2><!--
                    --><button class="closeBtn">X</button>
                </div>
                <div class="box-content">
                    <p id="infoBox-body"></p>
                </div>
            </section>

        </main>
    </div>
    <footer>
        <button id="openAuthorBtn">AUTHOR</button>
        <button id="openCopyrightsBtn">COPYRIGHTS</button>
    </footer>
</body>
</html>