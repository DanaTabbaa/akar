function webFunction(){
$(document).ready(function() {
    //(("ready!");
});



// header sticky script
// window.onscroll = function() { myFunction() };

// var header = document.getElementById("header_main");
// var sticky = header.offsetTop;

// function myFunction() {
//     if (window.pageYOffset > sticky) {
//         header.classList.add("sticky");
//     } else {
//         header.classList.remove("sticky");
//     }
// }
//
// var screen = $(window);
// if (screen.width < 768) {
//     $('header').removeClass('sticky');
// }

// custom selectbox js
// $(function() {
//     ;
//     $('.selectpicker').selectpicker();

// });


// gallery js

$(document).ready(function() {

    $(".filter-button").click(function() {
        var value = $(this).attr('data-filter');

        if (value == "all") {
            //$('.filter').removeClass('hidden');
            $('.filter').show('1000');
        } else {
            //            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
            //            $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
            $(".filter").not('.' + value).hide('3000');
            $('.filter').filter('.' + value).show('3000');

        }
    });

    if ($(".filter-button").removeClass("active")) {
        $(this).removeClass("active");
    }
    $(this).addClass("active");

});


// Stop modal video after modal close:
$('#video-first').on('hidden.bs.modal', function() {
    $('#playerID').trigger('pause');
})
}
