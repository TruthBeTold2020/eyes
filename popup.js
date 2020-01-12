let analyzeTextButton = document.getElementById("analyzeTextButton");
let textToAnaylze = document.getElementById("textToAnalyze")

let factCheckTextButton = document.getElementById("factCheckTextButton");
let textToFactCheck = document.getElementById("textToFactCheck")

analyzeTextButton.onclick = async () => {
    fetch('https://nwhackers2020.appspot.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "text=" + textToAnaylze.value,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

factCheckTextButton.onclick = async () => {
    //TODO update this endpoint
    fetch('https://nwhackers2020.appspot.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "text=" + textToAnaylze.value,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("textToFactCheck").value = selection[0];
});