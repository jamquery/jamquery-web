var timeoutId = null;
var input = null;

// Callbacks

function onReadLine(value) {
  logRequest(value);

  input = value;

  if (!input) {
    clearResult();
    return;
  }

  // not for addition
  if (value.startsWith("+")) {
    return;
  }

  if (timeoutId != null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  timeoutId = setTimeout(sendSearchRequest, 100);
}

function onEnter(value) {
  logRequest(value);

  // Only for addition
  if (!value.startsWith("+")) {
    return;
  }

  // remove + sign
  requestAdd(value);
}

function sendSearchRequest() {
  if (input) requestSearch(input);
}

function clearInput() {
  document.getElementById("read-line").value = "";
}

function clearResult() {
  var resultList = document.getElementById("result");
  resultList.innerHTML = "";
}

function requestSearch(keyword) {
  keyword = encodeURIComponent(keyword);

  var api = "/api";
  var http = new XMLHttpRequest();
  http.open("GET", api + "/" + keyword, true);
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      var jsonData = JSON.parse(http.responseText);
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

function p(text) {
  return "<p>" + text + "</p>";
}

function a(text, link) {
  return (
    '<a target="_blank" rel="noopener noreferrer" href="' +
    link +
    '">' +
    text +
    "</a>"
  );
}

function logResult(message) {
  clearResult();
  var resultList = document.getElementById("result");
  resultList.innerHTML = "<p>" + message + "</p>";
}

function logRequest(message) {
  var responseText = document.getElementById("res");
  if (isAddInput(message)) {
    result = parseAddInput(message);
    responseText.innerHTML =
      p("Name: " + result.name) +
      p("Url: " + (isUrl(result.url) ? result.url : ""));
  } else {
    responseText.innerHTML = p("Request: " + message);
  }
}

function isAddInput(input) {
  return input && input.startsWith("+");
}

function parseAddInput(input) {
  var space = input.lastIndexOf(" ");
  var url = space != -1 ? input.slice(space).trim() : "";
  var name = space != -1 ? input.slice(1, space).trim() : input.slice(1).trim();

  return {
    url: url,
    name: name
  };
}

function requestAdd(input) {
  var result = parseAddInput(input);
  var name = result.name;
  var url = result.url;

  if (!isUrl(url)) {
    logResult("Invalid URL: " + url);
    return;
  }

  var api = "/api";
  var http = new XMLHttpRequest();
  http.open("POST", api, true);
  http.setRequestHeader("Content-Type", "application/json");
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      clearInput();
      logRequest("");
      logResult("Add new jamquery Success!");
      setTimeout(function() {
        clearResult();
      }, 1000);
    }
  };

  // var data = JSON.stringify();
  http.send(
    JSON.stringify({
      name: name,
      url: url
    })
  );
}

function isUrl(str) {
  magicregexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (magicregexp.test(str)) {
    return true;
  } else {
    return false;
  }
}
