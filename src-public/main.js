let timeoutId = null;
let globalInput = null;

// Callbacks
window.onload = () => {
  const readline = document.getElementById("read-line");

  readline.oninput = (_event) => {
    onReadLine(readline.value);
  };

  readline.onkeyup = (event) => {
    // Test if the key is "Enter"
    if (event.keyCode === 13) {
      onEnter(readline.value);
    }
  };
};

const onReadLine = (value) => {
  logRequest(value);

  globalInput = value;

  if (!globalInput) {
    clearResult();
    clearSearchRequestCall();
    return;
  }

  // not for addition
  if (value.startsWith("+")) {
    return;
  }

  clearSearchRequestCall();

  timeoutId = setTimeout(sendSearchRequest, 100);
};

const clearSearchRequestCall = () => {
  if (timeoutId != null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

const onEnter = (value) => {
  logRequest(value);

  // Only for addition
  if (!value.startsWith("+")) {
    return;
  }

  // remove + sign
  requestAdd(value);
};

const getOptionFromInput = (input) => {
  let option = null;
  let newInput = input;

  if (input.startsWith("/")) {
    option = "name";
    newInput = input.slice(1);
  }

  if (input.startsWith("@")) {
    option = "tag";
    newInput = input.slice(1);
  }

  if (input.startsWith("#")) {
    option = "date";
    newInput = input.slice(1);
  }

  return {
    option,
    newInput,
  };
};

const sendSearchRequest = () => {
  if (globalInput) {
    const { option, newInput } = getOptionFromInput(globalInput);
    requestSearch(option, newInput);
  }
};

const clearInput = () => {
  document.getElementById("read-line").value = "";
};

const clearResult = () => {
  const resultList = document.getElementById("result");
  resultList.innerHTML = "";
};

const requestSearch = (option, keyword) => {
  if (keyword === null || keyword.length === 0) {
    return;
  }

  const encodedKeyword = encodeURIComponent(keyword);

  let urlFix = "";
  if (option) {
    urlFix = `${option}/`;
  }

  const api = "/api";
  const http = new XMLHttpRequest();
  http.open("GET", `${api}/${urlFix}${encodedKeyword}`, true);
  http.onreadystatechange = () => {
    if (http.readyState === 4 && http.status === 200) {
      if (!globalInput) return;

      const jsonData = JSON.parse(http.responseText);
      const resultList = document.getElementById("result");
      resultList.innerHTML = "";
      jsonData.forEach((item) => {
        const hlDateText = makeHighlight(
          new Date(item.created).toLocaleDateString(),
          encodedKeyword,
        );
        const hlName = makeHighlight(item.name, encodedKeyword);
        const hlTag = makeHighlight(item.tags.join(", "), encodedKeyword);
        resultList.innerHTML += div(
          a(resultItem(hlTag, hlName, hlDateText), item.content),
        );
      });
    }
  };
  http.send();
};

const makeHighlight = (text, keyword) => text.replace(new RegExp(keyword, "ig"), sub => highlight(sub));

const resultItem = (tags, content, date) => `<div class="result-item">
    <span class="tag">${tags}</span>
    <span class="content">${content}</span>
    <span class="date">${date}</span>
  </div>`;

const div = text => `<div>${text}</div>`;

const p = text => `<p>${text}</p>`;

const highlight = text => `<span class="highlight">${text}</span>`;

const a = (text, link) => (
  `<a target="_blank" rel="noopener noreferrer" href="${link}">${text}</a>`
);

const logResult = (message) => {
  clearResult();
  const resultList = document.getElementById("result");
  resultList.innerHTML = `<p>${message}</p>`;
};

const logRequest = (message) => {
  const responseText = document.getElementById("res");
  if (isAddInput(message)) {
    const result = parseAddInput(message);
    responseText.innerHTML = p(`Tags: ${result.tags}`)
      + p(`Name: ${result.name}`)
      + p(`Url: ${isUrl(result.url) ? result.url : ""}`);
  } else {
    responseText.innerHTML = p(`Request: ${message}`);
  }
};

const isAddInput = input => input && input.startsWith("+");

const parseName = (input) => {
  let name = input;
  const tags = [];

  while (name.length > 0) {
    const startIndex = name.indexOf("[") + 1;
    const endIndex = name.indexOf("]", startIndex);
    if (endIndex === -1) {
      break;
    }

    const tag = name.slice(startIndex, endIndex).toLowerCase();
    name = name.slice(endIndex + 1).trim();
    tags.push(tag);
  }

  return {
    tags,
    name,
  };
};

const parseAddInput = (input) => {
  const space = input.lastIndexOf(" ");
  const url = space !== -1 ? input.slice(space).trim() : "";

  const temp = space !== -1
    ? input.slice(1, space).trim()
    : input.slice(1).trim();
  const { tags, name } = parseName(temp);

  return {
    tags,
    url,
    name,
  };
};

const requestAdd = (input) => {
  const { tags, name, url } = parseAddInput(input);

  if (!isUrl(url)) {
    logResult(`Invalid URL: ${url}`);
    return;
  }

  const api = "/api";
  const http = new XMLHttpRequest();
  http.open("POST", api, true);
  http.setRequestHeader("Content-Type", "application/json");
  http.onreadystatechange = () => {
    if (http.readyState === 4 && http.status === 200) {
      const jsonData = JSON.parse(http.responseText);

      clearInput();
      logRequest("");
      logResult(`Add new jamquery Success with id ${jsonData.id}`);
      setTimeout(clearResult, 1000);
    }
  };

  http.send(
    JSON.stringify({
      tags,
      name,
      url,
    }),
  );
};

const isUrl = (str) => {
  const magicregexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (magicregexp.test(str)) {
    return true;
  }

  return false;
};
