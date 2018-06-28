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

//Variables 
var database = firebase.database();
var trainDB = database.ref("/trains");
var trainName = "";
var trainDest = "";
var trainTime = "";
var trainFreq = "";
var trainFacts = "";

var currentTime = moment();
var nextArrival = "";  //arrival time of nextTrain - trainFreq - difference%trainFreq loop?
var trainMins = "";  //Displayed/Decremented Number of minutes til next train. 
            //Starts from difference 
var difference = ""; //Equivalent to trainFreq, 
var trainTimeConverted = "";
var remainder = "";

//var trainMins = "..." //moment(). trainTime + trainFreq

    //Add Train event
    $("#addTrain").click(function(event){
        event.preventDefault();
        //Set variables to the value of what the user types in
        trainName = $("#userTrain").val().trim();
        trainDest = $("#userDest").val().trim();
        trainTime = $("#userTime").val().trim();
        trainFreq = parseInt($("#userFreq").val().trim());    
        
        console.log("Train Name: " + trainName);
        console.log("Train Destination: " + trainDest);
        console.log("Starting Train Time: " + trainTime);
        console.log("Train Frequency: " + trainFreq + " mins");
       
       
     /*    //for (i = 0; i = trainFreq.val(); i--){
            if (difference === 0){

                $("#minsAway").text(trainFreq); //maybe wrong
                //Find the time of the next train
                nextTrain = currentTime.subtract(difference);
            }
        }
            
        var currentTime = moment();
    
        //arrival time of nextTrain - trainFreq - difference%trainFreq loop?
        var trainMins = "";  //Displayed/Decremented Number of minutes til next train. 
                //Starts from difference 
        var difference = ""; //Equivalent to trainFreq[i]
        //var trainMins = "..." //moment(). trainTime + trainFreq    */

        //Push user data to database
        trainDB.push({
            trainName,
            trainDest,
            trainTime,
            trainFreq
            //trainMins
        });

        //Change the input values back to an empty string
        $("#userTrain").val("");
        $("#userDest").val("");
        $("#userTime").val("");
        $("#userFreq").val("");

    
    });

    trainDB.on("child_added", function(childSnapshot){
        trainFacts = childSnapshot.val();
            trainName = trainFacts.trainName;
            trainDest = trainFacts.trainDest;
            trainTime = trainFacts.trainTime;
            trainFreq = trainFacts.trainFreq;

            //The difference of trainTime and currentTime
       difference = moment().diff(moment(trainTime), "minutes");
       
       trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
       //The remainder is the difference divided by the trainFreq
       remainder = difference % trainFreq;
       //Minutes Away will be the trainFreq minus the remainder
       trainMins = trainFreq - remainder;

            var newTrain = $("<tr>").addClass("train");
            newTrain.append(
                $("<td>").text(trainName),
                $("<td>").text(trainDest),
                $("<td>").addClass("freq").text(trainFreq),
                $("<td>").addClass("nextArrival").text(trainMins)
            );
            $("#trainTable").append(newTrain);
            console.log("Difference: " + difference);
            console.log(trainTimeConverted);
            console.log("Minutes Away (decrementing): " + trainMins);


    });

});


//(".table").attr("sortable");

//Insert search bar for table
/* var allRows = $("tr");
$("input#search").on("keydown keyup", function() {
  allRows.hide();
  $("tr:contains('" + $(this).val() + "')").show();
}); */

// .checkvalidity() returns T/F  .reportvalidity() tells user

//Set trainTime 