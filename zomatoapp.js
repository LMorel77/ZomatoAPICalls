$(document).ready(function () {

    var apiKey = 'ef5b1abf524ce5d1f47b5b0f797a9d72';
    var citySearchURL = "https://developers.zomato.com/api/v2.1/cities";
    var searchURL = "https://developers.zomato.com/api/v2.1/search";
    var searchData;

    $(document).on("click", ".api-call", function (event) {

        event.preventDefault();

        $("#hits").empty();

        var userCity = $("#city-input").val().trim().replace(/\s+/g, ''); // Remove ALL spaces

        console.log("var userCity = ", userCity);

        $.ajax({
            type: "GET", //it's a GET request API
            headers: {
                'X-Zomato-API-Key': apiKey //only allowed non-standard header
            },
            // async: false,
            url: citySearchURL, //what do you want
            dataType: 'json', //wanted response data type - let jQuery handle the rest...
            data: {
                //could be directly in URL, but this is more pretty, clear and easier to edit
                q: userCity,
            },
            processData: true, //data is an object => tells jQuery to construct URL params from it
            success: function (data) {

                console.log(data);
                searchData = data;

                for (let i = 0; i < data.location_suggestions.length; i++) {

                    var button = $("<button>");
                    button.text(data.location_suggestions[i].name);
                    button.attr('id', i);
                    button.attr('class', 'buttons');
                    $("#hits").append(button);
                }
            }
        });

        $(document).on("click", ".buttons", function (event) {

            event.preventDefault();

            var index = $(this).attr('id');
            console.log("var index = ", index);
            var userCityId = searchData.location_suggestions[index].id;
            var cuisine = $("#cuisine-input").val().trim().replace(/\s+/g, ''); // remove ALL spaces
            console.log("var userCityId = ", userCityId);
            console.log("var cuisine = ", cuisine);

            $.ajax({
                type: "GET", //it's a GET request API
                headers: {
                    'X-Zomato-API-Key': apiKey //only allowed non-standard header
                },
                url: searchURL, //what do you want
                dataType: 'json', //wanted response data type - let jQuery handle the rest...
                data: {
                    //could be directly in URL, but this is more pretty, clear and easier to edit
                    q: cuisine,  /////CHANGE THIS PART
                    city_id: userCityId,
                },
                processData: true, //data is an object => tells jQuery to construct URL params from it
                success: function (data) {

                    console.log(data);

                    $("#hits").empty();

                    for (let i = 0; i < data.restaurants.length; i++) {

                        var button = $("<button>");

                        button.text(data.restaurants[i].restaurant.name);
                        button.attr('id', 'rest-' + i);
                        button.attr('class', 'venues');
                        $("#hits").append(button);
                    }
                }
            });

        });
    });





});