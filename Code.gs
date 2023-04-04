function doGet() {
  var html = HtmlService.createHtmlOutputFromFile('Index');
  return html;
}

function update(ids) {
    var createdSheet = createNewSheet()
    idsArray=ids.replace(/ /g, '').replace('[', '').replace(']', '').split(',');
    for (const property in idsArray) {
      createdSheet.getRange('A'+String(parseInt(property, 10)+2)).setValue(getTitleByExtID(idsArray[property].replace(/"/g, '')));
      createdSheet.getRange('B'+String(parseInt(property, 10)+2)).setValue('https://chrome.google.com/webstore/detail/' + idsArray[property].replace(/"/g, ''));
      createdSheet.getRange('C'+String(parseInt(property, 10)+2)).setValue(idsArray[property].replace(/"/g, ''));
      Logger.log(`${idsArray[property]}`);
    }
    createdSheet.autoResizeColumn(1);
    createdSheet.autoResizeColumn(2);
    createdSheet.autoResizeColumn(3);
    createdSheet.getRange("A2:C1000").sort({column: 1, ascending: true});
}

function getTitleByExtID(id) {
  try {
    return(String(UrlFetchApp.fetch('https://chrome.google.com/webstore/detail/'+id)).match(/<meta\s+property="og:title"\s+content="([^"]+)"/)[1])
  }
  catch {
    return("❌ Doesn't exist")
  }
}

function createNewSheet() {
  var today = new Date();
  var spreadsheetId = "SHEET ID";
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheetName = today.toDateString();
  var newSheet = spreadsheet.insertSheet(sheetName);
  var sheets = spreadsheet.getSheets();
  var welcomeSheet = sheets[0];
  newSheet.getRange("A1").setValue("Name");
  newSheet.getRange("B1").setValue("URL");
  newSheet.getRange("C1").setValue("ID");
  welcomeSheet.getRange("A3").setValue('=HYPERLINK("https://docs.google.com/spreadsheets/d/SHEET ID/edit#gid='+newSheet.getSheetId()+'", "See latest list")');
  welcomeSheet.getRange("C3").setValue(sheetName);
  welcomeSheet.getRange("B4").setValue("=COUNTA('"+sheetName+"'!A:A)");
  welcomeSheet.getRange("B5").setValue(`=COUNTIF('`+sheetName+`'!A:A, "❌ Doesn't exist")`);
  return newSheet;
}
