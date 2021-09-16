//AjaxForm提交表单
$(document).ready(() => {
    $('#sign-in-form')
        .ajaxForm({
            url: "/login",
            dataType: "json",
            type: "POST",
            success: function (response) {
                console.log(response)
                if (response['isSuccess']) {
                    console.log(response['username'])
                    localStorage.token = response['z-token']
                    $.cookie("z-token", localStorage.token);
                    location.href="/manage"
                    // window.location.replace('/manage');
                } else {

                    toastshow(response,true)
                }
            }
        });
});
$(document).ready(() => {
    $('#sign-up-form')
        .ajaxForm({
            url: '/register',
            dataType: "json",
            type: "POST",
            success: function (response) {
                if (response['isSuccess']) {
                    console.log('Successfully signed up! Please sign in now!')
                    var openSignInButton = document.getElementById("slide-right-button");
                    openSignInButton.click()

                } else {
                    toastshow(response,false)
                
                }
            }
        });

    $('input[type="file"]').change(function () {
        if ($(this).val()) {
            var filename = $(this).val();
            filename_arr = filename.split('/')
            n = filename_arr.length
            document.getElementById("show_name").innerHTML = filename_arr[n - 1];
        }
    });
});
var toastshow = (response,signin) => {
    var el = document.getElementById('toast')
    el.classList.remove('hide')
    if (signin){ 
        el.classList.remove('signup')
        el.classList.add('signin')
    }
    else{
        el.classList.add('signup')
        el.classList.remove('signin')
    }
    var op = document.getElementById('msgtoast')
    op.innerHTML = response['message']
    setTimeout(() => {
        el.classList.add('hide')
    }, 1000)


}
//切换动画效果
var overlay = document.getElementById("overlay");

// Buttons to 'switch' the page
var openSignUpButton = document.getElementById("slide-left-button");
var openSignInButton = document.getElementById("slide-right-button");

// The sidebars
var leftText = document.getElementById("sign-in");
var rightText = document.getElementById("sign-up");

// The forms
var accountForm = document.getElementById("sign-in-info")
var signinForm = document.getElementById("sign-up-info");

// Open the Sign Up page
openSignUp = () => {
    // Remove classes so that animations can restart on the next 'switch'
    leftText.classList.remove("overlay-text-left-animation-out");
    overlay.classList.remove("open-sign-in");
    rightText.classList.remove("overlay-text-right-animation");
    // Add classes for animations
    accountForm.className += " form-left-slide-out"
    rightText.className += " overlay-text-right-animation-out";
    overlay.className += " open-sign-up";
    leftText.className += " overlay-text-left-animation";
    // hide the sign up form once it is out of view
    setTimeout(function () {
        accountForm.classList.remove("form-left-slide-in");
        accountForm.style.display = "none";
        accountForm.classList.remove("form-left-slide-out");
    }, 700);
    // display the sign in form once the overlay begins moving right
    setTimeout(function () {
        signinForm.style.display = "flex";
        signinForm.classList += " form-right-slide-in";
    }, 200);
}

// Open the Sign In page
openSignIn = () => {
    // Remove classes so that animations can restart on the next 'switch'
    leftText.classList.remove("overlay-text-left-animation");
    overlay.classList.remove("open-sign-up");
    rightText.classList.remove("overlay-text-right-animation-out");
    // Add classes for animations
    signinForm.classList += " form-right-slide-out";
    leftText.className += " overlay-text-left-animation-out";
    overlay.className += " open-sign-in";
    rightText.className += " overlay-text-right-animation";
    // hide the sign in form once it is out of view
    setTimeout(function () {
        signinForm.classList.remove("form-right-slide-in")
        signinForm.style.display = "none";
        signinForm.classList.remove("form-right-slide-out")
    }, 700);
    // display the sign up form once the overlay begins moving left
    setTimeout(function () {
        accountForm.style.display = "flex";
        accountForm.classList += " form-left-slide-in";
    }, 200);
}

// When a 'switch' button is pressed, switch page
openSignUpButton.addEventListener("click", openSignUp, false);
openSignInButton.addEventListener("click", openSignIn, false);
