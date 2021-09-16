const ind_ref = 3
$(function(){
    $(".topbar div").each(function(index,element){
        if (index == ind_ref){
            element.classList.add('active')
        }
        else{
            element.classList.remove('active')
        }
        
    })

})
$(document).ready(() => {
    $('#updateform')
        .ajaxForm({
            url: "/update",
            dataType: "json",
            type: "POST",
            success: function (response) {
                if (response['isSuccess']) {
                    console.log(response)
                    // localStorage.username = response['username']
                    // $.cookie("username", localStorage.username);
                    window.location.replace('/manage');
                } else {

                    alert(response['message'])
                }
            }
        });
});
function del(id){
    location.href=`/deluser?userid=${id}`
    }
function update(a){
    $('.updateForm').removeClass('hide')
    let ohide = document.getElementById('hide')
    ohide .value = a[0]
    a.shift()
    $('.updateForm .content').each(function(index,element){
        element.value = a[index]
    })

}