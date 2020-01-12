let analyzeText = document.getElementById("analyzeText");
let textToAnaylze = document.getElementById("textToAnalyze")
let popupContainer = document.getElementById("popupContainer")

analyzeText.onclick = async () => {
    let h = document.createElement("H1");
    let t = document.createTextNode(textToAnaylze.value);
    h.appendChild(t);
    popupContainer.appendChild(h);
    // const data = { username: 'example' };

    // fetch('https://example.com/profile', {
    //   method: 'POST', // or 'PUT'
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log('Success:', data);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });

    // const response = await fetch('https://dog.ceo/api/breeds/image/random');
    // const myJson = await response.json();    
    // let image = document.createElement("img")
    // image.src = myJson["message"];
    // image.width = "300";
    // popupContainer.appendChild(image)
}