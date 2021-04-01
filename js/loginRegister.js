$(document).ready(()=>{
    
    $menu = $("#menu");
    $login = $("#login");
    $register = $("#register");

    //hide all windows except 'menu'
    $('.box').each((index, elem) => {
        if($(elem).attr('id') != 'menu'){
            $(elem).hide();
        }
    });

    //add functionality to back buttons
    $(".closeBtn").each( (index, elem) => {
        $(elem).on('click', e =>{
            
            $(e.target).parent().parent().hide();
            switch(goToBoxName){
                case 'login':
                    $login.show();
                break;
                case 'register':
                    $register.show();
                break;
                default:
                    $menu.show();
            }
            currentBoxName = goToBoxName;
            goToBoxName = 'menu';
        });
    });

    function couple(btnID, boxID){
        $(`#${btnID}`).on('click', () => {
            $(`#${currentBoxName}`).hide();
            $(`#${boxID}`).show();
            currentBoxName = boxID;
        });
    }

    couple('loginBtn', 'login');
    couple('registerBtn', 'register');
    couple('aboutBtn', 'about');
    couple('authorBtn', 'author');
    couple('copyrightsBtn', 'about');
});