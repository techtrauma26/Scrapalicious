
$("#scrape").on("click", function() {
  $.ajax({
      method: "GET",
      url: "/scrape",
  }).done(function(data) {
      $(location).attr("href","/");
  })
});

$(".save").on("click", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/articles/save/" + thisId
  }).done(function(data) {
      $(location).attr("href","/");
  })
});

$(".delete").on("click", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/articles/delete/" + thisId
  }).done(function(data) {
      $(location).attr("href","/");
  })
});

$(".deleteNote").on("click", function() {
  var noteId = $(this).attr("data-note-id");
    $.ajax({
        method: "GET",
        url: "/notes/delete/" + noteId
    }).done(function(data) {    
        $(".modalNote").modal("hide");
        $(location).attr("href","/saved");
    })
  });

$(".saveNote").on("click", function(event) {
  event.preventDefault();
  var note = {};
  id = $(this).attr("data-id");
  note.body =$("#noteText").val().trim();
  if (!$("#noteText").val()) {
      alert("Opps! Please add your comments to save the note.")
  }else {
    $.post("/notes/save/" + id,  { body: note.body}).then(function(data) {
            $("#noteText").val("");
            $(".modalNote").modal("hide");
            $(location).attr("href","/saved");
        });
      }    
});

