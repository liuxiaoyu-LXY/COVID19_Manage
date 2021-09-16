const ind_ref = 1

$(function(){
    $(".topbar div").each(function(index,element){
        if (index == ind_ref){
            element.classList.add('active')
        }
        else{
            element.classList.remove('active')
        }
        // console.log(index,element.classList)
    })

})

let pageNo = 0;
let pagesize = 5;
let lock = false;
$(window).scroll(function(){
    var scrollTop = Math.ceil($(this).scrollTop());//滚动条与顶部的高度  假如399.5
   var curHeight = $(this).height();//当前可视页面高度     假如600
   var totalHeight = $(document).height();//页面的总高度   假如1000
    if(scrollTop+curHeight >= totalHeight){//滚动条触底，触发事件//两数字相加不可能相等于，所以加1
      showData(pageNo++);
    }

})
function showData(){
    if (lock){
        return
    }
    lock = true
    pageNo+=pagesize;
    const owap =document.querySelector('.outwrap')

    $.ajax({
        type:'get',
        url:`/explore?num=${pageNo}&count=${pagesize}`,
        datatype:'json',
        success:function(data){
            data = JSON.parse(data)
            let iconlist = data.icons
            let imglist = data.images
            let user = data.user
            for (blog of data.data){
            // console.log($('.outwrap').html)
            owap.innerHTML += 
            `<div class="outer">
            <div class="userinfo">
                <!-- <img class='icon' src=${blog.icon}> -->
                <img class='icon' src='static/image/default.jpg'>
                <p class="author">${blog.author}</p>
                <p class='time'>Post on ${blog.pdatetime}</p>
            </div>
            <div class= 'wrapper' onclick = "handleclick('${blog.id}')">
            <img class='lazy' src='static/image/loading.jpg' data-src=${imglist[blog.id][0]}>
        </div>
            <div class='infobox'>
                <span class='iconfont'>&#xe631;</span><span class='collect'>${blog.lovenum}</span>
                <span class='iconfont'>&#xe61b;</span><span class='response'>${blog.commentlength}</span>
                <h3>${blog.title}</h3>
                <span class='type'>#${blog.type}</span>
                <div class='collectin'>Collect</div>
            </div>
        
        </div>`
            }




            
        }
    })
    let timer = setTimeout(()=>{
        lock = false;
        clearTimeout(timer)
    },800)
}
let wh = window.innerHeight
let ww = window.innerWidth

function lazyload(){
    const imgs = [...document.querySelectorAll('.lazy')];
    for (let i = 0; i < imgs.length; i++) {
        const $img = imgs[i];
        
        if (isInVisibleArea($img)) {
        //   console.log($img.src,$img.style.height)
          $img.src = $img.dataset.src;
          $img.classList.remove('lazy')
          
        }
      }

}
function debounce(fn, miliseconds = 250, context) {
    let timer = null;

    return function (...args) {
      const self = context || this;

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        fn.apply(self, args);
        timer = null;
      }, miliseconds);
    };
  }
function isInVisibleArea($el) {
    const rect = $el.getBoundingClientRect();
    //  console.log(rect);

    return (
      rect.bottom > 0 &&
      rect.top < wh &&
      rect.right > 0 &&
      rect.left < ww
    );
  }

$(function(){
    lazyload();
      // window.addEventListener('scroll', lazyload, false);
      window.addEventListener('scroll', debounce(lazyload), false);

})
