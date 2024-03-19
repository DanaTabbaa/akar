function mainFunction() {
    $(document).ready(function() {
        $('#show-hidden-country').click(function() {
            $('.hidden-country').slideToggle("slow");

        });
        $("#hide-country").click(function() {
            $(".hidden-country").hide();
        });
        $('#show-hidden-city').click(function() {
            $('.hidden-city').slideToggle("slow");

        });
        $("#hide-city").click(function() {
            $(".hidden-city").hide();
        });
        $('#show-hidden-district').click(function() {
            $('.hidden-district').slideToggle("slow");

        });
        $("#hide-district").click(function() {
            $(".hidden-district").hide();
        });
        $('#show-hidden-owner').click(function() {
            $('.hidden-owner').slideToggle("slow");

        });
        $("#hide-owner").click(function() {
            $(".hidden-owner").hide();
        });
        $('#show-hidden-tenant').click(function() {
            $('.hidden-tenant').slideToggle("slow");

        });
        $("#hide-tenant").click(function() {
            $(".hidden-tenant").hide();
        });
        $('#show-hidden-delegate').click(function() {
            $('.hidden-delegate').slideToggle("slow");

        });
        $("#hide-delegate").click(function() {
            $(".hidden-delegate").hide();
        });
        $('#show-hidden-commission').click(function() {
            $('.hidden-commission').slideToggle("slow");

        });
        $("#hide-commission").click(function() {
            $(".hidden-commission").hide();
        });
        $('#show-hidden-com-tenant').click(function() {
            $('.hidden-com-tenant').slideToggle("slow");

        });
        $("#hide-com-tenant").click(function() {
            $(".hidden-com-tenant").hide();
        });
    });


    $("#menu-toggle,.icon-set,.cross-circle").click(function(e) {
        e.preventDefault();
        $(".logo-name, .menus, .list-group, .sidebar-heading,#sidebar-wrapper,#page-content-wrapper").toggleClass("toggled");
        //sidebar-wrapper
    });
    $('.list-group-item.list-group-item-action').on('click', function(e) {
        $(this).find('[class*="angle"]').toggleClass(' la-angle-down la-angle-up')
    });
    $('.btn-toggle').click(function() {
        $(this).find('.btn').toggleClass('active');
        if ($(this).find('.btn-toggle-one').length > 0) {
            $(this).find('.btn').toggleClass('btn-toggle-one');
        }
        $(this).find('.btn').toggleClass('btn-toggle-two');
    });


    $("#close-switcher").click(function() {
        $(".blast-box").removeClass("appear-it");
    });



    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawBasic);

    function drawBasic() {

        var data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'cat');

        data.addRows([
            [0, 0],
            [1, 10],
            [2, 23],
            [3, 17],
            [4, 18],
            [5, 9],
            [6, 11],
            [7, 27],
            [8, 33],
            [9, 40],
            [10, 32],
            [11, 35],
            [12, 30],
            [13, 40],
            [14, 42],
            [15, 47],
            [16, 44],
            [17, 48],
            [18, 52],
            [19, 54],
            [20, 42],
            [21, 55],
            [22, 56],
            [23, 57],
            [24, 60],
            [25, 50],
            [26, 52],
            [27, 51],
            [28, 49],
            [29, 53],
            [30, 55],
            [31, 60],
            [32, 61],
            [33, 59],
            [34, 62],
            [35, 65],
            [36, 62],
            [37, 58],
            [38, 55],
            [39, 61],
            [40, 64],
            [41, 65],
            [42, 63],
            [43, 66],
            [44, 67],
            [45, 69],
            [46, 69],
            [47, 70],
            [48, 72],
            [49, 68],
            [50, 66],
            [51, 65],
            [52, 67],
            [53, 70],
            [54, 71],
            [55, 72],
            [56, 73],
            [57, 75],
            [58, 70],
            [59, 68],
            [60, 64],
            [61, 60],
            [62, 65],
            [63, 67],
            [64, 68],
            [65, 69],
            [66, 70],
            [67, 72],
            [68, 75],
            [69, 80]
        ]);

        var options = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: 'Popularity'
            }
        };
        var options = {
            'width': '100%',
            'height': 'auto'
        };

        // var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        // chart.draw(data, options);
    }


}

function changeToLTR() {

    $('html').removeClass('direction-rtl').addClass('direction-ltr');
}

function changeToRTL() {

    $('html').removeClass('direction-ltr').addClass('direction-rtl');
}




/**************************Lease Tab JS************************************/

// function openCity(evt, cityName) {
//   var i, tabcontent, tablinks;
//   tabcontent = document.getElementsByClassName("tabcontent");
//   for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[i].style.display = "none";
//   }
//   tablinks = document.getElementsByClassName("tablinks");
//   for (i = 0; i < tablinks.length; i++) {
//     tablinks[i].className = tablinks[i].className.replace(" active", "");
//   }
//   document.getElementById(cityName).style.display = "inline-block";
//   evt.currentTarget.className += " active";
// }

// document.getElementById("defaultOpen").click();




/******************show hide div*********************/
// $('#grayButton').click(switchGray);
// $('#whiteButton').click(switchWhite);
// $('#blueButton').click(switchBlue);
// $('#yellowButton').click(switchYellow);

// function switchGray() {
//   $('body').attr('class', 'gray');
// }

// function switchWhite() {
//   $('body').attr('class', 'white');
// }

// function switchBlue() {
//   $('body').attr('class', 'blue');
// }

// function switchYellow() {
//   $('body').attr('class', 'yellow');
// }
