$(document).ready(()=>{
    let request = new XMLHttpRequest();
    request.open('POST', './php/activityNames.php?');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.onreadystatechange = () => {
        if(request.readyState == 4 && request.status == 200){
            console.log('SUCCESS');
            let data = [];
            const r = request.responseText;
            if(r[0] == '[' && r[r.length - 1] == ']'){
                data = JSON.parse(request.responseText);
            }
            build(data);
        }
        if(request.status > 200){
            console.log("ERROR");
        }
    };
    request.send(`username=${username}`);

    function build(activityNames){

        const addActivityBox = {
            $openBtn: $('#addBtn'),
            $closeBtn: $('#addActivity .closeBtn'),
            $addBtn: $('#addActivityBtn'),
            $input: $('#addActivityName'),
            $info: $('#addActivityInfo'),
            $obj: $("#addActivity"),
            show(){
                this.$obj.show();
            },
            hide(){
                this.$obj.hide();
            },
            close(){
                this.$obj.hide();
                showBox(this.$closeBtn.attr("openBox"));
            },
            close(){
                this.$obj.hide();
                showBox(this.$closeBtn.attr("openBox"));
            }
        };
        const menuBox = {
            $openBtn: $('#menuBtn'),
            $closeBtn: $('#menu .closeBtn'),
            $obj: $("#menu"),
            show(){
                this.$obj.show();
            },
            hide(){
                this.$obj.hide();
            },
            close(){
                this.$obj.hide();
                showBox(this.$closeBtn.attr("openBox"));
            }
        };
        const activitySwitcher = {
            $openBtn: null,
            $closeBtn: null,
            $obj: $("#activitySwitcher"),
            $wrapper: $("#activitiesWrapper"),
            show(){
                this.$obj.show();
            },
            hide(){
                this.$obj.hide();
            },
            close(){}
        };

        $addBtn = $('#addBtn');
        $menuBtn = $('#menuBtn');
        $activitySwitcher = $("#activitySwitcher");
        $activitiesWrapper = $("#activitiesWrapper");
        $menu = $("#menu");
        $addActivity = $("#addActivity");
        //$currentBox = $activitySwitcher;
        $currentBox = activitySwitcher;
        const buttons = [$addBtn, $menuBtn];
        $escBtn = null;

        activityNames.forEach(name => {
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

        $addBtn.on('click', ()=>{
            $('#addActivityName').focus();
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
                case 'addActivity':
                    //$currentBox = $addActivity; 
                    $currentBox = addActivityBox; 
                break;
                case 'menu':
                    //$currentBox = $menu;
                    $currentBox = menuBox;
                break;
                default:
                    //$currentBox = $activitySwitcher;
                    $currentBox = activitySwitcher;
            }
            $currentBox.show();
        }

        //add activity
        $addActivityBtn = $('#addActivityBtn');
        $addActivityName = $('#addActivityName');
        $addActivityInfo = $('#addActivityInfo');
        
        $addActivityName.on('input', e => {
            let isFieldEmpty = $addActivityName.val() == '';
            let isDuplicate = activityNames.indexOf($addActivityName.val()) != -1;
            $addActivityInfo.css('visibility', isDuplicate ? 'visible' : 'hidden');
            $addActivityBtn.prop('disabled', isFieldEmpty || isDuplicate);
        });

        function addActivity(){
            const name = $addActivityName.val().toLowerCase().trim();
            activityNames.push(name);
            saveNames();
            addActivityBtn(name);
            clear();
            showBox('activities');
            $activitySwitcher.scrollTop($activitiesWrapper.height());
        }

        function clear(){
            $addActivityInfo.css('visibility', 'hidden');
            $addActivityName.val('');
            $addActivityBtn.prop('disabled', true);
        }
        
        $addActivityBtn.on('click', addActivity);
        $addActivity.on('keyup', e => {
            
            if(e.which == 13 && !$addActivityBtn.prop('disabled')){
                addActivity();
            }
            if(e.which != 27){
                e.stopPropagation();
            }
        });

        function saveNames(){
            
            let request = new XMLHttpRequest();
            request.open('POST', './php/activityNames.php?');
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.onreadystatechange = () => {
                if(request.readyState == 4 && request.status == 200){
                    console.log('SUCCESS');
                }
                if(request.status > 200){
                    console.log("ERROR");
                }
                console.log(request.readyState + ' / ' + request.status);
            };
            request.send(`data=${JSON.stringify(activityNames)}&username=${username}`);
        }

        $(document).on('keyup', e => {
            console.log(e.which); 
            if(e.which == 107){
                showBox('addActivity');
                $('#addActivityName').focus();
            }else if(e.which == 32){
                showBox('menu');
            }else if(e.which == 27){
                $currentBox.close();
            }
        });

        $(document).on('click', e => {
            if(e.target.tagName == 'BUTTON' && $(e.target).parent().attr('id') == $activitiesWrapper.attr('id')){
                $('#activitiesWrapper button').each((index, elem) => {
                    $(elem).removeClass('buttonPressed');
                    $(elem).prop('disabled', false);

                });
                $(e.target).addClass('buttonPressed');
                $(e.target).prop('disabled', true);
                const stamp = {
                    activity: $(e.target).html(),
                    time: new Date().getTime()
                }
                console.log(JSON.stringify(stamp));
            }
        });
    }
});