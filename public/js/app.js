$(document).ready(() => {

  $(document).on('click', '#scrape-btn', (event) =>{
    event.preventDefault();
    console.log('clicked');
    window.location = '/scrape';
  });

  $(document).on('click', '#articles-btn', (event) =>{
    event.preventDefault();
    console.log('clicked');
    window.location = "/articles";
  });

  $(document).on('click', '.save-article', function(event){
    event.preventDefault();
    let parentItem = $(this).parent();
    let title = parentItem.children('td.table-item').text();
    let link = parentItem.children('td.table-link').children('a').attr('href');
    articleData = {
      title: title,
      link: link
    };
    console.log(articleData);
    $.ajax({
      method: "POST",
      url: '/save/article',
      data: {article: articleData}
    })
  });

  $(document).on('click', '.table-item', function(event){
    event.preventDefault();
    let id = $(this).parent().data('id');
    console.log(id);
    $('#fake-background').css('display', 'initial');
    $('#center-box').fadeIn('slow');
    $("#create-note").attr('data-id', id);
  });

  // When you click the savenote button
  $(document).on("submit", "#create-note", function(event){
    event.preventDefault();
    // Grab the id associated with the article from the submit button
    let thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#note-title").val().trim(),
        // Value taken from note textarea
        body: $("#note-body").val().trim()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#fake-background").css('display', 'none');
        $('#center-box').fadeOut();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#note-title").val("");
    $("#note-body").val("");
  });

  // Grab the articles as a json
  $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });


  // Whenever someone clicks a p tag
  $(document).on("click", ".view-notes", function () {
    let thisId = $(this).parent().attr("data-id");
    console.log(thisId);
    $("#notes-box").empty();
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        $('#fake-background2').css('display', 'initial');
        $('#notes-box').fadeIn('slow');
        console.log(data);
        // The title of the article
        $("#notes-box").append("<h2 class='header'>" + data.title + "</h2>");

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          data.note.forEach(element => {
            let note = $('<div>').addClass('row').append(
              $('<div>').addClass('col s12').append(
                $('<div>').addClass("card yellow darken-1 center-align").append(
                  $('<span>').addClass("card-title").text(element.title)).append($('<p>').text(element.body))
                ));
            console.log(element);
            $("#notes-box").append(note);
          });
          // Place the body of the note in the body textarea
        }
      });
  });

  $(document).mouseup(function (e) {
    let notesBox = $("#notes-box");
    let centerBox = $("#center-box");
    console.log(centerBox.css('display') !== 'none');
    console.log(notesBox.css('display') !== 'none');

    if(!centerBox.is(e.target) && centerBox.has(e.target).length === 0){
      if(centerBox.css('display') !== 'none'){
        $("#fake-background").css('display', 'none');
        $('#center-box').fadeOut();
      }
    }
    
      if(!notesBox.is(e.target) && notesBox.has(e.target).length === 0){
        console.log('clicked out of notesBox');
        if(notesBox.css('display') !== 'none'){
          $('#notes-box').fadeOut();
          $("#fake-background2").css('display', 'none');
      }
    }
  });


})
