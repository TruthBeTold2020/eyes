let analyzeText = document.getElementById("analyzeText");
let textToAnaylze = document.getElementById("textToAnalyze")
let popupContainer = document.getElementById("popupContainer")

analyzeText.onclick = async () => {
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