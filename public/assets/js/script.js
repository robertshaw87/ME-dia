$(document).ready(function () {
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 3,
                nav: false
            },
            1000: {
                items: 5,
                nav: true,
                loop: false
            }
        }
    })
    var genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "Thriller", "War", "Western"]

    for (i = 0; i < genres.length; i++) {
        $("#genre-choices").append(`<div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="genre ${i + 1}" value="${genres[i]}">
        <label class="form-check-label" for="inlineCheckbox1">${genres[i]}</label>
    </div>`)
    }
    $("#submit").on("click", function (event) {
        event.preventDefault();
        var history = {
            name: $("#media-name").val().trim(),
            type: $("#media-type").val().trim()
        }
        var genreSelected = [];
        $(".form-check-input:checked").each(function (){
            genreSelected.push($(this).val())
            
        })
        console.log(genreSelected);
    });
});

