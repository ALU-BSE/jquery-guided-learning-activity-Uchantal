$(document).ready(function () {
  // Add a loader spinner (jQuery DOM manipulation)
  if (!$('#loader').length) {
    $('body').append('<div id="loader" style="display:none;"></div>');
    $('#loader').css({
      position: 'fixed', left: '50%', top: '30%', 'z-index': 1000,
      width: '40px', height: '40px', 'border-radius': '50%',
      border: '6px solid #ccc', 'border-top': '6px solid #3498db',
      animation: 'spin 5s linear infinite'
    });
    // Add keyframes for spin (CSS injection)
    var style = $('<style>@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}</style>');
    $('html > head').append(style);
  }

  // Main search function (AJAX, selectors, chaining)
  function searchBooks() {
    const keyword = $("#searchInput").val().toLowerCase(); // jQuery selector
    $("#results").empty(); // jQuery selector & method
    $.ajax({
      url: "books.json",
      method: "GET",
      dataType: 'json',
      beforeSend: function () {
        $("#loader").fadeIn(200); // Effect: fadeIn
      },
      success: function (data) {
        // Array filter, then jQuery DOM manipulation
        const filteredBooks = data.filter(book =>
          book.title.toLowerCase().includes(keyword) ||
          book.author.toLowerCase().includes(keyword)
        );
        if (filteredBooks.length === 0) {
          // Chained effects: hide, then fadeIn
          $("#results").html("<p>No books found.</p>").hide().fadeIn(400);
        } else {
          filteredBooks.forEach(book => {
            // jQuery: append book result
            const bookHtml = `
              <div class=\"book\" style=\"display:none;cursor:pointer;\">
                <strong>${book.title}</strong> by ${book.author}
                <div class=\"description\" style=\"display:none;\">${book.description}</div>
              </div>
            `;
            $("#results").append(bookHtml);
          });
          // Chained effect: fadeIn each book with delay
          $(".book").each(function(i){
            $(this).delay(100*i).fadeIn(300); // Chaining
          });
        }
        // Advanced chaining: fadeOut and slideUp search input
        $("#searchInput").fadeOut(400).delay(200).slideUp(200);
      },
      complete: function () {
        $("#loader").fadeOut(200); // Effect: fadeOut
      },
      error: function () {
        $("#results").html("<p>Error fetching book data.</p>");
      }
    });
  }

  // Event: search on button click
  $("#searchBtn").click(searchBooks);
  // Event: search on Enter key
  $("#searchInput").on('keypress', function(e){
    if(e.which === 13) searchBooks();
  });

  // Event: hover effects (mouseenter/mouseleave)
  $("#results").on("mouseenter", ".book", function () {
    $(this).stop().animate({backgroundColor: "#e6f7ff"}, 200); // Effect: animate
  }).on("mouseleave", ".book", function () {
    $(this).stop().animate({backgroundColor: "#fff"}, 200);
  });

  // Toggle description on click with chained animation (slideDown + fadeIn, stays visible until clicked again)
  $("#results").on("click", ".book", function () {
    var desc = $(this).find(".description");
    if (desc.is(":visible")) {
      desc.stop(true, true).slideUp(300);
    } else {
      desc.stop(true, true).slideDown(300).fadeIn(200);
    }
  });
});