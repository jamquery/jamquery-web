var timeoutId = null;
var input = null;

function onReadLine(value) {
  document.getElementById("res-text").innerHTML = "Request: " + value;
  input = value;

  if (timeoutId != null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  timeoutId = setTimeout(sendRequest, 100);
}

function parseKeyword(inputValue) {
  return inputValue;
}

function sendRequest() {
  if (input == null) return;

  var encodedInput = encodeURIComponent(input);

  if (encodedInput.startsWith("+")) {
    requestSearch(encodedInput.slice(1));
  } else {
    if (encodedInput.length === 0) {
      clearResult();
    } else {
      requestSearch(encodedInput);
    }
  }
}

function clearResult() {
  var resultList = document.getElementById("result");
  resultList.innerHTML = "";
}

function requestSearch(keyword) {
  var url = "http://localhost:3000/api";
  var http = new XMLHttpRequest();
  http.open("GET", url + "/" + keyword, true);
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      var jsonData = JSON.parse(http.responseText);
      console.log(jsonData);

      var resultList = document.getElementById("result");
      resultList.innerHTML = "";
      jsonData.forEach(item => {
        resultList.innerHTML += li(a(makeText(item), item.url));
      });
    }
  };
  http.send();
}

function makeText(jamquery) {
  var dateText = new Date(jamquery.updated).toLocaleDateString();
  return jamquery.name + "&emsp;" + jamquery.url + "&emsp;" + dateText;
}

function li(text) {
  return "<li>" + text + "</li>";
}

function a(text, link) {
  return '<a href="' + link + '">' + text + "</a>";
}
