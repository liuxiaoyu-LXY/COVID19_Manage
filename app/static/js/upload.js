
window.onload = function(){
    var input = document.getElementById("file_input");
    var result;
    var dataArr = []; // 储存所选图片的结果(文件名和base64数据)
    var fd;  //FormData方式发送请求
    var oSelect = document.getElementById("select");
    var oAdd = document.getElementById("add");
    var oSubmit = document.getElementById("submit");
    var oInput = document.getElementById("file_input");
    var ochoose = document.getElementsByClassName('outerchoose')
    var fileArr = []
    var fileobj={}
    var ind = 1
    var formimg = new FormData()
    for (let occ of ochoose){
        occ.addEventListener('click',()=>{
            occ.classList.toggle('active')
            for (let u of ochoose){
                if (u!=occ){
                    u.classList.remove('active')
                }
            }
        })
    }
    if(typeof FileReader==='undefined'){
        alert("抱歉，你的浏览器不支持 FileReader");
        input.setAttribute('disabled','disabled');
    }else{
        input.addEventListener('change',readFile,false);
    }　　　　　//handler
 
 
    function readFile(){
        fd = new FormData();
        var iLen = this.files.length;
        for(var i=0;i<iLen;i++){
            if (!input['value'].match(/.jpg|.gif|.png|.jpeg|.bmp/i)){　　//判断上传文件格式
                return alert("上传的图片格式不正确，请重新选择");
            }
            for (file of this.files){
                fileArr.push(file)
                ind+=1
                fileobj[ind] = file
               
            }
            console.log(fileobj);//打印改变后的当前元素
            // console.log('====',formimg.getAll('files'));//打印改变后的当前元素
            var reader = new FileReader();
            fd.append(i,this.files[i]);
            reader.readAsDataURL(this.files[i]);  //转成base64
            reader.fileName = this.files[i].name;
 
            reader.onload = function(e){
                var imgMsg = {
                    name : this.fileName,//获取文件名
                    base64 : this.result   //reader.readAsDataURL方法执行完后，base64数据储存在reader.result里
				}
                dataArr.push(imgMsg);
                result = '<div class="delete">delete</div><div class="result"><img class="subPic" src="'+this.result+'" alt="'+this.fileName+'"/></div>';
                var div = document.createElement('div');
                div.innerHTML = result;
                div['className'] = 'float';
                div['id'] = 'img'+ind;
                document.getElementById('outerside').appendChild(div);  　　//插入dom树
                var img = div.getElementsByTagName('img')[0];
                img.onload = function(){
                    var nowHeight = ReSizePic(this); //设置图片大小
                    this.parentNode.style.display = 'block';
                    var oParent = this.parentNode;
                    if(nowHeight){
                        oParent.style.paddingTop = (oParent.offsetHeight - nowHeight)/2 + 'px';
                    }
                }
                div.onclick = function(){
                    // console.log($(this).id)
                    a = $(this).attr('id').split('img')[1]
                    console.log(a)
                    delete fileobj[a]
                    console.log(fileobj,'ddddd')
                    $(this).remove();                  // 在页面中删除该图片元素
                }
            }
        }
    }
 
 
    function send(){
        for (key in fileobj){
            formimg.append('files', fileobj[key], fileobj[key].name)
            // console.log(fileobj[key])
        }
        console.log(formimg.getAll('files'),'sssss')
        // var submitArr = [];

         
                // console.log(file,'====')
                // var ffname = 'file'+fileArr.length+'.'+file.name.split('.')[1]
                // formimg.append('files', file, ffname)
                // console.log(formimg.get(ffname));
                // $('#outputfile')[0].files.push(file)
        // $('.subPic').each(function () {
        //         submitArr.push({
        //             name: $(this).attr('alt'),
        //             base64: $(this).attr('src')
        //         });
        //     }
        // );
        var obj = new Object()
        // obj.img = submitArr
        
        obj.title = $('input[class="title"]').val()
        obj.content = $('textarea').val()
        obj.type=$('input[name="type"]').val()
        
        ovv = document.getElementsByClassName('typechoose')
        for(let oc of ovv){
            if (oc.checked){
                obj.type=oc.value
            }
        }
        formimg.append('title', obj.title)
        formimg.append('content',obj.content)
        formimg.append('type',obj.type)
        // console.log(formimg)
        // let data={
        //     data:JSON.stringify(obj)
        // }

        $.ajax({
            url : '/publish',
            type : 'post',
            data : formimg,
            // dataType: 'json',
            processData: false,   //用FormData传fd时需有这两项
            contentType: false,
            success : function(data){
                console.log(data)
                if(data.isSuccess){
                    // location.href=data.url
                }
                
          　}
        })
    }
 
 
 
 
    oSelect.onclick=function(){
        oInput.value = "";   // 先将oInput值清空，否则选择图片与上次相同时change事件不会触发
        //清空已选图片
        $('.float').remove();
        fileobj = {}
        // formimg.delete('files')
        // console.log('====',formimg.getsAll('files'));//打印改变后的当前元素

        oInput.click();
    }
 
 
    oAdd.onclick=function(){
        oInput.value = "";   // 先将oInput值清空，否则选择图片与上次相同时change事件不会触发
        oInput.click();
    }
 
 
    oSubmit.onclick=function(){
        // if(!dataArr.length){
        //     return alert('请先选择文件');
		// }
        send();
    }
}
/*
 用ajax发送fd参数时要告诉jQuery不要去处理发送的数据，
 不要去设置Content-Type请求头才可以发送成功，否则会报“Illegal invocation”的错误，
 也就是非法调用，所以要加上“processData: false,contentType: false,”
 * */
 
 
function ReSizePic(ThisPic) {
    var RePicWidth = 200; //这里修改为您想显示的宽度值
 
    var TrueWidth = ThisPic.width; //图片实际宽度
    var TrueHeight = ThisPic.height; //图片实际高度
 
    if(TrueWidth>TrueHeight){
        //宽大于高
        var reWidth = RePicWidth;
        ThisPic.width = reWidth;
        //垂直居中
        var nowHeight = TrueHeight * (reWidth/TrueWidth);
        return nowHeight;  //将图片修改后的高度返回，供垂直居中用
    }else{
        //宽小于高
        var reHeight = RePicWidth;
        ThisPic.height = reHeight;
    }
}
 
 
 
