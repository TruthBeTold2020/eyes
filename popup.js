let analyzeText = document.getElementById("analyzeText");
let textToAnaylze = document.getElementById("textToAnalyze")
let popupContainer = document.getElementById("popupContainer")

let overallSentimentContainer = document.getElementById("popupContainer")

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

            console.log(data);

            const sentimentScore = data.sentiment.documentSentiment.score;

            document.getElementById("results").classList.remove("invisible");
            document.getElementById("results").classList.add("visible");

            document.getElementById("sentiment-score").textContent = "This sentiment score is: " + sentimentScore;
            document.getElementById("overallSentiment").className = "";

            this.setOverallSentiment(sentimentScore);

            this.removeCategories();
            this.setCategories(data);


        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

function removeCategories() {

    document.getElementById("category").remove();

    let newDiv = document.createElement("div");
    newDiv.setAttribute("id", "category");
    newDiv.classList.add("bg-pink-500");
    newDiv.textContent = "The category is (are):";

    document.getElementById("sentiment-score").appendChild(newDiv);

}

function setCategories(data) {

    if (data.category.categories === undefined) {
        return;
    }

    for (let i = 0; i < data.category.categories.length; i++) {

        let newDiv = document.createElement("div");
        newDiv.classList.add("w-full");

        newDiv.textContent = data.category.categories[i].name.substring(1, data.category.categories[i].name.length);
        newDiv.textContent += " and we are " + data.category.categories[i].confidence +" sure of this"
        document.getElementById("category").appendChild(newDiv);
    }

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

let i = 0;
function move() {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 10);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
            }
        }
    }
}


