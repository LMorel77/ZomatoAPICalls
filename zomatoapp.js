$(document).ready(function () {

    var apiKey = 'ef5b1abf524ce5d1f47b5b0f797a9d72';
    var citySearchURL = "https://developers.zomato.com/api/v2.1/cities";
    var searchURL = "https://developers.zomato.com/api/v2.1/search";
    var searchData;

    $(document).on("click", ".api-call", function (event) {

        event.preventDefault();

        $("#hits").empty();

        var userCity = $("#city-input").val().trim().replace(/\s+/g, ''); // Remove ALL spaces

        $.ajax({
            type: "GET",
            headers: {
                'X-Zomato-API-Key': apiKey //only allowed non-standard header
            },
            url: citySearchURL,
            dataType: 'json',
            data: {
                // Could also go in URL, but this is easier to edit
                q: userCity,
            },
            processData: true, // data is an object..tells jQuery to construct URL params
            success: function (data) {

                console.log(data);

                if (data.location_suggestions.length === 0) {
                    $("#hits").html("<p>Unable to locate specified city name. Please check your spelling and try again.</p>");
                    return;
                }
                else {

                    searchData = data;

                    for (let i = 0; i < data.location_suggestions.length; i++) {

                        var button = $("<button>");
                        button.text(data.location_suggestions[i].name);
                        button.attr('id', i);
                        button.attr('class', 'buttons cities');
                        $("#hits").append(button);
                    }
                }
            }
        });

        $(document).on("click", ".cities", function (event) {

            event.preventDefault();

            var index = $(this).attr('id');
            var userCityId = searchData.location_suggestions[index].id;
            var cuisine = $("#cuisine-input").val().trim().replace(/\s+/g, ''); // remove ALL spaces

            $.ajax({
                type: "GET",
                headers: {
                    'X-Zomato-API-Key': apiKey //only allowed non-standard header
                },
                url: searchURL,
                dataType: 'json',
                data: {
                    // Could also go in URL, but this is easier to edit
                    q: cuisine,
                    city_id: userCityId,
                },
                processData: true, // data is an object..tells jQuery to construct URL params
                success: function (data) {

                    console.log(data);

                    $("#hits").empty();

                    if (data.restaurants.length === 0) {
                        $("#hits").html("<p>Unable to locate restaurants serving " + cuisine + ". Please check your spelling and try again, or try a different cuisine and/or city.</p>");
                        return;
                    }
                    else {

                        for (let i = 0; i < data.restaurants.length; i++) {

                            var anchor = $("<a>");
                            var button = $("<button>");
                            var url = data.restaurants[i].restaurant.url;

                            anchor.attr("href", url).attr("target", "_blank").attr("alt", "Venue Option");
                            anchor.append(button);
                            button.text(data.restaurants[i].restaurant.name);
                            button.attr('id', i).attr('class', 'buttons venues');

                            $("#hits").append(anchor);
                        }
                    }
                }
            });

        });

    });

});