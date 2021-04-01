$(document).ready(()=>{
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
                        if(this.request.responseText){
                            this._currentActivity = JSON.parse(this.request.responseText);
                        }
                        this.dispatchEvent(new Event(Data.UPDATE));
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

        static addBoxByName(name, box){
            AbstractBox.boxes[name] = box;
        }

        static showBox(name){
            AbstractBox.$currentBox.hide();
            AbstractBox.$currentBox = AbstractBox.boxes[name];
            AbstractBox.$currentBox.show();
        }
    }

    class AddBox extends AbstractBox{
        constructor(data){
            super('addBox');
            this.$addBtn = $('#addBox-addBtn');
            this.$input = $('#addBox-name');
            this.$info = $('#addBox-info');
            this.$openBtn = $('#bottomBar-addBtn');
            this.newName;

            const addActivity = () => {
                SwitchBox.SCROLL = true;
                data.add(this.newName);
            };

            //open Add Activity Box on click and focus on input
            this.$openBtn.on('click', ()=>{
                AbstractBox.showBox(this.$openBtn.attr('openBox'));
                this.$input.focus();
            });

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
                //on input show or hide info
                this.$info.css('visibility', isDuplicate ? 'visible' : 'hidden');
                //on imput enable or disable "add activity" button
                if(isFieldEmpty || isDuplicate){
                    this.$addBtn.prop('disabled', true);
                }else{
                    this.$addBtn.prop('disabled', false);
                    this.newName = name;
                }
            });

            // open box on key up:
            $(document).on('keyup', e => {
                if(e.which == 107){
                    AbstractBox.showBox('addBox');
                    this.$input.focus();
                }
            });

            data.addEventListener(Data.ADD, () => {
                this.clear();
                AbstractBox.showBox('switchBox');
            });
        }

        clear(){
            this.$info.css('visibility', 'hidden');
            this.$input.val('');
            this.$addBtn.prop('disabled', true);
        }
    }
    
    class MenuBox extends AbstractBox{
        constructor(data){
            super('menuBox');
            this.$menuBtn = $('#bottomBar-menuBtn');
            this.$menuBtn.on('click', ()=>{
                AbstractBox.showBox(this.$menuBtn.attr('openBox'));
            });
            // open box on key up:
            $(document).on('keyup', e => {        
                if(e.which == 32){
                    AbstractBox.showBox('menuBox');
                }
            });
        }
    }

    class SwitchBox{
        static SCROLL = false;
        constructor(data){
            this.$element = $("#switchBox");
            this.$wrapper = $("#switchBox-wrapper");

            data.addEventListener(Data.UPDATE, ()=>{
                this.$wrapper.empty();

                data.activityNames.forEach(name => {
                    let $b = $(`<button>${name}</button>`);
                    
                    if(data.currentActivity){
                        if(data.currentActivity.name == name){
                            $b.addClass('buttonPressed');
                            $b.prop('disabled', true);
                        }
                    }

                    $b.appendTo(this.$wrapper);
                });
                if(SwitchBox.SCROLL){
                    this.$element.scrollTop(this.$wrapper.height());
                    SwitchBox.SCROLL = false;
                }
            });

            //on switch activity
            $(this.$wrapper).on('click', e => {
                if(e.target.tagName == 'BUTTON'){
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
    }

    const data = new Data();
    const addBox = new AddBox(data);
    const menuBox = new MenuBox(data);
    const switchBox = new SwitchBox(data);

    AbstractBox.$currentBox = switchBox;
    AbstractBox.addBoxByName('addBox', addBox);
    AbstractBox.addBoxByName('menuBox', menuBox);
    AbstractBox.addBoxByName('switchBox', switchBox);
});