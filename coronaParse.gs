/* simple and stupid parse function for apify data source for corona virus testing in czech 
*  available here https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true 
*  created as part of cesko.digital initiative */

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
  var ss = doc.getActiveSheet();
  // prepare the rows object
  var rows = [];
  // prepare headers
  rows.push(["date","tested cases", "positive tests"]);
  // preapare helper variable
  var positiveTests = "";
  var totalTestedCases = 0;
  
  // go through all the object, it assume same dates in both columns
  for (var v in data.testedCases) {
    
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
  rows.push(["total tested","infected", "source Url","source update","apify update","help"]);
  
  // assign the sum from the source
  if (data.totalTested != null) {
      
      totalTestedCases = data.totalTested;
  }
  
  // push the general no data specific information
  rows.push([totalTestedCases,data.infected,data.sourceUrl,data.lastUpdatedAtSource,data.lastUpdatedAtApify,data.readMe]);
  
  // write it to sheet
  row = rows.length;
  var columnNew = rows[0].length;
  
  ss.getRange(1,column+1,row, columnNew).setValues(rows);
  
}
