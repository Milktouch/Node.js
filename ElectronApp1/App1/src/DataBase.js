var database;
var orginaldb ;
function init(){
    database=sendReq('/get','GET');
    originaldb=sendReq('/get','GET');
    updatetable();
}


const fs = require('fs');
var h,w;
//database={ key1:[{value:'value1',type:'Text'},{value:'value2',type:'Text'},{value:'value3',type:'Text'}], key2:[{value:'value1',type:'Text'},{value:'value2',type:'Text'},{value:'value3',type:'Text'}],key3:[{value:'value1',type:'Text'},{value:'value2',type:'Text'},{value:'value3',type:'Text'}]};
function updatetable(){
    if(database!=null&&database!=undefined){
        let table = document.getElementById('database-body');
        table.innerHTML='<tr id="headers"></tr>';
        let length=0;
        for(let key in database){
            if(database[key].length>length){
                length=database[key].length;
            }
            let header = document.getElementById('headers');
            header.innerHTML+=`<th class="header">${key}</th>`;
        }
        document.querySelectorAll('.header').forEach((element)=>{
            h=element.style.height;
            w=element.style.width;
        });
        for(let i =0;i<length;i++){  
            table.innerHTML+=`<tr id="row${i}" class="datarow"></tr>`;
            for(let key in database){
                let info = database[key][i].value;
                let type = database[key][i].type;
                let html;
                if(type=='Image'){
                    html= `<td class="data img">${database[key][i].value}<img class="data-img" src="${database[key][i].value}"/> </td>`
                }
                else{
                    html=`<td class="data">${database[key][i].value}</td>`;
                }
                document.getElementById(`row${i}`).innerHTML+=html;
            }
        }
        resizeImg();
        document.querySelectorAll('.data,.header').forEach((element)=>{
    element.setAttributeNode(document.createAttribute('contenteditable'));
    element.addEventListener('focusout',(elem)=>{
        
            if(elem.target.className=='data'){
                let index;
                document.querySelectorAll('.datarow').forEach((e)=>{if(elem.target.parentElement.id==e.id){index=e.rowIndex; return;}});
                let key = elem.target.parentElement.parentElement.children[0].children[elem.target.cellIndex].textContent;
                let value = elem.target.textContent;
                updatejson(key,index-1,value);
                updatetable();
                return;
            }
            else if(elem.target.className=='header'){
                let key = elem.target.textContent;
                let index = elem.target.cellIndex;
                updatejson(key,index,null);
                updatetable();
                return;
            }
            
                let index;
                document.querySelectorAll('.datarow').forEach((e)=>{if(elem.target.parentElement.id==e.id){index=e.rowIndex; return;}});
                let key = elem.target.parentElement.parentElement.children[0].children[elem.target.cellIndex].textContent;
                let value = elem.target.textContent;
                updatejson(key,index-1,value);
                updatetable();
                return;
        
        });
});
    }
}
//database{ key1: [{value:value,type:type}],
//          key2: [{value:value,type:type}]
//        }
document.getElementById('drop-menu').textContent='> Actions';
document.getElementById('drop-menu').addEventListener('click',(event)=>{
    let menu = document.getElementById('action-menu');
    if(menu.style.opacity==0){
        menu.style.opacity=1;
        menu.style.pointerEvents='all';
        document.getElementById('drop-menu').textContent='v Actions';
    }
    else{
        menu.style.opacity=0;
        menu.style.pointerEvents='none';
        document.getElementById('drop-menu').textContent='> Actions';
    }
    
});
document.getElementById('database-body').addEventListener('mouseover',(event)=>{
    document.querySelectorAll('#headers>.header:hover').forEach((element)=>{
    let key = element.textContent;
    let values = database[key];
    let index = Object.keys(database).indexOf(key);
    if(index==-1||index==null||index==undefined) return;
    for(let i =0;i<values.length;i++){
        let tds = document.querySelectorAll(`#row${i}>.data`);
        tds[index].classList.add('selected');
    }
    });
    document.querySelectorAll('.datarow>.data:hover').forEach((element)=>{
        let index = element.cellIndex;
        let elem = document.querySelectorAll('#headers>.header')[index];
        elem.classList.add('hselected');
    });
});
document.getElementById('database-body').addEventListener('mouseout',(event)=>{
    document.querySelectorAll('#headers>.header:not(:hover)').forEach((element)=>{
    let key = element.textContent;
    let values = database[key];
    let index = Object.keys(database).indexOf(key);
    if(index==-1||index==null||index==undefined) return;
    for(let i =0;i<values.length;i++){
        let tds = document.querySelectorAll(`#row${i}>td`);
        tds[index].classList.remove('selected');
    }
    });
    document.querySelectorAll('.datarow>.data:not(:hover)').forEach((element)=>{
        let index = element.cellIndex;
        let elem = document.querySelectorAll('#headers>.header')[index];
        elem.classList.remove('hselected');
    });
});
//Start: Action button listeners and executors
document.querySelectorAll('#action-menu>button').forEach((element)=>{element.addEventListener('click',()=>{
    var action = element.textContent;
    if(action=='Add Row'){
        updatetable();
        AddRow();
        updatetable();
    }
    if(action=='Remove Row'){
        updatetable();
        document.getElementById('headers').innerHTML+=`<th id="X"><button id="cancel-row">Cancel</button></th>`;
        document.querySelectorAll('.datarow').forEach((element)=>{
            element.innerHTML+=`<td><button class="remove-row">X</button></td>`;
        });
        document.querySelectorAll('#cancel-row').forEach((element)=>{
            element.addEventListener('click',()=>{
                updatetable();
            });
        });
        document.querySelectorAll('.remove-row').forEach((element)=>{
            element.addEventListener('click',(event)=>{
                let row = event.target.parentElement.parentElement;
                let index = row.getAttribute('id').substring(3);
                removeRow(index);
                updatetable();
            });
        });
    }
    if(action=='Add Column'){
        updatetable();
        AddColumn();
        updatetable();
    }
    if(action=='Remove Column'){
        updatetable();
        let wholetable = document.getElementById('database-body').innerHTML;
        let table = document.getElementById('database-body');
        table.innerHTML='<tr id="remove-column-row"></tr>';
        table.innerHTML+=wholetable;
        let keys = table.querySelectorAll('#headers>.header').length;
        let xrow = document.getElementById('remove-column-row');
        for(let i =0;i<keys;i++){
            xrow.innerHTML+=`<td><button class="remove-column-btn">X</button></td>`;
        }
        xrow.innerHTML+=`<td><button id="cancel-column">Cancel</button></td>`;
        let index;
        document.querySelectorAll('.remove-column-btn').forEach((element)=>{
            element.addEventListener('click',()=>{
                index = element.parentElement.cellIndex;
                if(index==undefined||index==null||index==-1) return;
                RemoveColumn(index);
                updatetable();
        })});
        document.getElementById('cancel-column').addEventListener('click',()=>{
            updatetable();
        });
        
    }
    if(action=='Save'){
        Save();
    }
});});
//End: Action button listeners and executors

function updatedbfromtable(){
    let keyelems = document.querySelectorAll('#headers>.header');
        let keylist = [];
        keyelems.forEach((element)=>{
            let index =1;
            let key = element.textContent;
            while(keylist.includes(key)){
                key = element.textContent+`(${index})`;
                index++;
            }
            keylist.push(key);
        });
        for(let i =0;i<keylist.length;i++){
            if(keylist[i]==undefined||keylist[i]==null||keylist[i]=='') {
                let index=0;
                while(keylist.includes(`key${index}`)){
                    index+=1;
                }
                keylist[i]=`key${index}`;
            }
            
        }
        let rows = document.querySelectorAll('.datarow');
        let rowsdata = [];
        rows.forEach((element)=>{
            let row = [];
            element.querySelectorAll('.data').forEach((elem)=>{
                    row.push({value:elem.textContent,type:'Text'});
            });
            rowsdata.push(row);
        });
        let tempdatabase = {};
        for(let i =0;i<keylist.length;i++){
            let datacolumn = [];
            for(let j =0;j<rows.length;j++){
                datacolumn.push(rowsdata[j][i]);
            }
            tempdatabase[keylist[i]]=datacolumn;
        }
        database = {}
        database = tempdatabase;
        updatetable();
}
function updatejson(key,index,info){
    if (!Object.keys(database).includes(key)){
        if(key===null||key===undefined||key==='') {
            let index=1;
            while(Object.keys(database).includes(`${key}(${index})`)){
                index+=1;
            }
            key=`key${index}`;
        }
        oldkey=Object.keys(database)[index];
        let data = database[oldkey];
        delete database[oldkey];
        database[key]=data;
        let allkeys = Object.keys(database);
        for(let i =index;i<allkeys.length-1;i++){
            oldkey = allkeys[i];
            data = database[oldkey];
            delete database[oldkey];
            database[allkeys[i]]=data;
        }
        return;
    }
    if(info===null||info===undefined)return;
    if(fs.existsSync(info)){
        ext = info.substring(info.lastIndexOf('.')+1);
        if(ext=='png'||ext=='jpg'||ext=='jpeg'){
            info={value:String(info),type:'Image'};
        }
        else{
            info={value:String(info),type:'File'};
        }
    }
    else{
        info={value:String(info),type:'Text'};
    }
    database[key][index]=info;
    return;
    
}
    
async function resizeImg(){
    document.querySelectorAll('.data-img').forEach((element)=>{
        element.style.height=h;
        element.style.width=w;
    });
}
function QueryExe(query){
    query=String(query);
}
function removeRow(index){
    for(let key in database){
        database[key].splice(index,1);
    }
}
function RemoveColumn(index){
    delete database[Object.keys(database)[index]];
}
function AddColumn(){
    let table = document.getElementById('database-body');
        let length = table.querySelectorAll('tr').length;
        let keys =1;
        while(`key${keys}` in database){
            keys+=1;
        }
        database[`key${keys}`]=[];
        for(let i =1;i<length;i++){
            database[`key${keys}`].push({value:`value${i}`,type:'type'});
        }
}
function AddRow(){
        let table = document.getElementById('database-body');
        let length = table.querySelectorAll('tr').length;
        for(let key in database){
            database[key].push({value:`value${length}`,type:'Text'});
            
        }
}
function Save(){
    orginaldb={};
    orginaldb=database;
    let json = JSON.stringify(database);
    sendReq('/save','POST',json);
}
function sendReq(url,method,data){
    let response="";
    try{
            let req = new XMLHttpRequest();
            req.open(`${method}`, `${url}`, false);
            req.onload = function () {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    console.log(req.responseText);
                    response=req.responseText;
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    console.log("Error");
                }
            };   
            if(method=='POST'){
                req.send(`${data}`);
            }
            else{
                req.send();
            }
    }
    catch(err){
        console.log(err);
    }
    return String(response);
}
function checkres(res){
    try{
        if(res[0]=='E'||res[0]=='e'){
        return false;
        }
    }
    catch(err){
        return false;
    }
    return true;
}


