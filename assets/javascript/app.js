
//Initialize Firebase

// Initialize Firebase
var config = {
apiKey: "AIzaSyDJqkYKGXoK64qNt7D1CwMPCaC2xiEFk9o",
authDomain: "trainschedule-cd40d.firebaseapp.com",
databaseURL: "https://trainschedule-cd40d.firebaseio.com",
projectId: "trainschedule-cd40d",
storageBucket: "",
messagingSenderId: "197604666247"
};
firebase.initializeApp(config);

var database = firebase.database();

function inputTrain(){
    event.preventDefault();
    var name = $("#input-name").val().trim();
    var dest = $("#input-dest").val().trim();
    var freq = $("#input-freq").val().trim();
    var start = $("#input-start").val().trim();

    //Validate input
    if( !name || !dest || !freq || !start){
        //update user not valid input
        alert("Fill in all fields");
        return;
    }
    //validate start time
    if ( start.length != 5){
        //too long reject
        alert("Start time must be of form HH:mm");
        return;
    }

    //If input good push to firebase
    var newTrain = {
        name: name,
        dest: dest,
        freq: freq,
        start: start
    }
    database.ref().push(newTrain);
    $("#input-name").val("");
    $("#input-dest").val("");
    $("#input-freq").val("");
    $("#input-start").val("");

}

$("#addTrain").on("click", inputTrain);

//update html table
database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var name = childSnapshot.val().name;
    var dest = childSnapshot.val().dest;
    var freq = childSnapshot.val().freq;
    var start = childSnapshot.val().start;
  
  
    // Prettify the employee start
    var startMoment = moment(start, "HH:mm");//.format("HH:mm");
    var diffTime = moment().diff(moment(startMoment), "minutes");
    // console.log("diff min: " + diffTime);
    var tRemainder = Math.abs(diffTime) % freq;
    // console.log("reminder: " + tRemainder);
    var minTilTrain = freq - tRemainder;
    // console.log(minTilTrain);
    //add minTilTrain to current Time
    var nextTrain = moment().add(minTilTrain, 'minutes').format("HH:mm");

  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(name),
      $("<td>").text(dest),
      $("<td>").text(freq),
      $("<td>").text(nextTrain),
      $("<td>").text(minTilTrain),
    );
  
    // Append the new row to the table
    $("#data-table > tbody").append(newRow);
  });