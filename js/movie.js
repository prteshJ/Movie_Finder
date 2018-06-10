$(document).ready(() => {

    // Learning from online tutorials to follow this pattern

    $('body').addClass('meta');

    // JS logic here
    $('#searchContainer').hide();

    $('#btn-search').on('click', openSearch);
    $('#btn-search-close').on('click', closeSearch);

    function openSearch() {
        $('#mainContainer').addClass('main-wrap--hide');
        $('#searchContainer').show();
        $('#searchContainer').addClass('search--open');
        // ESC behavior
        $('#searchContainer').on('keyup', function(e) {
            if (e.keyCode == 27) {
                closeSearch();
            }
        });
        setTimeout(function() {
            $('#inputSearch').focus();
        }, 500);
    }

    function closeSearch() {
        $('#mainContainer').removeClass('main-wrap--hide');
        $('#searchContainer').removeClass('search--open');
        $('#inputSearch').blur();
        $('#inputSearch').val('');
    }

    $('input').on('keypress', function(e) {
        // Handle ENTER key
        if (e.keyCode == 13) {
            let movie = '';
            // Prevent default behavior and handle it here
            e.preventDefault();

            // Save entered query
            movie = this.value;

            if (movie.val != '') {
                updateMovieDetails(movie);
            }

            // Close the search view
            closeSearch();
        }
    });

    function updateMovieDetails(movieQuery) {
        let title, year, movieUrl, apiKey;
        // my API key
        apiKey = '375079d2';

        // Using IMDB Id
        // http://www.omdbapi.com/?apikey=375079d2&i=tt3896198

        // Using Movie Title
        // http://www.omdbapi.com/?apikey=375079d2&t=Padman

        // Using Movie Title and Year
        // http://www.omdbapi.com/?apikey=375079d2&t=Sholay&y=1975

        if (idEntered(movieQuery)) {
            movieUrl = 'http://www.omdbapi.com/?apikey=' + apiKey + '&i=' + movieQuery;
        } else {
            if (titleEntered(movieQuery)) {
                movieUrl = 'http://www.omdbapi.com/?apikey=' + apiKey + '&t=' + movieQuery;
            }
        }

        if (movieQuery.indexOf(',') > -1) {
            let movieDetails = movieQuery.split(',');
            console.log(movieDetails[0]);
            title = movieDetails[0],
                year = movieDetails[1];
            movieUrl = 'http://www.omdbapi.com/?apikey=' + apiKey + '&t=' + title + '&y=' + year;
        }

        // Replace all spaces by '+' as the API does
        movieUrl = $.trim(movieUrl).replace(/\s/g, "+");


        // API call to get movie details
        $.ajax({
            type: 'GET',
            dataType: 'json',
            async: true,
            url: movieUrl,
            success: (response) => {
                console.log(movieUrl);

                // Now reveal the movie card
                $('#movieCard').css('display', 'flex');

                if (response.Response == "True") {
                    console.log(response);
                    // Remove all non numeric characters from time string
                    let durationData = response.Runtime.replace(/[^\d]/g, '');

                    // Get movie details and set it here
                    $('.card .wavy').show();
                    $('.card .center').show();
                    $('.movie_image').show();
                    $('#movieTitle').text(response.Title);
                    $('#movieDuration').text(calculateDuration(durationData));
                    $('#movieYear').text(response.Year);
                    $('#genre').text(response.Genre);
                    $('#shortDesc').text(response.Plot);

                    if (!(response.Poster == "N/A")) {
                        console.log(response.Poster);
                        $('#poster').attr('src', response.Poster);
                        $('#bgPoster').attr('src', response.Poster);
                    } else {
                        $('#poster').attr('src', 'images/error.png');
                    }
                } else {
                    // If API call cannot be performed successfully
                    errorMsg();
                    console.log(response.Error);
                }
            }
        }); // end Ajax call
    };

    // Function that updates card in case an error occured
    function errorMsg() {
        $('.card .center').hide();
        $('.card .way').hide();
        $('.card .wavy').hide();
        $('#poster').attr('src', 'images/error.png');
        $('#bgPoster').attr('src', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqC5V6hERGw9hoHjUhYDDkuKww1PRNCJCMpHznJ2ISakA2a8G3');
    }

    // Returns true if imdb id was entered
    function idEntered(movieQuery) {
        if (movieQuery.startsWith('tt') && $.isNumeric(movieQuery.slice(-1))) {
            return true;
        }
        return false;
    }

    // Returns true if movie title was entered
    function titleEntered(movieQuery) {
        if (movieQuery.length > 0) {
            return true;
        }
        return false;
    }

    // Converts minutes to hours and minutes format
    function calculateDuration(time) {
        let minutes = time % 60;
        let hour = (time - minutes) / 60;
        return hour + 'h ' + minutes + 'min';
    };

});