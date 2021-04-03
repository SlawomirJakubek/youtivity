//$(document).ready(()=>{
    $('.box').each((index, elem) => {
        if($(elem).attr('id') != 'switchBox'){
            $(elem).hide();
        }
    });

    class Data extends EventTarget{
        static ADD = 'ADD';
        static REMOVE = 'REMOVE';
        static UPDATE = 'UPDATE';
        static ERROR = 'ERROR';

        constructor(){
            super();
            this._currentActivity = null;
            this.request = new XMLHttpRequest();

            this.server('./php/activityNames.php?', `username=${username}`, () => {
                if(this.request.readyState == 4 && this.request.status == 200){
                    console.log('SUCCESS');
                    let data = [];
                    const r = this.request.responseText;
                    if(r[0] == '[' && r[r.length - 1] == ']'){
                        data = JSON.parse(this.request.responseText);
                    }
                    this._activityNames = data;
                    this.server('./php/setGetActivity.php?', `username=${username}&action=get`, () => {
                        if(this.request.readyState == 4 && this.request.status == 200){

                            if(this.request.responseText){
                                this._currentActivity = JSON.parse(this.request.responseText);
                            }
                            console.log('doing: this.dispatchEvent(new Event(Data.UPDATE));');
                            this.dispatchEvent(new Event(Data.UPDATE));
                        }

                    });
                }
                if(this.request.status > 200){
                    console.log("ERROR");
                }
            });
        }

        get currentActivity(){
            return this._currentActivity;
        }

        set currentActivity(value){
            this._currentActivity = value;
            this.server('./php/setGetActivity.php?', `username=${username}&action=set&name=${value.name}&time=${value.time}`, null);
        }

        server(filename, params, handler){
            this.request.open('POST', filename);
            this.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            this.request.onreadystatechange = handler;
            this.request.send(params);
        }

        get activityNames(){
            return [...this._activityNames];
        }

        hasName(name){
            return this._activityNames.indexOf(name) != -1;
        }

        add(name){
            this._activityNames.push(name);
            this.currentEventType = Data.ADD;
            this.save();
        }

        save(){
            let request = new XMLHttpRequest();
            request.open('POST', './php/activityNames.php?');
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.onreadystatechange = () => {
                if(request.readyState == 4 && request.status == 200){
                    console.log('FROM SAVE ON 4/200: this.dispatchEvent(new Event(Data.UPDATE));');
                    this.dispatchEvent(new Event(this.currentEventType));
                    this.dispatchEvent(new Event(Data.UPDATE));
                }
                if(request.status > 200){
                    this.dispatchEvent(new Event(Data.ERROR));
                }
            };
            request.send(`data=${JSON.stringify(this._activityNames)}&username=${username}`);
        }
    }
 
    class AbstractBox{
        static $currentBox;

        constructor(id, openButtonId = null, keyCode = null){
            this.id = id;
            this.$returnTo = switchBox;
            this.$element = $(`#${id}`);
            this.$closeBtn = $(`#${id} .closeBtn`);
            
            //close box
            this.$closeBtn.on('click', {fromBox: this, toBox: this.$returnTo, open: false }, this.open);

            $(document).on('keyup', e => {
                if(e.which == 27){
                    this.open({data: {fromBox: this, toBox: this.$returnTo, open: false }});
                }
            });

            //open box
            if(openButtonId){
                this.$openBtn = $(`#${openButtonId}`);
                this.$openBtn.on('click', {toBox: this, open: true }, this.open);
                this.$openBtn.on('click', ()=>{console.log("YEAH!")});
            }
            if(keyCode){
                $(document).on('keyup', e => {        
                    if(e.which == keyCode){
                        this.open({data: {toBox: this, open: true }});
                    }
                });
            }
        }

        set returnTo($value){
            this.$returnTo = $value;
        }

        show(){
            this.$element.show();
        }

        hide(){
            this.$element.hide();
        }

        open(e){
            AbstractBox.$currentBox.hide();
            AbstractBox.$currentBox = e.data.toBox;
            AbstractBox.$currentBox.show();
        }
    }

    class AddBox extends AbstractBox{
        constructor(data, openButtonId = null, keyCode = null){
            super('addBox', openButtonId, keyCode);
            this.$addBtn = $('#addBox-addBtn');
            this.$input = $('#addBox-name');
            this.$info = $('#addBox-info');
            this.newName;
            this.pattern = new RegExp(/[^\w\s]/);

            this.clear();

            const addActivity = () => {
                SwitchBox.SCROLL = true;
                data.add(this.newName);
            };

            //add new activity on button click
            this.$addBtn.on('click', ()=>{addActivity()});

            $(this.$element).on('keyup', e => {
                //add new activity on enter
                if(e.which == 13 && !this.$addBtn.prop('disabled')){
                    addActivity();
                }
                //stop propagation of the space bar if focused on input
                if(e.which != 27){
                    e.stopPropagation();
                }
            });

            this.$input.on('input', e => {
                const name = this.$input.val().toLowerCase().trim();
                let isFieldEmpty = name.trim().length == 0;
                let isDuplicate = data.hasName(name);               
                let isforbiddenChar = false;//this.pattern.test(name);
                //on input change info message
                if(isDuplicate || isforbiddenChar){
                    if(isforbiddenChar){
                        this.$info.html("DON'T USE SPECIAL CHARACTERS<br>only characters from A to z<br>from 0 to 9 and _ are allowed");
                    }else{
                        this.$info.html('you already have an activity with that name');
                    }
                }else{
                    this.$info.html('');
                }
                
                //on imput enable or disable "add activity" button
                if(isFieldEmpty || isDuplicate || isforbiddenChar){
                    this.$addBtn.prop('disabled', true);
                }else{
                    this.$addBtn.prop('disabled', false);
                    this.newName = name;
                }
            });

            data.addEventListener(Data.ADD, () => {
                this.clear();
                this.open({data: {toBox: this.$returnTo, open: false}});
            });
        }

        clear(){
            this.$info.html('');
            this.$input.val('');
            this.$addBtn.prop('disabled', true);
        }

        show(){
            super.show();
            this.$input.focus();
        }

        hide(){
            super.hide();
            this.clear();
        }
    }
    
    class MenuBox extends AbstractBox{
        constructor(data, openButtonId, keyCode){
            super('menuBox', openButtonId, keyCode);
            this.$menuBtn = $('#bottomBar-menuBtn');
            this.$menuBtn.on('click', ()=>{
                this.open(this.$menuBtn.attr('openBox'));
            });
        }
    }

    class AuthorBox extends AbstractBox{
        constructor(openButtonId){
            super('author', openButtonId);
        }

        open(e){
            if(e.data.open){
                if(e.data.toBox.$openBtn.attr('id') == 'openAuthorBtn'){
                    $('#author .box-header h2').html('AUTHOR'); 
                }
            }
            super.open(e);
        }
    }

    class CopyrightsBox extends AbstractBox{
        constructor(openButtonId){
            super('author', openButtonId);
        }

        open(e){
            if(e.data.open){
                if(e.data.toBox.$openBtn.attr('id') == 'openCopyrightsBtn'){
                    $('#author .box-header h2').html('COPYRIGHTS'); 
                }
            }
            super.open(e);
        }
    }

    class InfoBox extends AbstractBox{
        constructor(){
            super('infoBox');
        }
    }

    class SwitchBox{
        static SCROLL = false;
        constructor(data){
            this.$element = $("#switchBox");
            this.$wrapper = $("#switchBox-wrapper");

            data.addEventListener(Data.UPDATE, ()=>{

                $('#switchBox-wrapper .activityBtn').remove();
                console.log(data.activityNames.length);

                data.activityNames.forEach(name => {

                    console.log('appending button:' + name);
                    let $b = $(`<button class="activityBtn">${name}</button>`);
                    
                    if(data.currentActivity){
                        if(data.currentActivity.name == name){
                            $b.addClass('buttonPressed');
                            $b.prop('disabled', true);
                        }
                    }

                    $b.appendTo(this.$wrapper);
                });

                addBox.$openBtn.appendTo(this.$wrapper);

                if(SwitchBox.SCROLL){
                    this.$element.scrollTop(this.$wrapper.height());
                    SwitchBox.SCROLL = false;
                }
            });

            //on switch activity
            $(this.$wrapper).on('click', e => {
                if(e.target.tagName == 'BUTTON' && $(e.target).attr('id') != 'openAddBtn'){
                    //reset all activity buttons
                    $('#switchBox-wrapper button').each((index, elem) => {
                        $(elem).removeClass('buttonPressed');
                        $(elem).prop('disabled', false);

                    });
                    //set style to the pressed activity button
                    $(e.target).addClass('buttonPressed');
                    $(e.target).prop('disabled', true);
                    
                    //save activity event
                    data.currentActivity = {
                        name: $(e.target).html(),
                        time: new Date().getTime()
                    };
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
    }

    const data = new Data();
    const switchBox = new SwitchBox(data);
    const addBox = new AddBox(data, 'openAddBtn', 107);
    const menuBox = new MenuBox(data, 'openMenuBtn', 32);
    const authorBox = new AuthorBox('openAuthorBtn');
    const copyrightsBox = new CopyrightsBox('openCopyrightsBtn');
    const infoBox = new InfoBox();

    AbstractBox.$currentBox = switchBox;
//});