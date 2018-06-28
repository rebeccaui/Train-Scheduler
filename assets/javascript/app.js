$(document).ready(function(){

//Initialize Firebase
var config = {
    apiKey: "AIzaSyCD3aQ75i4tST5ItGY5HkXMyjZCCo-5GMw",
    authDomain: "timesheet-2046d.firebaseapp.com",
    databaseURL: "https://timesheet-2046d.firebaseio.com",
    projectId: "timesheet-2046d",
    storageBucket: "timesheet-2046d.appspot.com",
    messagingSenderId: "325187755676"
  };
  firebase.initializeApp(config);

//Variables - Database 
var database = firebase.database();
var trainDB = database.ref("/trains");
//Variables - User Input
var trainName = ""; 
var trainDest = "";
var trainTime = "";
var trainFreq = "";
//Variable to hold all children added to the database for a single train
var trainFacts = "";
//Variables - moment() and manipulated 
var currentTime = moment();
var nextArrival = "";  //Arrival time of the next train, displays in table (column 4), determined by trainFreq and currentTime
var nextArrivalConverted = "";
var trainMins = "";  //Decrementing number of minutes until the next train, displayed in table (column 5), determined by trainFreq, initial difference, and remainder  
var difference = ""; //The difference between the currentTime and trainTime, not displayed 
var trainTimeConverted = ""; //
var remainder = ""; //The remainder from which we find the remaining trainMins until nextArrival

    //Add Train event
    $("#addTrain").click(function(event){
        event.preventDefault();
        //Set variables to the value of what the user types in
        trainName = $("#userTrain").val().trim();
        trainDest = $("#userDest").val().trim();
        trainTime = moment($("#userTime").val().trim(), "HH:mm").format("X");
        trainFreq = $("#userFreq").val().trim();    

    if(trainName != "" && trainDest != "" && trainTime != "" && trainFreq != "") {
        console.log("Train Name: " + trainName);
        console.log("Train Destination: " + trainDest);
        console.log("Train Frequency: " + trainFreq + " mins");
        console.log("Starting Train Time: " + trainTime);
        console.log("Next Arrival: " + nextArrival);

        //Change the input values back to an empty string
        $("#userTrain").val("");
        $("#userDest").val("");
        $("#userTime").val("");
        $("#userFreq").val("");
        $("#trainMins").val("");

        //Push user input variables and moment() to database
        currentTime = moment().format("X");
        trainDB.push({
            trainName,
            trainDest,
            trainTime,
            trainFreq,
            currentTime
        });
    } else {
        return false;
      }
    });

    trainDB.on("child_added", function(childSnapshot){
        trainFacts = childSnapshot.val();
            trainName = trainFacts.trainName;   //required for display
            trainDest = trainFacts.trainDest;   //required for display
            trainTime = trainFacts.trainTime;
            trainTimeConverted = moment.unix(trainFacts.trainTime);
            //The full difference of trainTime and currentTime
            difference = moment().diff(moment(trainTimeConverted, "HH:mm"), "minutes");
            trainFreq = trainFacts.trainFreq;   //required for display
            //The difference is divided by the trainFreq to determine when each nextArrival occurs, then finding the remainder
            remainder = difference % parseInt(trainFacts.trainFreq);
            //Minutes Away until nextArrival will be trainFreq minus the remainder
            trainMins = parseInt(trainFacts.trainFreq) - remainder;  //required for display
            
            //nextArrival = trainFacts.nextArrival;
            //nextArrivalConverted = nextArrivalConverted;   //required for display


            //Convert the trainTime to a certain format and subtract a year
            //trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
            
            //Convert the nextArrival time to the standard format
            //nextArrivalConverted = moment(nextArrival).format("HH:mm");
            
            if(difference > 0) {
            //The nextArrival will be equal to the currentTime plus the trainMins
            nextArrival = moment().add(trainMins, "minutes").format("hh:mm A");
            } else {
                nextArrival = trainTimeConverted.format("hh:mm A");
                trainMins = Math.abs(difference - 1);
            }
            
            var newTrain = $("<tr>").addClass("train");
            newTrain.append(
                $("<td>").text(trainFacts.trainName),
                $("<td>").text(trainFacts.trainDest),
                $("<td>").addClass("freq").text(trainFacts.trainFreq),
                $("<td>").addClass("nextArrival").text(nextArrival),
                $("<td>").addClass("minsAway").text(trainMins)
            );
            $("#trainTable").append(newTrain);
    });
});


/* (".table").attr("sortable");

//Insert search bar for table
/* var allRows = $("tr");
$("input#search").on("keydown keyup", function() {
  allRows.hide();
  $("tr:contains('" + $(this).val() + "')").show();
}); 

// .checkvalidity() returns T/F  .reportvalidity() tells user */
