function hideOrShow(el){
    if(el.className=="row hide"){
        el.className="row"
    }else{
        el.className="row hide"
    }
}

window.onload=function(){
    let sidbar=document.getElementById('sidbar');
    let main=document.getElementById('main');
    let hide_sidbar=document.getElementById('hide_sidbar');

    let isHide_sidbar=false;
    let row=sidbar.getElementsByClassName('row');
    for(let i = 0 ;i < row.length;i++){
        let row_h2=row[i].getElementsByTagName('h2')[0];
        row_h2.onclick=function(){
            hideOrShow(row[i]);
        }
    }

    hide_sidbar.onclick=function(){
        if(isHide_sidbar){
            hide_sidbar.innerText="隐";
            sidbar.style.display="block";
            main.style.width="87%";
            isHide_sidbar=false;
        }else{
            hide_sidbar.innerText="显";
            sidbar.style.display="none";
            main.style.width="100%";
            isHide_sidbar=true;
        }
    }


};
