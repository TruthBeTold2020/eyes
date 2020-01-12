let analyzeText = document.getElementById("analyzeText");
let textToAnaylze = document.getElementById("textToAnalyze")

let factCheckTextButton = document.getElementById("factCheckTextButton");
let textToFactCheck = document.getElementById("textToFactCheck")

factCheckTextButton.onclick = async () => {
    fetch('https://nwhackers2020.appspot.com/fact_check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "text=" + textToFactCheck.value,
    })
    .then((response) => response.json())
    .then((data) => {
        alert("That fact is: " + data.results[0].truthRating + ". Read more at: " + data.results[0].url)
      console.log('Success:', data);
    })
    .catch((error) => {
        alert("We were unable to fact check this statement.")
    });
}

chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("textToFactCheck").value = selection[0];
});

let overallSentimentContainer = document.getElementById("popupContainer")

analyzeText.onclick = async () => {

    if (hasLessThanMinWords()) {
        alert("Enter 20+ words for analysis.");
        return;
    };

    fetch('https://nwhackers2020.appspot.com/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "text=" + textToAnaylze.value,
    })
        .then((response) => response.json())
        .then((data) => {

            console.log(data);

            const sentimentScore = data.sentiment.documentSentiment.score;

            document.getElementById("results").classList.remove("invisible");
            document.getElementById("results").classList.add("visible");

            let truncatedSedimentScore = "n/a"

            if (sentimentScore !== undefined) {
                truncatedSedimentScore = sentimentScore.toString().substring(0, 6);
            }

            document.getElementById("sentiment-score").textContent = "This sentiment score is: " + truncatedSedimentScore;
            document.getElementById("overallSentiment").className = "";

            this.setOverallSentiment(sentimentScore);

            this.setCategories(data);


        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

function hasLessThanMinWords() {

    let numWords = textToAnaylze.value.trim().split(/\s+/).length;;

    return (numWords < 20);
}

function setCategories(data) {

    if (data.category.categories === undefined || data.category.categories === null) {
        document.getElementById("category").remove();
        return;
    }

    // if there were no categories, make a new div category
    if (document.getElementById("category") === undefined) {
        createCategoryDiv();
    }

    this.clearCategories();

    for (let i = 0; i < data.category.categories.length; i++) {

        let newDiv = document.createElement("div");
        newDiv.classList.add("w-full");
        newDiv.classList.add("text-left");

        newDiv.textContent = "- " + data.category.categories[i].name.substring(1, data.category.categories[i].name.length);
        newDiv.textContent += " and we are " + data.category.categories[i].confidence.toString().substring(0, 6) + " sure of this"
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
    newCategoryDiv.classList.add("bg-pink-500");
    newCategoryDiv.textContent = "The category is (are):";

    document.getElementById("sentiment-score").appendChild(newCategoryDiv);

}

function setOverallSentiment(sentimentScore) {
    const overallSentimentArray = ["Negative", "Neutral", "Positive"];

    if (sentimentScore < -0.25) {
        document.getElementById("overallSentiment").textContent = "The overall sentiment is " + overallSentimentArray[0];
        document.getElementById("overallSentiment").className += "bg-red-500";
    } else if (sentimentScore > -0.25 && sentimentScore < 0.25) {
        document.getElementById("overallSentiment").textContent = "The overall sentiment is " + overallSentimentArray[1];
        document.getElementById("overallSentiment").className += "bg-yellow-500";
    } else {
        document.getElementById("overallSentiment").textContent = "The overall sentiment is " + overallSentimentArray[2];
        document.getElementById("overallSentiment").className += "bg-green-500";
    }
}

