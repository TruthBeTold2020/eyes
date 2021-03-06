let analyzeText = document.getElementById("analyzeText");
let textToAnaylze = document.getElementById("textToAnalyze");

let factCheckTextButton = document.getElementById("factCheckTextButton");
let textToFactCheck = document.getElementById("textToFactCheck");

chrome.tabs.executeScript(
  {
    code: "window.getSelection().toString();"
  },
  async function(selection) {
    var query = { active: true, currentWindow: true };
    await chrome.tabs.query(query, callback);
  }
);

async function callback(tabs) {
  var currentTab = tabs[0].url;
  console.log(currentTab); // there will be only one in this array

  fetch("https://nwhackers2020.appspot.com/scrap_website", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "url=" + currentTab
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      const sentimentScore = data.sentiment.score;

      document.getElementById("results").style.display = "block";
      document.getElementById("spinner").style.display = "none";

      let truncatedSedimentScore = "n/a";

      if (sentimentScore !== undefined) {
        document.getElementById("sentiment-score").style.display = "inline";
        truncatedSedimentScore = sentimentScore.toString().substring(0, 6);
      }

      if (truncatedSedimentScore !== "n/a") {
        this.setupProgressBar(truncatedSedimentScore);
      }

      document.getElementById("sentiment-score").textContent =
        "This sentiment score is: " + truncatedSedimentScore;

      this.setKeywords(data.topthreekeywords);
      this.setOverallSentiment(sentimentScore);

      this.setCategories(data);
    })
    .catch(error => {
      document.getElementById("spinner").style.display = "none";
      alert("We were unable to analyze this website.");
    });
}

let overallSentimentContainer = document.getElementById("popupContainer");

function setKeywords(keywordArray) {
  document.getElementById("keyword1").textContent =
    "  #" + keywordArray[0].toLowerCase() + " ";
  document.getElementById("keyword2").textContent =
    "  #" + keywordArray[1].toLowerCase() + " ";
  document.getElementById("keyword3").textContent =
    "  #" + keywordArray[2].toLowerCase() + " ";
}

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
    newDiv.setAttribute("class", "row");
    let divCategory = document.createElement("div");
    divCategory.setAttribute("class", "col-8 justify-content-center");
    divCategory.textContent = data.categories[i].name.substring(
      1,
      data.categories[i].name.length
    );

    let divPercentage = document.createElement("div");
    divPercentage.setAttribute("class", "col-4 justify-content-center");
    divPercentage.textContent =
      data.categories[i].confidence.toString().substring(0, 6) + " likely";
    newDiv.appendChild(divCategory);
    newDiv.appendChild(divPercentage);
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
  newCategoryDiv.setAttribute("style", "margin-top:2rem");
  newCategoryDiv.textContent = "The category is (are):";

  document.getElementById("spacer").appendChild(newCategoryDiv);
}

function setupProgressBar(truncatedSentimentScore) {
  let maxWidth = window.innerWidth;
  fscore = parseFloat(truncatedSentimentScore);
  let width = (fscore + 1.0) * parseFloat(maxWidth / 2);
  let progressBar = document.getElementById("progress-bar");
  if (fscore < -0.25) {
    progressBar.style["background-color"] = "red";
  } else if (fscore >= -0.25 && fscore <= 0.25) {
    progressBar.style["background-color"] = "yellow";
  } else {
    progressBar.style["background-color"] = "green";
  }
  progressBar.style["width"] = width.toString() + "px";
}

function setOverallSentiment(sentimentScore) {
  const overallSentimentArray = ["Negative", "Neutral", "Positive"];

  if (sentimentScore < -0.25) {
    //negative
    document.getElementById("overallSentiment").textContent =
      overallSentimentArray[0];
  } else if (sentimentScore > 0.25) {
    // positive
    document.getElementById("overallSentiment").textContent =
      overallSentimentArray[2];
  } else {
    // negative
    document.getElementById("overallSentiment").textContent =
      overallSentimentArray[1];
  }
}
