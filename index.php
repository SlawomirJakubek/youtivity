<?php
    $userDataPath = "./csv/userData.csv";
    $infoHeader = '';
    $infoBody = '';
    $info = false;
    $goToBoxName = 'menu';
    $currentBoxName = 'menu';
    $username = '';
    $password = '';
    $rUsername = '';
    $rPassword = '';
    $rEmail = '';
    define('USERNAME', 0);
    define('PASSWORD', 1);
    define('EMAIL', 2);
    define('VERIFIED', 3);
    define('DATE_REGISTERED', 4);
    define('KEY', 5);
    define('CLEARANCE', 6);
    session_start();

    if(isset($_REQUEST['username']) && isset($_REQUEST['password'])){
        $username = filter_var($_REQUEST['username'], FILTER_SANITIZE_STRING);
        $password = filter_var($_REQUEST['password'], FILTER_SANITIZE_STRING);
        login($username, $password);

    }else if(isset($_REQUEST['rUsername']) && isset($_REQUEST['rPassword']) && isset($_REQUEST['rEmail'])){
        $rUsername = filter_var($_REQUEST['rUsername'], FILTER_SANITIZE_STRING);
        $rPassword = filter_var($_REQUEST['rPassword'], FILTER_SANITIZE_STRING);
        $rEmail = filter_var($_REQUEST['rEmail'], FILTER_SANITIZE_EMAIL);
        register($rUsername, $rPassword, $rEmail);
    }else if(isset($_REQUEST['key'])){
        $key = $_REQUEST['key'];
        $info = true;
        $infoHeader = 'INFO';

        if(isKeyPresent($key)){
            if(!isEmailVerified(KEY, $key)){
                setVerified($key);
            }
            $infoBody = 'Congratulations! Your email has been verified. Now you can log in and start monitor your life. Enjoy!';
        }else{
            $infoBody = 'This account has been removed. If you wish to open one, please fill in the registration form.';
        }
    }else if(isset($_SESSION['loggedOut'])){
        unset($_SESSION['loggedOut']);
        session_destroy();
        $info = true;
        $goToBoxName = 'login';
        $currentBoxName = 'info';
        $infoHeader = "YOU ARE LOGGED OUT";
        $infoBody = "We don't know if you logged in on your personal device or not. Therefore to keep your data secure and due to your inactivity you had been logged out. To turn this feature off (for this device) go to settings";
    }

    function login($username, $password){
        global $goToBoxName;
        $goToBoxName = 'login';
        $currentBoxName = 'info';
        //validate username
        if(!isUserRegistered($username)){
            info('ERROR', 'wrong username or password');
            return;
        }
        //validate password
        if(!isPasswordCorrect($username, $password)){
            info('ERROR', 'wrong username or password');
            return;
        }
        //check against email verification
        if(!isEmailVerified(USERNAME, $username)){
            $email = getDataByColAndKey(USERNAME, $username, EMAIL);
            $key = getDataByColAndKey(USERNAME, $username, KEY);
            sendVerificationEmail($email, $key);
            info('ERROR', "Your email hasn't been verified yet. Before you login you need to verify your email. Check your inbox, we have sent you an email. Open it an follow the instructions. If you can't fint it, check your spam folder.");
            return;
        }
        //login
        $_SESSION["username"] = $username;
        header('Location: app.php');
    }

    function isUserRegistered($username){
    
        foreach(getUsers() as $userData){
            if($userData[USERNAME] == $username){
                return true;
            }
        }
        return false;
    }

    function isEmailRegistered($email){
    
        foreach(getUsers() as $userData){
            if($userData[EMAIL] == $email){
                return true;
            }
        }
        return false;
    }

    function isEmailVerified($col, $key){
    
        foreach(getUsers() as $userData){
            if($userData[$col] == $key){
                return $userData[VERIFIED] == "true";
            }
        }
        return false;
    }

    function isKeyPresent($key){
    
        foreach(getUsers() as $userData){
            if($userData[KEY] == $key){
                return true;
            }
        }
        return false;
    }
    
    function isPasswordCorrect($username, $password){
    
        foreach(getUsers() as $userData){
            if($userData[USERNAME] == $username && $userData[PASSWORD] == $password){
                return true;
            }
        }
        return false;
    }
    
    function getUsers(){
        global $userDataPath;
        $users = array();
        $row = 1;
        $file = fopen($userDataPath, "r");
        $line = fgetcsv($file);
        
        while($line){
            
            if($row > 1){
                array_push($users, $line);
            }
            $row++; 
            $line = fgetcsv($file);
        }  
        
        fclose($file);
        return $users;
    }

    function register($username, $password, $email){
        global $goToBoxName;
        $goToBoxName = 'register';
        $currentBoxName = 'info';
        //validate username
        if(isUserRegistered($username)){
            info('USERNAME TAKEN', 'this username is already taken, please choose another one');
            return;
        }
        if(strlen($username) < 5 || strlen($username) > 30){
            info('ERROR', 'username must be between 5 and 30 characters long');
            return;
        }

        //valudate password
        if(strlen($password) < 8 || strlen($password) > 30){
            info('ERROR', 'password must be between 8 and 30 characters long');
            return;
        }
        if(preg_match("/[0-9]+/", $password) == 0){
            info('ERROR', 'password must contain at least one number between 0 and 9');
            return;
        }
        if(preg_match("/[a-z]+/", $password) == 0){
            info('ERROR', 'password must contain at least one lowercase character between "a" and "z"');
            return;
        }
        if(preg_match("/[A-Z]+/", $password) == 0){
            info('ERROR', 'password must contain at least one uppercase character between "A" and "Z"');
            return;
        }
        if(preg_match("/[\W]+/", $password) == 0){
            info('ERROR', 'Password must contain at least one special character. Letters from "A" to "z", numbers from 0 to 9 and underscore "_" are not special characters');
            return;
        }

        //validate email
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            info('ERROR', 'check carefully what you typed in an email field, because right now it doesn\'t look right');
            return;
        }
        if(isEmailRegistered($email)){
            info('ERROR', 'You already have an account with us. Check if you spelled your email correctly. If yes, then try to login.');
            return;
        }
        //register
        $key = rand();
        while(isKeyPresent($key)){
            $key = rand();
        }
        global $userDataPath;
        global $goToBoxName;
        $file = fopen($userDataPath, "a");
        fputcsv($file, array($username, $password, $email, 'false', time(), $key, 'user'));
        fclose($file);
        sendVerificationEmail($email, $key);
        info('INFO', 'An email has been sent to ' . $email . '. Please open it and follow the instructions provided. You can close this tab now. See you soon!');
        $goToBoxName = 'menu';
        $currentBoxName = 'info';

        //clear variables so they won't print in the register form
        global $rUsername;
        global $rPassword;
        global $rEmail;
        $rUsername = '';
        $rPassword = '';
        $rEmail = '';
    }

    function sendVerificationEmail($email, $key){
        mail($email, "Verify Email", "This message is from Youtivity\n\nPlease click the link below to verify your email.\nhttps://youtivity.jakubek.co.uk/index.php?key=" . $key . "\n\nIf you did't register to Youtivity then this is a mistake and you can just delete this message.\n\n\nHave a good day!\n\nSincerely,\nYoutivity Team");
    }

    function info($header, $body){
        global $infoHeader;
        global $infoBody;
        global $info;
        $info = true;
        $infoHeader = $header;
        $infoBody = $body;
    }

    function setVerified($key){
        update(KEY, $key, VERIFIED, 'true');
    }

    function getDataByColAndKey($col, $key, $getFromCol){
        
        foreach(getUsers() as $userData){
            if($userData[$col] == $key){
                return $userData[$getFromCol];
            }
        }
        return null;
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
    <link rel="stylesheet" type="text/css" href="./css/loginRegister.css" />
    <script src="./js/jquery-3.6.0.min.js"></script>
    <script>
        let goToBoxName = '<?= $goToBoxName; ?>';
        let currentBoxName = '<?= $currentBoxName; ?>';
    </script>
    <script defer src="./js/loginRegister.js"></script>
</head>
<body>
    <div id="app">
        <header>
            <h1>YOUTIVITY</h1>
        </header>
        <main>
            <nav class="box" id="menu" <?= $info ? 'style="display: none"' : ''; ?>>
                <button id="loginBtn">LOGIN</button>
                <button id="registerBtn">REGISTER</button>
                <button id="aboutBtn">ABOUT</button>
            </nav>  
            <section class="box" id="login">
                <div id="box-header">
                    <h2>LOGIN</h2><!--
                 --><button class="closeBtn">X</button>
                </div>
                <form class="box-content" method="post" autocomplete="on">
                    <div>
                        <label for="login-name">username</label>
                        <input id="login-name" name="username" type="text" minlength="5" maxlength="30" value="<?= $username ?>" required />
                    </div>
                    <div>
                        <label for="login-password">password</label>
                        <input id="login-password" name="password" type="password" minlength="8" maxlength="30" autocomplete="on" value="<?= $password ?>" required />
                    </div>
                    <button>login</button>
                </form>
            </section>
            <section class="box" id="register">
                <div id="box-header">
                    <h2>REGISTER</h2><!--
                 --><button class="closeBtn">X</button>
                </div>
                <form class="box-content" method="post" autocomplete="on">
                    <div>
                        <label for="register-name">username</label>
                        <input id="register-name" name="rUsername" type="text" minlength="5" maxlength="30" value="<?= $rUsername ?>" required />
                    </div>
                    <div>
                        <label for="register-password">password</label>
                        <input id="register-password" name="rPassword" type="password" minlength="8" maxlength="30" autocomplete="on" value="<?= $rPassword ?>" required />
                    </div>
                    <div>
                        <label for="register-email">email</label>
                        <input id="register-email" name="rEmail" type="text" maxlength="100" value="<?= $rEmail ?>" required />
                    </div>
                    <button>register</button>
                </form>
            </section>
            <section class="box" id="about">
                <div id="box-header">
                    <h2>ABOUT</h2><!--
                 --><button class="closeBtn">X</button>
                </div>
                <div class="box-content">
                    <div id="about-app">
                        <p>Youtivity is an app that helps you monitor and control your activity 24/7.<br><br>Very simple and intuitive but amazingly powerful.<br><br>Check it out yourself!</p>
                    </div>
                    <div id="about-copyrights">
                        <p>&#169; Slawomir Jakubek 2021</p>
                    </div>
                </div>
            </section>
            <section class="box" id="author">
                <div id="box-header">
                    <h2>AUTHOR</h2><!--
                    --><button class="closeBtn">X</button>
                </div>
                <div class="box-content" id="info-container">
                    <p id="info-body">Hi, my name is Slawomir Jakubek and I am a software developer from Telford, England.</p>
                    <p>You can contact me by:</p>
                    <p><a href="mailto:contact@jakubek.co.uk">email</a></p>
                    <p>or you can visit my website @ <a href="https://jakubek.co.uk" target="_blank">jakubek.co.uk</a></p>
                </div>
            </section>
            <section class="box" id="info" <?= $info ? 'style="display: block"' : ''; ?>>
                <div id="box-header">
                    <h2 id="info-header"><?= $infoHeader ?></h2><!--
                    --><button class="closeBtn">X</button>
                </div>
                <div class="box-content" id="info-container">
                    <p id="info-body"><?= $infoBody ?></p>
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
