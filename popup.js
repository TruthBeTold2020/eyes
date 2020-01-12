let analyzeText = document.getElementById("analyzeText");
let textToAnaylze = document.getElementById("textToAnalyze")

let factCheckTextButton = document.getElementById("factCheckTextButton");
let textToFactCheck = document.getElementById("textToFactCheck")

chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
}, async function (selection) {
    var query = { active: true, currentWindow: true };
    await chrome.tabs.query(query, callback);
});

async function callback(tabs) {
    var currentTab = tabs[0].url;
    console.log(currentTab);// there will be only one in this array

    fetch('https://nwhackers2020.appspot.com/scrap_website', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "url=" + currentTab,
    })
        .then((response) => response.json())
        .then((data) => {

            console.log(data);

            const sentimentScore = data.sentiment.score;

            document.getElementById("results").style.display = "block";

            let truncatedSedimentScore = "n/a"

            if (sentimentScore !== undefined) {
                truncatedSedimentScore = sentimentScore.toString().substring(0, 6);
            }

            document.getElementById("sentiment-score").textContent = "This sentiment score is: " + truncatedSedimentScore;

            this.setOverallSentiment(sentimentScore);

            this.setCategories(data);
        })

        .catch((error) => {
            alert("We were unable to analyze this website.")
        });
}

let overallSentimentContainer = document.getElementById("popupContainer")

function setCategories(data) {

    if (data.categories === undefined || data.categories === null) {
        document.getElementById("category").remove();
        return;
    }

    // if there were no categories, make a new div category
    if (document.getElementById("category") === undefined) {
        createCategoryDiv();
    }

    this.clearCategories();

    for (let i = 0; i < data.categories.length; i++) {

        let newDiv = document.createElement("div");

        newDiv.textContent = "- " + data.categories[i].name.substring(1, data.categories[i].name.length);
        newDiv.textContent += " and we are " + data.categories[i].confidence.toString().substring(0, 6) + " sure of this"
        document.getElementById("category").appendChild(newDiv);
    }
}

function clearCategories() {

    if (document.getElementById("category") !== null) {

        let categoryDiv = document.getElementById("category");

        for (let i = 0; i < categoryDiv.childNodes.length; i++) {
            categoryDiv.removeChild(categoryDiv.childNodes[i]);
        }

        createCategoryDiv();
    }

}

function createCategoryDiv() {

    let newCategoryDiv = document.createElement("div");
    newCategoryDiv.setAttribute("id", "category");
    newCategoryDiv.textContent = "The category is (are):";

    document.getElementById("sentiment-score").appendChild(newCategoryDiv);

}

function setOverallSentiment(sentimentScore) {
    const overallSentimentArray = ["Negative", "Neutral", "Positive"];

    if (sentimentScore < -0.25) {
        document.getElementById("overallSentiment").textContent = "The overall sentiment is " + overallSentimentArray[0];
    } else if (sentimentScore > -0.25 && sentimentScore < 0.25) {
        document.getElementById("overallSentiment").textContent = "The overall sentiment is " + overallSentimentArray[1];
    } else {
        document.getElementById("overallSentiment").textContent = "The overall sentiment is " + overallSentimentArray[2];
    }
}

