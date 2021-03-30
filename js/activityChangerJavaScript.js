$(document).ready(()=>{
    //load activities list fomr the server
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

    //build an app when activities list has loaded
    function build(activityNames){

        class AbstractBox{
            static $currentBox;
            static boxes = {};

            constructor(id){
                this.$element = $(`#${id}`);
                this.$closeBtn = $(`#${id} .closeBtn`);
                
                this.$closeBtn.on('click', e => {
                    this.$element.hide();
                    AbstractBox.showBox(this.$closeBtn.attr("openBox"));
                });
            }

            show(){
                this.$element.show();
            }

            hide(){
                this.$element.hide();
            }

            close(){
                this.hide();
                AbstractBox.showBox(this.$closeBtn.attr("openBox"));
            }

            static showBox(name){
                AbstractBox.$currentBox.hide();
                AbstractBox.$currentBox = AbstractBox.boxes[name];
                AbstractBox.$currentBox.show();
            }
        }

        class AddActivityBox extends AbstractBox{
            constructor(id){
                super(id);
                this.$openBtn = $('#addBtn');
                this.$addBtn = $('#addActivityBtn');
                this.$input = $('#addActivityName');
                this.$info = $('#addActivityInfo');
                this.$addActivityBtn = $('#addActivityBtn');
                this.$addActivityName = $('#addActivityName');
                this.$addActivityInfo = $('#addActivityInfo');

                //open Add Activity Box on click and focus on input
                this.$openBtn.on('click', ()=>{
                    AbstractBox.showBox(this.$openBtn.attr('openBox'));
                    this.$input.focus();
                });

                //add new activity on button click
                this.$addActivityBtn.on('click', ()=>{this.addActivity()});

                $(this.$element).on('keyup', e => {
                    //add new activity on enter
                    if(e.which == 13 && !this.$addActivityBtn.prop('disabled')){
                        this.addActivity();
                    }
                    //stop propagation of the space bar if focused on input
                    if(e.which != 27){
                        e.stopPropagation();
                    }
                });

                this.$addActivityName.on('input', e => {
                    const name = this.$addActivityName.val();
                    let isFieldEmpty = name.trim().length == 0;
                    let isDuplicate = activitySwitcher.hasActivityName(name);
                    //on input show or hide info
                    this.$addActivityInfo.css('visibility', isDuplicate ? 'visible' : 'hidden');
                    //on imput enable or disable "add activity" button
                    this.$addActivityBtn.prop('disabled', isFieldEmpty || isDuplicate);
                });

                // open box on key up:
                $(document).on('keyup', e => {
                    if(e.which == 107){
                        AbstractBox.showBox('addActivity');
                        $('#addActivityName').focus();
                    }
                });
            }

            addActivity(){
                const name = this.$addActivityName.val().toLowerCase().trim();
                activitySwitcher.addActivityBtn(name);
                this.clear();
                AbstractBox.showBox('activitySwitcher');
            }

            clear(){
                this.$addActivityInfo.css('visibility', 'hidden');
                this.$addActivityName.val('');
                this.$addActivityBtn.prop('disabled', true);
            }
        }
        
        class MenuBox extends AbstractBox{
            constructor(id){
                super(id);
                this.$menuBtn = $('#menuBtn');
                this.$menuBtn.on('click', ()=>{
                    AbstractBox.showBox(this.$menuBtn.attr('openBox'));
                });
                // open box on key up:
                $(document).on('keyup', e => {        
                    if(e.which == 32){
                        AbstractBox.showBox('menu');
                    }
                });
            }
        }

        class ActivitySwitcher{
            constructor(){
                this.activityNames = activityNames;
                this.$element = $("#activitySwitcher");
                this.$wrapper = $("#activitiesWrapper");
                
                //create buttons based on activity names
                activityNames.forEach(name => {
                    this.addActivityBtn(name);
                });

                //on switch activity
                $(this.$wrapper).on('click', e => {
                    if(e.target.tagName == 'BUTTON'){
                        //reset all activity buttons
                        $('#activitiesWrapper button').each((index, elem) => {
                            $(elem).removeClass('buttonPressed');
                            $(elem).prop('disabled', false);

                        });
                        //set style to the pressed activity button
                        $(e.target).addClass('buttonPressed');
                        $(e.target).prop('disabled', true);
                        
                        //save activity event
                        const stamp = {
                            activity: $(e.target).html(),
                            time: new Date().getTime()
                        }
                        console.log(JSON.stringify(stamp));
                    }
                });

                // open box on key up:
                $(document).on('keyup', e => {
                    if(e.which == 27){
                        AbstractBox.$currentBox.close();
                    }
                });
            }

            show(){
                this.$element.show();
            }

            hide(){
                this.$element.hide();
            }

            close(){}

            hasActivityName(name){
                return this.activityNames.indexOf(name) != -1;
            }

            //create button
            addActivityBtn(name){
                this.activityNames.push(name);
                this.saveNames();
                $(`<button>${name}</button>`).appendTo(this.$wrapper);
                this.$element.scrollTop(this.$wrapper.height());
            }

            //save activities after modification
            saveNames(){
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
        }

        const addActivityBox = new AddActivityBox('addActivity');
        const menuBox = new MenuBox('menu');
        const activitySwitcher = new ActivitySwitcher();

        AbstractBox.$currentBox = activitySwitcher;
        AbstractBox.boxes['addActivity'] = addActivityBox;
        AbstractBox.boxes['menu'] = menuBox;
        AbstractBox.boxes['activitySwitcher'] = activitySwitcher;
    }
});