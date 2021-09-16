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
    var mySwiper = new Swiper ('.swiper-container', {
      direction: 'horizontal', // 垂直切换选项
      loop: false, // 循环模式选项
      
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
      },
      
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      
      // 如果需要滚动条
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    })        