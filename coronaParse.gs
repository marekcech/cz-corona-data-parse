var APP = SpreadsheetApp;

/* simple and stupid parse function for apify data source for corona virus testing in czech 
*  available here https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true 
*  created as part of cesko.digital initiative */

/** simple function takes the source and put it in sheet in rather formated way **/
function parseCorona() {
  
  // get the api endpoint and fetch data
  //    var options = { headers : { Authorization: "Basic " + key }}
  var options = { headers : {}};
  var url = "https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true"; 
  var json = UrlFetchApp.fetch(url, options).getContentText(); 
  
  // Logger.log(json);
  // parse the json return
  var data = JSON.parse(json);
  
  // get the current sheet
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var ss = doc.getSheetByName("Sheet1");
  ss.clear();
    
 // APP.flush();
  Utilities.sleep(500);
  var dataSheet = ss.getDataRange().getValues();
  // prepare the rows object
  var rows = [];
  // prepare headers
   rows.push(["date","tested cases", "positive tests", "infected daily"]);
  // preapare helper variable
  var positiveTests = "";
   var infectedDaily = "";
  var totalTestedCases = 0;
  var lastRow = ss.getLastRow()+1;
  
  // go through all the object, it assume same dates in both columns
  for (var v = 0; v < data.numberOfTestedGraph.length; v++) {
 
       var number = v+1;
    
   // get the data
    
    for (var p = 0; p < data.totalPositiveTests.length; p++) {
    
    if (data.numberOfTestedGraph[v] && data.totalPositiveTests[p].date == data.numberOfTestedGraph[v].date) {
      
      positiveTests = data.totalPositiveTests[p].value;
      break;
      
    } else {
      positiveTests = "no data";
    }
    
   
     }
    
        // infected daily
    for (var pt = 0; pt < data.infectedDaily.length; pt++) {
    
    if (data.numberOfTestedGraph[v] && data.infectedDaily[pt].date == data.numberOfTestedGraph[v].date) {
      
      infectedDaily = data.infectedDaily[pt].value;
      break;
      
    } else {
      infectedDaily = "no data";
    }
    
   
     }
    
     //  totalTestedCases += parseInt(data.numberOfTestedGraph[v].value,10);
    
    rows.push([data.numberOfTestedGraph[v].date, data.numberOfTestedGraph[v].value, positiveTests, infectedDaily]);
    //  (informationPassedObj[0] == undefined ) ? '' : informationPassedObj[0])
     }
           
           
  //check if there are data
  if(rows[0]) {         
               // write to the sheet
       var row = rows.length;
       var column = rows[0].length;
              
      ss.getRange(1,1, row, column).setValues(rows);
  }
    
    
    // reset the rows object
    
    rows = [];
    
    // prepare headers
    rows.push(["total tested","infected","recovered", "source Url","source update","apify update","help"]);
    
    // assign the sum from the source
    if (data.totalTested != null) {
      
      totalTestedCases = data.totalTested;
    }
    
    // push the general no data specific information
    rows.push([data.totalTested,data.infected,data.recovered,data.sourceUrl,data.lastUpdatedAtSource,data.lastUpdatedAtApify,data.readMe]);
    
    // write it to sheet
    var row = rows.length;
    var columnNew = rows[0].length;
    
    ss.getRange(1,5,row, columnNew).setValues(rows);
    
    rows = [];
    
    
    // prepare the regions sheets
    
    var sheetRegions = doc.getSheetByName("REGIONS");
  //  var dataRegions = doc.getDataRange().getValues();
  
//    sheetRegions.clear();
    
  APP.flush();
  Utilities.sleep(500);
    
    // go through all the regions
    
      
 rows.push(["date","region", "infected"]);
     
  for (var r=0; r < data.infectedByRegion.length; r++) {
      //  totalTestedCases += parseInt(data.numberOfTestedGraph[v].value,10);
      
      rows.push([data.lastUpdatedAtSource,data.infectedByRegion[r].region, data.infectedByRegion[r].value]);
  
       }
     
      //  (informationPassedObj[0] == undefined ) ? '' : informationPassedObj[0])
   
  
    if(rows[0]) { 
    // write to the sheet
    var row = rows.length;
    var column = rows[0].length;
  // var lastRow = sheetRegions.getLastRow()+1;
    
    sheetRegions.getRange(1,1, row, column).setValues(rows);
    }
  
  
    // prepare the ages sheet
    
  var sheetAges = doc.getSheetByName("AGES");
   rows = [];
  
  
  APP.flush();
  Utilities.sleep(500);
  
  // go through all the regions
  
  
  rows.push(["date","sex (muž = male, žena = female)", "age", "infected"]);
  
  
  for (var s=0; s < data.infectedByAgeSex.length; s++) {
  
  for (var r=0; r < data.infectedByAgeSex[0].infectedByAge.length; r++) {
      //  totalTestedCases += parseInt(data.numberOfTestedGraph[v].value,10);
      
      rows.push([data.lastUpdatedAtSource,data.infectedByAgeSex[s].sex,data.infectedByAgeSex[0].infectedByAge[r].age, data.infectedByAgeSex[0].infectedByAge[r].value]);
  
       }
     
    
  }
  
    if(rows[0]) { 
    // write to the sheet
    var row = rows.length;
    var column = rows[0].length;
  // var lastRow = sheetRegions.getLastRow()+1;
    
    sheetAges.getRange(1,1, row, column).setValues(rows);
    }
  
    // prepare the countries
    
  var sheetCountries = doc.getSheetByName("COUNTRIES");
   rows = [];
  
  
  APP.flush();
  Utilities.sleep(500);
  
  // go through all the countries
  
  
  rows.push(["date","country of infection", "infected"]);
  
  
 
  
  for (var r=0; r < data.countryOfInfection.length; r++) {
      //  totalTestedCases += parseInt(data.numberOfTestedGraph[v].value,10);
      
      rows.push([data.lastUpdatedAtSource,data.countryOfInfection[r].countryName,data.countryOfInfection[r].value]);
  
       }
     
    
  
 
    if(rows[0]) { 
    // write to the sheet
    var row = rows.length;
    var column = rows[0].length;
  // var lastRow = sheetRegions.getLastRow()+1;
    
    sheetCountries.getRange(1,1, row, column).setValues(rows);
    }
  }
  
/** incremental parse need lot of fix **/
function parseCoronaIncremental() {
  
  // get the api endpoint and fetch data
  //    var options = { headers : { Authorization: "Basic " + key }}
  var options = { headers : {}};
  var url = "https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true"; 
  var json = UrlFetchApp.fetch(url, options).getContentText(); 
  
  // Logger.log(json);
  // parse the json return
  var data = JSON.parse(json);
  
  // get the current sheet
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var ss = doc.getSheetByName("Sheet1");
  var dataSheet = ss.getDataRange().getValues();
  
  
  // prepare the rows object
  var rows = [];
  // prepare headers
  // rows.push(["date","tested cases", "positive tests"]);
  // preapare helper variable
  var positiveTests = "";
  var totalTestedCases = 0;
  var lastRow = ss.getLastRow()+1;
  
  // go through all the object, it assume same dates in both columns
  for (var v = 0; v < data.totalPositiveTests.length; v++) {
    var number = v+1;
    
    if (dataSheet[number]) {
      
      // console.log("compare" + data.numberOfTestedGraph[v].date + " with "  + dataSheet[number][0]);
      
      if (data.totalPositiveTests[v].date == dataSheet[number][0]) {
        
        continue;
      }
    }
    
    
    if (data.numberOfTestedGraph[v] && data.totalPositiveTests[v].date == data.numberOfTestedGraph[v].date) {
      
      positiveTests = data.numberOfTestedGraph[v].value;
      
    } else {
      positiveTests = "no data";
    }
    
    //  totalTestedCases += parseInt(data.numberOfTestedGraph[v].value,10);
    
    rows.push([data.totalPositiveTests[v].date, positiveTests, data.totalPositiveTests[v].value]);
    //  (informationPassedObj[0] == undefined ) ? '' : informationPassedObj[0])
     }
           
  //check if there are data
  if(rows[0]) {         
               // write to the sheet
       var row = rows.length;
       var column = rows[0].length;
              
      ss.getRange(lastRow,1, row, column).setValues(rows);
  }
    
    
    // reset the rows object
    
    rows = [];
    
    // prepare headers
    rows.push(["total tested","infected","recovered", "source Url","source update","apify update","help"]);
    
    // assign the sum from the source
    if (data.totalTested != null) {
      
      totalTestedCases = data.totalTested;
    }
    
    // push the general no data specific information
    rows.push([data.totalTested,data.infected,data.recovered,data.sourceUrl,data.lastUpdatedAtSource,data.lastUpdatedAtApify,data.readMe]);
    
    // write it to sheet
    var row = rows.length;
    var columnNew = rows[0].length;
    
    ss.getRange(1,4,row, columnNew).setValues(rows);
    
    rows = [];
    
    
    // prepare the regions sheets
    
    var sheetRegions = doc.getSheetByName("REGIONS");
    var dataRegions = doc.getDataRange().getValues();
    
    // go through all the regions
    
    for (var v = 1; v < dataRegions.length; v++) {
      var number = v;
      
      if (dataRegions[number]) {
        
        Logger.log("compare" + data.lastUpdatedAtSource + " with "  + dataRegions[number][0]);
        
        if (data.lastUpdatedAtSource == dataRegions[number][0]) {
          
          continue;
        }
      }
      
      for (var r in data.infectedByRegion) {
      //  totalTestedCases += parseInt(data.numberOfTestedGraph[v].value,10);
      
      rows.push([data.lastUpdatedAtSource,data.infectedByRegion[r].region, data.infectedByRegion[r].value]);
        var finished = true;
       }
      if (finished) {
        break;
      }
      //  (informationPassedObj[0] == undefined ) ? '' : informationPassedObj[0])
    }
  
    if(rows[0]) { 
    // write to the sheet
    var row = rows.length;
    var column = rows[0].length;
   var lastRow = sheetRegions.getLastRow()+1;
    
    sheetRegions.getRange(lastRow,1, row, column).setValues(rows);
    }
  }

/*** old function */
  function parseCoronaWrite() {
    
    // get the api endpoint and fetch data
    //    var options = { headers : { Authorization: "Basic " + key }}
    var options = { headers : {}};
    var url = "https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true"; 
    var json = UrlFetchApp.fetch(url, options).getContentText(); 
    
    // Logger.log(json);
    // parse the json return
    var data = JSON.parse(json);
    
    // get the current sheet
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var ss = doc.getActiveSheet();
    var dataSheet = ss.getDataRange().getValues();
    // prepare the rows object
    var rows = [];
    // prepare headers
    rows.push(["date","tested cases", "positive tests"]);
    // preapare helper variable
    var positiveTests = "";
    var totalTestedCases = 0;
    
    // go through all the object, it assume same dates in both columns
    for (var v in data.testedCases) {
      if (data.testedCases[v].date == dataSheet[v+1][0]) {
        continue;
      }
      if (data.testedCases[v].date == data.totalPositiveTests[v].date) {
        
        positiveTests = data.totalPositiveTests[v].value;
        
      } else {
        positiveTests = "no data";
      }
      totalTestedCases += parseInt(data.testedCases[v].value,10);
      rows.push([data.testedCases[v].date,data.testedCases[v].value, positiveTests]);
      
      
    }
    
    // write to the sheet
    var row = rows.length;
    var column = rows[0].length;
    
    ss.getRange(1,1, row, column).setValues(rows);
    
    // reset the rows object
    
    rows = [];
    
    // prepare headers
    rows.push(["total tested","infected","recovered", "source Url","source update","apify update","help"]);
    
    // assign the sum from the source
    if (data.totalTested != null) {
      
      totalTestedCases = data.totalTested;
    }
    
    // push the general no data specific information
    rows.push([totalTestedCases,data.infected,data.recovered,data.sourceUrl,data.lastUpdatedAtSource,data.lastUpdatedAtApify,data.readMe]);
    
    // write it to sheet
    row = rows.length;
    var columnNew = rows[0].length;
    
    ss.getRange(1,column+1,row, columnNew).setValues(rows);
    
  }
