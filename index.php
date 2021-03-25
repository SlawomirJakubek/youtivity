<?php
    if(isset($_REQUEST['name']) && isset($_REQUEST['password'])){
        
        $name = $_REQUEST['name'];
        $password = $_REQUEST['password'];

        if($name == "admin" && $password == "blue1212"){
            header('Location: activityChanger.php');
        }
    }
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <title>Youtivity</title>
    <meta name="author" content="Slawomir Jakubek" />
    <meta name="description" content="An app that helps you track your activity" />
    <meta name="keywords" content="activity track" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8" />
    <meta id="themeColor" name="theme-color" content="coral" />
    <link rel="stylesheet" type="text/css" href="./css/normalize.css" />
    <link rel="stylesheet" type="text/css" href="./css/style.css" />
    <script src="./js/jquery-3.6.0.min.js"></script>
    <script defer src="./js/javascript.js"></script>
</head>
<body>
    <header>
        <h1>YOUTIVITY</h1>
    </header>
    <main>
        <nav id="menu" class="box">
            <button id="login-btn">LOGIN</button>
            <button id="register-btn">REGISTER</button>
            <button id="about-btn">ABOUT</button>
        </nav>  
        <section class="box" id="login">
            <h2>LOGIN</h2><!--
            --><button class="close-btn">X</button>
            <form method="post" autocomplete="on">
                <div>
                    <label for="login-name">username</label>
                    <input id="login-name" name="name" type="text" minlength="8" maxlength="30" required />
                </div>
                <div>
                    <label for="login-password">password</label>
                    <input id="login-password" name="password" type="password" minlength="8" maxlength="30" autocomplete="on" required />
                </div>
                <button>login</button>
            </form>
        </section>
        <section class="box" id="register">
            <h2>REGISTER</h2><!--
                --><button class="close-btn">X</button>
                <form method="post" autocomplete="on">
                <div>
                    <label for="register-name">username</label>
                    <input id="register-name" name="name" type="text" minlength="8" maxlength="30" required />
                </div>
                <div>
                    <label for="register-password">password</label>
                    <input id="register-password" name="password" type="password" minlength="8" maxlength="30" autocomplete="on" required />
                </div>
                <div>
                    <label for="email">email</label>
                    <input id="email" name="email" type="text" maxlength="100" required />
                </div>
                <button>register</button>
            </form>
        </section>
        <section class="box" id="about">
            <h2>ABOUT</h2><!--
            --><button class="close-btn">X</button>
            <p>youtivity is an app that helps you monitor and control your activity 24/7. Very simple and intuitive but amazingly powerful. Check it out yourself!</p>
        </section>
    </main>
    <footer>
        <p>author</p>
        <p>copyrights</p>
    </footer>
</body>
</html>
