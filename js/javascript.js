$(document).ready(()=>{
    $login = $("#login");
    $loginBtn = $("#login-btn");
    $register = $("#register");
    $registerBtn = $("#register-btn");
    $about = $("#about");
    $aboutBtn = $("#about-btn");
    $menu = $("#menu");

    $loginBtn.on('click', ()=>{
        $menu.hide();
        $login.show();
    });

    $registerBtn.on('click', ()=>{
        $menu.hide();
        $register.show();
    });

    $aboutBtn.on('click', ()=>{
        $menu.hide();
        $about.show();
    });

    $(".close-btn").each( (index, elem) => {
        $(elem).on('click', e =>{
            $(e.target).parent().hide();
            showBox();
        });
    });
});