const fs = require('fs');
function sleep(ms) {
  return  new Promise(resolve => setTimeout(resolve, ms));
}
document.getElementById('loadbtn').addEventListener('click', () => {
    let fileinput = document.getElementById('fileinput');
    fileinput.click();
    fileinput.addEventListener('change', () => {
        sleep(3000);
        let file=fileinput.files[0];
        if(file!=null&&file!=undefined){
        let response = sendReq('http://localhost:3000/file','POST',file);
        alert(response);
        if(checkres(response)){
            window.location.replace('DataBase.html');
        }
        }
        else{
            alert("No file selected");
        }
    });
    
});
document.getElementById('createbtn').addEventListener('click', () => {
        let dirinput = document.getElementById('fileinput');
    dirinput.click();
    dirinput.addEventListener('change', () => {
        sleep(3000);
        let file=dirinput.files[0];
        let directory = String(file.path).substring(0,String(file.path).lastIndexOf('\\'));
        if(file!==null&&file!==undefined){
        let response = sendReq('http://localhost:3000/new','POST',directory);
        alert(response);
        if(checkres(response)){
            window.location.replace('DataBase.html');
        }
        }
        else{
            alert("No file selected");
        }
    });
        
});

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
        if(res===null||res===undefined||res===""){
            return false;
        }
        if(res[0]=='E'||res[0]=='e'){
        return false;
        }
    }
    catch(err){
        return false;
    }
    return true;
}
