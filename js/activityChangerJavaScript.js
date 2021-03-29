$(document).ready(()=>{

    app = {
        _activitiesSwitcher: {
            names: ['sleeping', 'eating', 'bed', 'praying']
        },
        _addActivity: {

        }
    };




    ///OLD CODE
    activities = ['sleeping', 'eating', 'bed', 'praying'];
    $addBtn = $('#addBtn');
    $menuBtn = $('#menuBtn');
    $activities = $("#activities");
    $activitiesWrapper = $("#activitiesWrapper");
    $menu = $("#menu");
    $addActivity = $("#addActivity");
    $currentBox = $activities;
    const buttons = [$addBtn, $menuBtn];

    activities.forEach(name => {
        addActivityBtn(name);
    });

    function addActivityBtn(name){
        $(`<button>${name}</button>`).appendTo($activitiesWrapper);
    }

    $(buttons).each((index, elem) => {
        $(elem).on('click', e =>{
            showBox($(e.target).attr('openBox'));
        });
    });

    $('.closeBtn').each((index, elem) => {
        $(elem).on('click', e =>{
            $(e.target).parent().hide();
            showBox($(e.target).attr("openBox"));
        });
    });

    function showBox(name){
        $currentBox.hide();
        switch(name){
            case 'addActivity': $currentBox = $addActivity; 
            break;
            case 'menu': $currentBox = $menu;
            break;
            default: $currentBox = $activities;
        }
        $currentBox.show();
    }


    //add activity
    $addActivityBtn = $('#addActivityBtn');
    $addActivityBtn.prop('disabled', true);
    $addActivityName = $('#addActivityName');
    $addActivityInfo = $('#addActivityInfo');
    
    $addActivityName.on('input', e => {
        let isFieldEmpty = $addActivityName.val() == '';
        let isDuplicate = activities.indexOf($addActivityName.val()) != -1;
        $addActivityInfo.css('display', isDuplicate ? 'block' : 'none');
        $addActivityBtn.prop('disabled', isFieldEmpty || isDuplicate);
    });

    function addActivity(){
        activities.push($addActivityName.val());
        addActivityBtn($addActivityName.val());
        clear();
        showBox('activities');
        $activities.scrollTop($activitiesWrapper.height());
    }

    function clear(){
        $addActivityInfo.css('display', 'none');
        $addActivityName.val('');
        $addActivityBtn.prop('disabled', true);
    }
    
    $addActivityBtn.on('click', addActivity);
    $addActivity.on('keyup', e => {
        
        if(e.which == 13 && !$addActivityBtn.prop('disabled')){
            addActivity();
        }
    });
});

