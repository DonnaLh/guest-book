window.onload = function(){
    var oRight = document.getElementById('right');
    var oSign = document.getElementById('sign');
    var oLogin = document.getElementById('login');
    var siInput = oSign.getElementsByTagName('input');
    var mes = oSign.getElementsByClassName('mes');
    var loInput = oLogin.getElementsByTagName('input');
    var oGuest = document.getElementById('guest');
    var oGud = document.getElementById('gud');
    var oGue = document.getElementById('gue');
    var oBtn = document.getElementById('btn');
    var oBook = document.getElementById('book');
    var oUser = document.getElementById('user');
    var oPage = document.getElementById('page');
    var Uid = getCookie("uid");
    var username = decodeURI(getCookie("username"));
    if(Uid){
        oUser.innerHTML = username;
        oGud.style.display = "none";
        oGue.style.display = "block";
    }
    var nowPage = 1;
    var allPages = 1;
    content();

    function content(){
        ajax('get','guestbook/index.php','m=index&a=getList&page='+nowPage+'&n=4',function(data){
            var data = JSON.parse(data);
            oGuest.innerHTML = '';
            for(var i=0; i<data.data.list.length; i++){
                oGuest.innerHTML +=`<div class="panel panel-info guest">
                  <div class="panel-heading">
                      <p>${data.data.list[i].username}</p>
                  </div>
                  <div class="panel-body over">
                      <p>${data.data.list[i].content}</p>
                      <p><span class="pull-right sp"><strong >踩</strong><a>(0)</a></span><span class="pull-right sp"><strong >顶</strong><a>(0)</a></span></p>
                  </div>
              </div>`;
            }
            nowPage = data.data.page;
            allPages = data.data.pages;
            //分页功能的实现
            page(oPage,nowPage,allPages);
            //单击页码留言内容发生改变
            var oAa = oPage.getElementsByTagName('a');
            for(var i=0; i<oAa.length; i++){
                oAa[i].onclick = function(){
                    if(this.innerHTML=="首页"){
                        nowPage = 1;
                    }else if(this.innerHTML=="尾页"){
                        nowPage = allPages;
                    }else if(this.innerHTML=="上一页"){
                        nowPage = nowPage-1;
                    }else if(this.innerHTML=="下一页"){
                        nowPage = nowPage+1;
                    }else{
                        nowPage = Number(this.innerHTML);
                    }

                    content();
                }
            }

        });
    }

    /*
       验证用户名
       get
           guestbook/index.php
               m : index
               a : verifyUserName
               username : 要验证的用户名
           返回
               {
                   code : 返回的信息代码 0 = 没有错误，1 = 有错误
                   message : 返回的信息 具体返回信息
               }
       */
    siInput[0].onblur = function(){
        ajax('get','guestbook/index.php','m=index&a=verifyUserName&username='+this.value,function(data){
            var data = JSON.parse(data);
            mes[0].innerHTML = data.message;
            if(data.code){
                mes[0].style.color = "red";
            }else{
                mes[0].style.color = "green";
            }
        });
    }


    /*用户注册
    get/post
    guestbook/index.php
    m : index
    a : reg
    username : 要注册的用户名
    password : 注册的密码
    返回
    {
        code : 返回的信息代码 0 = 没有错误，1 = 有错误
        message : 返回的信息 具体返回信息
    }
*/
    siInput[2].onclick = function(){
        ajax('post','guestbook/index.php','m=index&a=reg&username='+siInput[0].value+'&password='+siInput[1].value,function(data){
            var data = JSON.parse(data);
           mes[1].innerHTML = data.message;
            mes[0].innerHTML = '';
            if(data.code){
                mes[1].style.color = "red";
            }else{
                mes[1].style.color = "green";
            }
        });
    }
    /*
	用户登陆
	get/post
		guestbook/index.php
			m : index
			a : login
			username : 要登陆的用户名
			password : 登陆的密码
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/
    loInput[2].onclick = function(){
        ajax('post','guestbook/index.php','m=index&a=login&username='+loInput[0].value+'&password='+loInput[1].value,function(data){
            var data = JSON.parse(data);
            if(!data.code){
                oGud.style.display = "none";
               oGue.style.display = "block";
                oUser.innerHTML = loInput[0].value;
            }else{
                alert(data.message);
            }
        });
    }
    /*
 留言
 post
     guestbook/index.php
         m : index
         a : send
         content : 留言内容
     返回
         {
             code : 返回的信息代码 0 = 没有错误，1 = 有错误
             data : 返回成功的留言的详细信息
                 {
                     cid : 留言id
                     content : 留言内容
                     uid : 留言人的id
                     username : 留言人的名称
                     dateline : 留言的时间戳(秒)
                     support : 当前这条留言的顶的数量
                     oppose : 当前这条留言的踩的数量
                 }
             message : 返回的信息 具体返回信息
         }
 */
    oBtn.onclick = function(){
        ajax('post','guestbook/index.php','m=index&a=send&content='+oBook.innerHTML,function(data){
            var data = JSON.parse(data);
            if(!data.code){
                html= `
            <div class="panel panel-info guest">
                  <div class="panel-heading">
                      <p>${data.data.username}</p>
                  </div>
                  <div class="panel-body">
                      <p>${data.data.content}</p>
                      <p><span class="pull-right sp"><strong >踩</strong><a>(0)</a></span><span class="pull-right sp"><strong >顶</strong><a>(0)</a></span></p>
                  </div>
              </div>
            `;
                oGuest.innerHTML  = html+oGuest.innerHTML;
                oBook.innerHTML = '';
            }else{
                alert(data.message);
            }

        });
    }


    /*
        用户退出
        get/post
            guestbook/index.php
                m : index
                a : logout
            返回
                {
                    code : 返回的信息代码 0 = 没有错误，1 = 有错误
                    message : 返回的信息 具体返回信息
                }
        */
    var oLogout = document.getElementById('logout');
    oLogout.onclick = function(){
        ajax('post','guestbook/index.php','m=index&a=logout',function(data){
            var data = JSON.parse(data);
            if(!data.code){
                alert(data.message);
                oGud.style.display = "block";
                oGue.style.display = "none";
            }
        })
    }


function getCookie(key){
        var arr1 = document.cookie.split('; ');//；后面的空格不要忘了
        for(var i=0; i<arr1.length; i++){
            var arr2 = arr1[i].split('=');
            if(arr2[0]==key){
                return arr2[1];
            }
        }
}
//分页功能的实现
function page(obj,nowPage,allPages){
        obj.innerHTML = '';
        if(allPages>3&&nowPage>2){
            var oA = document.createElement('a');
            oA.innerHTML = "首页";
            obj.appendChild(oA);
        }
        if(nowPage>1){
            var oA = document.createElement('a');
            oA.innerHTML = "上一页";
            obj.appendChild(oA);
        }
        if(allPages<=3){
            for(var i=1; i<=allPages; i++){
                var oA = document.createElement('a');
                oA.innerHTML = i;
                if(nowPage==i){
                    oA.className="active";
                }
                obj.appendChild(oA);
            }
        }else{
           for(var i=1; i<=3; i++){
               var oA = document.createElement('a');
               if(nowPage<3){
                   if(nowPage==i){
                       oA.className = "active";
                   }
                   oA.innerHTML = i;
               }else if(allPages-nowPage<2){
                   oA.innerHTML = allPages-3+i;
                   if(allPages-3+i ==nowPage){
                       oA.className="active";
                   }
               }else{
                   oA.innerHTML = nowPage-2+i;
                   if(i==2){
                       oA.className='active';
                   }
               }
               obj.appendChild(oA);

           }
        }
        if(allPages-nowPage>=1){
            var oA = document.createElement('a');
            oA.innerHTML = "下一页";
            obj.appendChild(oA);
        }
        if(allPages-nowPage>1){
            var oA = document.createElement('a');
            oA.innerHTML = "尾页";
            obj.appendChild(oA);
        }
}






}