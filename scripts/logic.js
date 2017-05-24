///////////////////////////////-- FILE START --\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
$(document).ready(function () {
    
    // init variables
    //-----------------------------------------------------------------------\\
    var cTemp,
        condition,
        address,
        latitude,
        longitude,
        icon,
        windDir,
        windMS,
        system      = 'metric',
        locationKey = 'AIzaSyC_RU-D73VUclovU7vgkxDcM-K5pSyQ9LA',
        weatherKey  = '4155fa2218b480bf1f704c6d0ed28a1d',
        units = {
            'metric'   : ['C', 'm/s'],
            'imperial' : ['F', 'mph']
        },
        background  = {
            "cold":
                ['kp59w0tforbm628/cold%20%281%29.jpg',
                 'f8g4ayfy4mymf2g/cold%20%282%29.jpg',
                 '6efllyw2qd0sfk8/cold%20%283%29.jpg',
                 '9jindo7y4z9tizq/cold%20%284%29.jpg'],
            "cool":
                ['lv0w1x0av9u53da/cool%20%281%29.jpg',
                 'fs94dkdi1er7696/cool%20%282%29.jpg',
                 'lj8ar3catzxp3uk/cool%20%283%29.jpg',
                 'xy3ig1vjjqs4q6h/cool%20%284%29.jpg'],
            "warm":
                ['7jekb4cl83kxzh4/warm%20%281%29.jpg',
                 '80l0ultld2plvpq/warm%20%282%29.jpg',
                 'vn0kinjx084sozb/warm%20%283%29.jpg',
                 'i5fgm3rdw2pki70/warm%20%284%29.jpg'],
            "hot": 
                ['0d6al64k9qwndo7/hot%20%281%29.jpg',
                 'pz0d47u0phfaae1/hot%20%282%29.jpg',
                 'ci3v3f4t69qax0x/hot%20%283%29.jpg',
                 'xvf8umbqp6n7h8g/hot%20%284%29.jpg'],
            "scorching":
                ['el445mwsyoojt6s/scorching%20%281%29.jpg',
                 'rqtffttxct5z08b/scorching%20%282%29.jpg',
                 'lky3g690e9tzd02/scorching%20%283%29.jpg',
                 'llrz74qn2fbk6sj/scorching%20%284%29.jpg'],
            "rain":
                ['0zk1i7fm2xjev5p/rain%20%281%29.jpg',
                 'ybeyunzep8b9c4w/rain%20%282%29.jpg',
                 '4c0b819tc4z1bfm/rain%20%283%29.jpg',
                 '4otj7sld9ra0xxy/rain%20%284%29.jpg'],
            "mist":
                ['b7vrqrxolwd0ufw/mist%20%281%29.jpg',
                 'qs3pno6lzkeygau/mist%20%282%29.jpg',
                 'stszfccj0j4j4sf/mist%20%283%29.jpg',
                 'yleunwlrcqysher/mist%20%284%29.jpg']
        };//=================================================================//

    
    // convert string to proper case
    //-----------------------------------------------------------------------\\
    function titleCase(str) {
        return str.replace(/\w\S*/g, function (word) {
            return word.charAt(0).toUpperCase() +
                word.substr(1).toLowerCase();
        });
    }//======================================================================//

    
    // generate random number 0-num; used to select background
    //-----------------------------------------------------------------------\\
    function randomize(num) {
        return Math.floor(num * Math.random());
    }//======================================================================//

    
    // convert API icon name to url
    //-----------------------------------------------------------------------\\
    function symbolize(str) {
        return 'http://openweathermap.org/img/w/' + str + '.png';
    }//======================================================================//
    
    
    // CSS transform weathervane image based on wind angle
    //-----------------------------------------------------------------------\\
    function rotateCompass() {
        var cardinal = ['North',
                        'Northeast',
                        'East',
                        'Southeast',
                        'South',
                        'Southwest',
                        'West',
                        'Northwest'],
            // if degrees > 360, reset angle at zero
            angle = Math.round(windDir % 360 / 45),
            // if angle undefined, default to zero
            // (compass must display a direction)
            rotate = 'rotate(' + (angle || 0) * 45 + 'deg)';
        
        $('#compass').css({
            '-webkit-transform' : rotate,
            '-moz-transform'    : rotate,
            '-ms-transform'     : rotate,
            '-o-transform'      : rotate,
            'transform'         : rotate
        });
        // wind is variable if direction N/A
        return cardinal[angle] || 'Variable';
    }//======================================================================//
    
    
    // use unit selector to toggle between C and F temps
    //-----------------------------------------------------------------------\\
    function convertTemp() {
        var fTemp  = cTemp * 9 / 5 + 32,
            degree = (system === 'imperial') ? fTemp : cTemp;
        $('#temp').html(degree.toFixed(1) + ' &deg;' + units[system][0]);
    }//======================================================================//
    
    
    // use unit selector to toggle between m/s and mph
    //-----------------------------------------------------------------------\\
    function convertVelo() {
        var windMPH = windMS * 2.236936,
            speed   = (system === 'imperial') ? windMPH : windMS,
            veloStr = speed.toFixed(1) + ' ' + units[system][1] + ' ';
        $('#wind').text('Wind Speed: ' + veloStr + rotateCompass());
    }//======================================================================//

    
    // toggle containers
    //-----------------------------------------------------------------------\\
    function displayPartition(slide) {
        let slides = ['#error_div', '#init_div', '#info_div', '#result_div'];
        
        slides.forEach(function(div) {
            if (div === slide)
                $(div).slideDown();
            else
                $(div).slideUp();
        });
    }//======================================================================//
    
    
    // change background based on condition & temperature
    //-----------------------------------------------------------------------\\
    function loadBackground() {
        var scene;
        if (['Fog', 'Mist', 'Haze'].indexOf(condition) > -1) {
            scene = background.mist[randomize(4)];
        }
        else if (['Rain', 'Thunderstorm'].indexOf(condition) > -1) {
            scene = background.rain[randomize(4)];
        }
        else {
            switch (true) {
                case (cTemp > 33):
                    scene = background.scorching[randomize(4)];
                    break;
                case (cTemp > 25):
                    scene = background.hot[randomize(4)];
                    break;
                case (cTemp > 17):
                    scene = background.warm[randomize(4)];
                    break;
                case (cTemp > 5):
                    scene = background.cool[randomize(4)];
                    break;
                case (cTemp <= 5):
                    scene = background.cold[randomize(4)];
                    break;
            }
        }
        var prefix = 'https://dl.dropboxusercontent.com/s/',
            url    = 'url("' + prefix + scene + '")';

        $('body').css({
            'background': url,
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
        });
    }//======================================================================//

    
    // assign geo coordinates from API call
    //-----------------------------------------------------------------------\\
    function setLocation(data) {
        console.log("address data:", data.results[0]);
        try {
            address   = data.results[0].formatted_address;
            latitude  = data.results[0].geometry.location.lat;
            longitude = data.results[0].geometry.location.lng;
            $('#loc').text(address);
        }
        // handle exception if unreadable address input
        catch(e) {
            console.log('ERROR:\n', e);
            // reset address on error
            address = null;
            displayPartition('#error_div');
        }
    }//======================================================================//
    
    
    // assign weather variables from API call
    //-----------------------------------------------------------------------\\
    function setWeather(data) {
        console.log("weather data:", data);
        icon      = data.weather[0].icon;
        cTemp     = data.main.temp - 273.15; // minus Kelvin difference
        condition = data.weather[0].description;
        windDir   = data.wind.deg;
        windMS    = data.wind.speed;
        $('#cond').text('Current Condition: ' + titleCase(condition));
        $('#icon').attr('src', symbolize(icon));
    }//======================================================================//
    
    
    // make weather API call
    //-----------------------------------------------------------------------\\
    function queryWeather() {
        if (address === null) { return; }
        var source = (
            'https://cors-anywhere.herokuapp.com/' +
            'http://api.openweathermap.org/data/2.5/weather?lat=' +
            latitude +
            '&lon=' +
            longitude +
            '&APPID=' +
            weatherKey
        );
        
        $.ajax({
            dataType : 'json',
            url      : source,
            success  :
                function (data) {
                    setWeather(data);
                    convertTemp();
                    convertVelo();
                    loadBackground();
                    displayPartition('#result_div');
                },
            error    :
                function (xhr, status, error) {
                   alert('ERROR:\n', xhr, status, error);
                }
        });
    }//======================================================================//
    
    
    // make location API call
    //-----------------------------------------------------------------------\\
    function queryLocation() {
        var term   = $('#search').val(),
            source = (
                'https://maps.googleapis.com/maps/api/geocode/json' +
                '?address=' +
                term +
                '&key=' +
                locationKey
            );
        
        $.ajax({
            dataType : 'json',
            url      : source,
            success  :
                function (data) {
                    setLocation(data);
                    queryWeather();
                },
            error    :
                function (data) {
                   alert('ERROR:\n', data);
                }
        });
    }//======================================================================//
    
    
    // hide all containers on load
    //-----------------------------------------------------------------------\\
    $('#result_div').hide();
    $('#info_div').hide();
    $('#error_div').hide();
   //====================================================================//
    
    
    // handle selections
    //-----------------------------------------------------------------------\\
    $('#submit').click(queryLocation);
    $('#show_info').click(displayPartition.bind(null, '#info_div'));
    $('#hide_info').click(displayPartition.bind(null, '#result_div'));
    $('#search').keyup(function (event) {
        if (event.keyCode === 13) { // "Enter" key
            $("#submit").click();
        }
    });
    $('#scale input').on('change', function () {
        system = $('input[name="units"]:checked', '#scale').val();
        convertTemp();
        convertVelo();
    });//====================================================================//
});
////////////////////////////////-- FILE END --\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\