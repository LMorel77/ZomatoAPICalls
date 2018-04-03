$(document).ready(function () {

    var apiKey = 'ef5b1abf524ce5d1f47b5b0f797a9d72';
    var citySearchURL = "https://developers.zomato.com/api/v2.1/cities";
    var cuisineSearchURL = "https://developers.zomato.com/api/v2.1/cuisines";
    var searchURL = "https://developers.zomato.com/api/v2.1/search";
    var apiData;
    var cuisine;
    var cuisineId;
    var city;
    var cityId;

    $(document).on("click", ".api-call", function (event) {

        event.preventDefault();

        $("#hits").empty();

        city = $("#city-input").val().trim().replace(/\s+/g, ''); // Remove ALL spaces
        cuisine = $("#cuisine-input").val().trim().replace(/\s+/g, ''); // remove ALL spaces

        console.log("city: " + city);
        console.log("cuisine: " + cuisine);

        $.ajax({
            type: "GET",
            headers: {
                'X-Zomato-API-Key': apiKey //only allowed non-standard header
            },
            url: citySearchURL,
            dataType: 'json',
            data: {
                q: city
            },
            processData: true, // Converts data to query string
            success: function (data) {

                console.log("City apiData: ", data);

                if (data.location_suggestions.length === 0) {

                    $("#hits").html("<p>Unable to locate specified city name. Please check your spelling and try again.</p>");
                    return;

                }
                else {

                    apiData = data;

                    for (let i = 0; i < data.location_suggestions.length; i++) {

                        var button = $("<button>");
                        button.text(data.location_suggestions[i].name);
                        button.attr('id', i);
                        button.attr('class', 'buttons cities');
                        $("#hits").append(button);

                    }

                }
            }
        })
    });

    $(document).on("click", ".cities", function (event) {

        event.preventDefault();

        var index = $(this).attr('id');
        cityId = apiData.location_suggestions[index].id;

        console.log("index: " + index);
        console.log("cityId: ", cityId);

        $.ajax({
            type: "GET",
            headers: {
                'X-Zomato-API-Key': apiKey //only allowed non-standard header
            },
            url: cuisineSearchURL,
            dataType: 'json',
            data: {
                city_id: cityId
            },
            processData: true, // Converts data to query string
            success: function (data) {

                console.log("Cuisine apiData: ", data);

                if (data.cuisines.length === 0) {

                    $("#hits").html("<p>Unable to locate restaurants serving " + cuisine + ". Please check your spelling and try again, or try a different cuisine and/or city.</p>");
                    return;

                }
                else {

                    var userCuisine = cuisine.toLowerCase();
                    var apiCuisine;

                    for (let i = 0; i < data.cuisines.length; i++) {

                        apiCuisine = (data.cuisines[i].cuisine.cuisine_name).toLowerCase();

                        if (apiCuisine === userCuisine) {

                            cuisineId = (data.cuisines[i].cuisine.cuisine_id).toString();
                            i = data.cuisines.length;
                            console.log("cuisineId: ", cuisineId);

                        }

                    }

                    $.ajax({
                        type: "GET",
                        headers: {
                            'X-Zomato-API-Key': apiKey //only allowed non-standard header
                        },
                        url: searchURL,
                        dataType: 'json',
                        data: {
                            cuisines: cuisineId,
                            entity_id: cityId,
                            entity_type: 'city'
                        },
                        processData: true, // Converts data to query string
                        success: function (data) {

                            console.log("Search apiData: ", data);

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
                }
            }
        });
    });
});
