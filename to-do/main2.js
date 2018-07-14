//页面大小随着浏览器窗口变化，到设定值时出现滚动条
(function pagemove() {
    let body = document.getElementsByTagName("body");
    let box = document.getElementById("box")
    let width = Math.max(800, window.innerWidth);
    let height =Math.max(400, window.innerHeight);
    if ( width !== window.innerWidth) {
        body[0].style.width = width + 'px';
        box.style.width = width + 'px';
        body[0].style.overflowX = "scroll";
    }
    else{
        body[0].style.width = width + 'px';
        box.style.width = width + 'px';
        body[0].style.overflowX = "hidden";
    }
    if ( height !== window.innerHeight ) {
        body[0].style.height = height + 'px';
        box.style.height = height + 'px';
        body[0].style.overflowY = "scroll";
    }
    else{
        body[0].style.height = height + 'px';
        box.style.height = height + 'px';
        body[0].style.overflowY = "hidden";
    }
    requestAnimationFrame (pagemove);
})()

//取元素
function $(selector) {
    var elements=[];
    var allChildren=null;
    switch (selector.charAt(0)) {
    case "#":
         if(selector.indexOf(" ")!==-1) {
            var id=selector.split(" ");
            console.log(id);
            elements=document.getElementById(id[0].substring(1)).getElementsByClassName(id[1].substring(1));
         }else{
            elements.push(document.getElementById(selector.substring(1)));
         }
         break;
    case ".":
        elements=(document.getElementsByClassName(selector.substring(1)));          
         break;
    case "[": 
        if(selector.indexOf("=")===-1) {
            var allchildren=document.getElementsByTagName("*");
            for(i=0;i<allchildren.length;i++){
                if(allchildren[i].getAttribute(selector.slice(1,-1))!==null){
                    elements.push(allchildren[i]);
                    break;
                }
            }
        }else{
            var allchildren=document.getElementsByTagName("*");
            var index=selector.indexOf("=");
            for(i=0;i<allchildren.length;i++){
                if(allchildren[i].getAttribute(selector.slice(1,index))===selector.slice(index+1,-1)){
                    elements.push(allchildren[i]);
                    break;
                }
            }
        }
        break;
        default:
        elements=document.getElementsByTagName(selector);
    } 
    return elements[0]  
}

//兼容各种浏览器的事件监听函数
function addListener(target, type, handler){
    if (target.addEventListener) {
        target.addEventListener(type, handler, false); //为什么这个false没用？还是冒泡到父元素
    } else if (target.attachEvent) {
        target.attachEvent('on' + type, handler);
    } else {
        target['on' + type] = handler;
    }
}
let taskClassily = $('#task_classily');
let ischange = false;
let selectTaskName = null;
let selectClassName = null;
let taskSFram = $('#taskSelectFram');
let ClassSFram = $('#ClassSelectFram');
let isClickSTB = false;

var addEeventListen = {
    //选择一级分类    
    SelectFClass: function(event) {
        let target = event.target;
        let eles = target.parentElement.getElementsByTagName('ul');
        let ele = target.getElementsByTagName('ul');
        for (let key of eles) {
            key.style.display = 'none';
        }
        if (!ischange) {
            target.style.display = 'list-item';
            isClick(target, ClassSFram, ischange);
            if (ele.length !== 0) {
                ele[0].style.display = '';               
            }
            ischange = true;
        } else {
            for (let key of eles) {
                key.style.display = 'none';
            }
            initializationPage();
            target.style.display = '';
            ischange = false;
        }
    },
    //删除分类
    isDelClass: function(event) {
        event.stopPropagation();   //阻止事件冒泡到父元素上；
        let target = event.target;
        let taskClassily = $('#task_classily');
        let del = confirm('是否删除该分类');
        if (del) {
            taskClassily.removeChild(target.parentElement);
            let key = target.parentElement.firstChild.nodeValue;
            removeStorageDate(key);
            let classs = target.parentElement.getElementsByClassName('twoLevel');
            for (let i = 0;i < classs.length;i++){
                removeStorageDate(classs[i].innerText);
            }
            let tasks = $('#task').getElementsByClassName('taskName');   //任务数据在未点击前删不掉，因为此时数据还未取得
            for (let i = 0;i < tasks.length;i++){
                removeStorageDate(tasks[i].innerText);                
            }
            initializationPage();
            saveListDate('task_classily',$('#task_classily').innerHTML)
        }               
    },
    //浮现删除按钮
    showDelBtn: function(target) {
        let child = target.firstElementChild;
        child.style.opacity = '1';
        child.disabled = false;
        target.style.opacity = '0.5';       
    },
    //隐藏删除按钮
    shadeDelBtn: function(target) {
        let child = target.firstElementChild;
        child.style.opacity = '0';
        child.disabled = true;
        target.style.opacity = '1';
    },
    //选择当前任务分类
    selectSClass: function(event) {
        event.stopPropagation();
        //let taskClassily = $('#task_classily').getElementsByTagName('li')
        //for (let key of taskClassily) {
            //key.style.backgroundColor = 'gray';
        //}
        selectClassName = event.target;
        let key = window.localStorage.getItem(selectClassName.innerText);
        //取出task中存在的所有class = taskName 的li 添加事件；
        if (key !== null && key !== ''){
            $('#task').innerHTML = key;
            let tasls = $('#task').getElementsByClassName('taskName');
            for (let i = 0;i < tasls.length;i++){
                addListener(tasls[i], 'click', function(event) {
                        addEeventListen.selectTask(event);
                });
            }
            taskSFram.style.backgroundColor =task.style.backgroundColor;
            shadeTaskWindow();
        } else {
            taskSFram.style.backgroundColor =task.style.backgroundColor;
            task.innerHTML = '';
            shadeTaskWindow();
        }
        let ClassSFram = $('#ClassSelectFram');
        isClick(event.target, ClassSFram, ischange);              
    },
    //确定任务修改及新建
    oconfirm: function(target) {
        let date = $('#date');
        let title = $('#title_bar');
        let textarea = $('textarea');
        if (ischange2){
            let finsh = confirm('是否确认完成任务');
            if (finsh) {
                let li = $('#task').getElementsByTagName('li');
                Array.from(li);
                for (let keys of li){
                    if ( keys.innerHTML === title.value){
                        keys.style.color = 'green';
                        shadeTaskbutton(keys);
                    }
                }
                saveListDate(selectClassName.innerText, $('#task').innerHTML)  
            }
        }else {
            let relust =/^\d{4}-0\d|1[02]-0\d|[12]\d|3[01]/.test(date.value); //正则有问题对1993-01-01检测错误
            if (relust){
                ischange2 = true;
                if (isClickSTB) {
                    setTaksList(date, title);
                    saveTextDate(date, title, textarea);
                    times = task.getElementsByClassName('time');
                    let arrayObject = Array.from(times);
                    meigingLi(arrayObject);
                    saveListDate(selectClassName.innerText, $('#task').innerHTML);
                    shadeTaskWindow();
                    taskSFram.style.backgroundColor = task.style.backgroundColor;
                }else {
                    let value =selectTaskName.innerText;
                    removeStorageDate(value);
                    //储存值的key没有变化，还是以前的 why？nowtext 未在函数调用时初始化
                    saveTextDate(date, title, textarea);
                    selectTaskName.innerText = title.value;  //缺少这个导致#task的innerHTML无变化；
                    saveListDate(selectClassName.innerText, task.innerHTML);
                    changeInputStaic();
                }
                target.innerText = '完成';
                target.nextElementSibling.innerText = '编辑';                
            }else {
                alert('请按正确的格式输入');
            }
        }              
    },
    //编辑任务内容
    oeditor: function(target) {
        if (ischange2){
            ischange2 = false;
            changeInputStaic();
            target.innerText = '取消';
            target.previousElementSibling.innerText = '确认';
        }else {
            getStorageDate(selectTaskName.innerText);
            target.innerText = '编辑';
            target.previousElementSibling.innerText = '完成';
            ischange2 = true;
            changeInputStaic();    
        }
    },
    //选择当前任务
    selectTask: function(event) {
        event.stopPropagation();
        let element = $('#taskSelectFram');
        let judge = true;
        selectTaskName = event.target;
        shadeTaskbutton(selectTaskName);
        getStorageDate(event.target);
        isClick(event.target, element, judge);
    },
    //筛选任务
    filterTask: function(event) {
        let allTask = $('#task').getElementsByClassName('taskName');
        for (let i = 0;i < allTask.length;i++) {
            if (event.target.innerText === '所有') {
                allTask[i].style.display = '';
            }
            if (event.target.innerText === '已完成') {
                if (allTask[i].style.color !== 'green'){
                    allTask[i].style.display = 'none';
                }else {
                    allTask[i].style.display = '';                
                }
            }
            if (event.target.innerText === '未完成') {
                if (allTask[i].style.color === 'green') {
                    allTask[i].style.display = 'none';
                }else {
                    allTask[i].style.display = ''
                }
            }
        }
    }
};

//页面刷新时读取储存的数据，并对数据内的每项元素添加方法
window.onload= function (){
    $('#task_classily').innerHTML = window.localStorage.getItem('task_classily');
    shadeTaskWindow();
    if (window.localStorage.length !== 0) {
        let filterButton =$('#list_header').getElementsByTagName('button');
        for (let i = 0;i < filterButton.length;i++) {
            addListener(filterButton[i], 'click', function(event) {
                addEeventListen.filterTask(event);
            });
        }
        //页面加载时隐藏二级分类
        let ul = $('#task_classily').getElementsByTagName('ul');
        for (let i = 0;i < ul.length;i++) {
            ul[i].style.display = 'none';
            addListener(ul[i], 'click', function(event) {
                event.stopPropagation();
            })
        }
        let oneLevels = $('#task_classily').getElementsByClassName('oneLevel');
        for (let i = 0;i < oneLevels.length;i++){
            addListener(oneLevels[i], 'click', function(event) {
                addEeventListen.SelectFClass(event);
            });
            addListener(oneLevels[i], 'mouseenter', function(event) {
                addEeventListen.showDelBtn(event.target);
            });
            addListener(oneLevels[i], 'mouseleave', function(event) {
                addEeventListen.shadeDelBtn(event.target);
            })
        }
        let delButtons = $('#task_classily').getElementsByTagName('button');
        for (let i = 0; i < delButtons.length;i++){
            addListener(delButtons[i], 'click', function(event) {
                addEeventListen.isDelClass(event);
            });
        }
        let twoLevels = $('#task_classily').getElementsByClassName('twoLevel');
        for (let i = 0;i < twoLevels.length;i++){
            addListener(twoLevels[i], 'click', function(event) {
                addEeventListen.selectSClass(event);
            });
        } 
    }
}

//选择框，选中的分类的背景变白
function isClick(target, element, judge) {
    element.style.position = 'absolute'; 
    element.style.left = '0px';
    if (judge) {
        element.style.top = target.offsetTop + target.offsetParent.offsetTop + 'px';
    }else {
        element.style.top = target.offsetTop +'px'; 
    }
    element.style.height = target.offsetHeight + 'px';
    element.style.backgroundColor = 'white';  
}

//保存列表数据
function saveListDate(key, value) {
    let storage = window.localStorage;
    storage.setItem(key, value);
}

let oparent = null;
let oparent2 = null;

//建立新的DOM元素
function setele(tagname, parent, text, className) {
    let otagName = document.createElement(tagname);
    let nodText = document.createTextNode(text);
    otagName.appendChild(nodText);
    if(className){
        otagName.setAttribute('class', className);
    }
    parent.appendChild(otagName);
    oparent = otagName;
}

//新建任务分类
function setClass() {
    let name = prompt('分类的名字');
    if (name !== null && name !== '') {
         oparent = $('#task_classily')  //如果使用let按照作用域原则，oparent寻找的是setclass内部的，不会变化；
        for (let key of oparent.children){
            if (key.style.display === 'list-item'){
                oparent = key;
                oparent2 = key;
            }
        }
        if (oparent.children.length === 0 || ischange === false){
            setele('li', oparent, name, 'oneLevel');
            addListener(oparent, 'click', function(event) {
                addEeventListen.SelectFClass(event);
            });
            addListener(oparent, 'mouseenter', function(event) {
                addEeventListen.showDelBtn(event.target);
            });
            addListener(oparent, 'mouseleave', function(event) {
                addEeventListen.shadeDelBtn(event.target);
            });
            setele('button', oparent, 'x');
            addListener(oparent, 'click', function(event) {
                addEeventListen.isDelClass(event);
            });
            let value =  $('#task_classily').innerHTML;
            saveListDate('task_classily', value);   //储存分类数据 key = 类名， value = 类名内的数据 没有二级类时
        } else if (ischange === true) {
            if (oparent.children.length === 1){
                setele('ul', oparent, '');
                //点击ul时，不触发父元素的事件
                addListener(oparent, 'click', function(event) {
                    event.stopPropagation();
                })
                setele('li', oparent, name, 'twoLevel');
                addListener(oparent, 'click', function(event) {
                    addEeventListen.selectSClass(event);
                });
            } else {
                setele('li',oparent.lastElementChild, name, 'twoLevel');
                addListener(oparent, 'click', function(event) {
                    addEeventListen.selectSClass(event);
                });
            }
            let value =  $('#task_classily').innerHTML;
            saveListDate('task_classily', value);  //储存分类数据，覆盖之前的数据，并更新；直接储存整个数据列表
        }      
    }
}

addListener($('#set_classily'), 'click', setClass);

let task = document.getElementById('task');
let date = document.getElementById('date');
let title = document.getElementById('title_bar');
let textarea = document.getElementsByTagName('textarea')[0];
let ischange2 = true;
//let nowText = [];    定义在外部，导致每次调用saveTextDate()时，都在nowText的数组后面增加三个数据

//新建任务
function setTask() {
    //存在新建分类时
    if (selectClassName !== null){
        ischange2 = false;
        for (let key of $('#task_describe').children) {
            if (key.localName !== 'button'){
                key.value = '';
            }
        }
        isClickSTB = true;
        $('#Confirm').innerText = '确认';
        $('#revise').innerText = '取消';
        shadeTaskWindow();

    }else {
        alert('请子选择分类');
    }
}

//保存输入框的的文本
function saveTextDate(date, title, textarea) {
    //要定义在内部，才能保证每次调用时，数组的值只有三个
    let nowText = [];
    nowText.push(date.value);
    nowText.push(title.value);
    nowText.push(textarea.value);
    let text = nowText[0] + ',' + nowText[1] + ',' + nowText[2]; 
    window.localStorage.setItem(nowText[1], text);
}

//获取本地储存的数据
function getStorageDate(target) {
    let value = window.localStorage.getItem(target.innerText);
    if ( value !== null && value !== ''){
        [date.value, title.value, textarea.value] = value.split(',');
    }    
}

//移除本地储存的数据
function removeStorageDate(target) {
    window.localStorage.removeItem(target);
}

//建立任务列表
function setTaksList(date, title) {
     oparent = task;
    for (let key of oparent.children){
        if (key.firstChild.nodeValue === date.value) {
            oparent = key;
        }
    }
    if (date.value !== '' && date.value !== null
        && title.value !== '' && title.value !== null) {
            if (oparent.children.length === 0 
            || oparent.firstChild.localName === 'li') {
                setele('li', oparent, date.value, 'time');
                oparent2 = oparent;
                setele('ul', oparent, '');
                setele('li', oparent, title.value, 'taskName');
                addListener(oparent, 'click', function(event) {
                    addEeventListen.selectTask(event);
                });
                //saveListDate(selectClassName.innerText, $('#task').innerHTML);
            }else {
                setele('li',oparent.firstElementChild, title.value, 'taskName');
                //点击是文字被遮盖，在style.css中加上 #task > li  {position :relative;}解决
                //原因？ 并且此时offsetTop属性是相对与task_list的位置，设置为relativ 意味着
                //元素浮动，
                addListener(oparent, 'click', function(event) {
                    addEeventListen.selectTask(event);     
                })                                                     
                //saveListDate(selectClassName.innerText, $('#task').innerHTML);
            }
        }
    ischange2 = true ;
}

//改变输入框的状态
function changeInputStaic() {
    let array = [date, title, textarea];
    if (ischange2){
        for (let i = 0; i < array.length;i++){
            array[i].disabled = true;
        } 
    }else {
        for (let i = 0;i < array.length;i++){
            array[i].disabled = false;
        }       
    }
}


let set_task = document.getElementById('set_task');
addListener($('#set_task'), 'click', setTask);

let oconfirm = document.getElementById('Confirm'); 
addListener($('#Confirm'), 'click', function(event) {
    addEeventListen.oconfirm(event.target);
});

let revise = document.getElementById('revise');
addListener($('#revise'), 'click', function(event) {
    addEeventListen.oeditor(event.target);
});

//隐藏任务描述界面
function shadeTaskWindow() {
    for (let key of $('#task_describe').children ){
        if (ischange2){
           key.disabled = true ;
           key.style.opacity = '0';
        }else {
            key.disabled = false ;
            key.style.opacity = '1';
        }
    }
}

//隐藏编辑、完成按钮
function shadeTaskbutton(target){
    for (let key of $('#task_describe').children ) {
        if (key.localName === 'button') {
            if (target.style.color === 'green'){
                key.style.opacity = '0';
                key.disabled = true;
            }else {
                key.style.opacity = '1';
                key.disabled = false;
            }
        }else {
            key.style.opacity = '1';
        }        
    }
}

//初始化页面
function initializationPage() {
    ischange2 = true;
    ClassSFram.style.backgroundColor =taskClassily.style.backgroundColor;
    taskSFram.style.backgroundColor =task.style.backgroundColor;
    task.innerHTML = '';
    shadeTaskWindow();
    selectClassName = null;
}

//日期排序
//将年月日的日期转换成毫秒存入数组比较大小  交换位置
//二分排序法
let rel =[];
let times = null;
function meigingLi(array) {
    if (array.length === 1) {
        return array[0];
    }
    let middle = Math.floor(array.length/2);
    let leftArray = array.slice(0, middle);
    let rightArray = array.slice(middle);
    task.innerHTML = ''
    MergingSorting(segmentArray(leftArray), segmentArray(rightArray));
    for (let i = 0 ;i < rel.length;i++){
        task.innerHTML += rel[i].outerHTML;
    }
    times = $('#task').getElementsByClassName('taskName');
    for (let i = 0;i < times.length;i++){
        addListener(times[i], 'click', function(event) {
                addEeventListen.selectTask(event);
        });
    }
}
function segmentArray(array) {
    if (array.length === 1) {
        return array;
    }
    var middle = Math.floor(array.length/2);
    var leftArray = array.slice(0, middle);
    var rightArray = array.slice(middle);
    return MergingSorting(segmentArray(leftArray), segmentArray(rightArray));
}

function MergingSorting(leftArray, rightArray) {
    var re = [];
    while (leftArray.length > 0 && rightArray.length > 0){
        if (Date.parse(leftArray[0].firstChild.nodeValue) >
        Date.parse(rightArray[0].firstChild.nodeValue)){
            re.push(leftArray.shift());
        }else {
            re.push(rightArray.shift())
        }
    }
    return rel = re.concat(leftArray).concat(rightArray);
}
