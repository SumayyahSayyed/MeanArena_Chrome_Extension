let mword = "";
let meaning = "";
let dictionary = ""

chrome.runtime.onMessage.addListener(
    function (req, sender, sendResponse) {
        if (req.type == "m1") {
            let word = req.value;
            mword = word;
            chrome.storage.sync.get(["key"]).then((result) => {
                if (result.key == "Google Dictionary") {
                    dictionary = result.key;
                    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
                        .then(res => res.json())
                        .then(res => {
                            const data = res;
                            data.forEach(word => {
                                const ans = word.meanings[0].definitions[0].definition;
                                sendResponse(ans);
                                meaning = ans;
                            });
                        })
                        .catch(error => {
                            console.log("Error Message: ", error.message); // display the error message
                            console.log("Error Code: ", error.code); // display the error code (if applicable)
                            console.log("Error Stack Trace: ", error.stack); // display the stack trace for the error
                        });
                }
                else if (result.key == "Merriam Webster") {
                    dictionary = result.key;
                    const key_id = "086ac8f7-b354-4853-968e-9a53a7aeb777";
                    fetch("https://dictionaryapi.com/api/v3/references/sd4/json/" + word + "?key=" + key_id)
                        .then(res => res.json())
                        .then(definitions => {
                            // definitions.forEach(word => {
                            //     let def = word.shortdef;
                            //     for (let result of def) {
                            //         sendResponse(result);
                            //         meaning = result;
                            //     }
                            // });
                            let result = definitions[0].shortdef[0];
                            sendResponse(result);
                            meaning = result;
                        })
                        .catch(error => {
                            console.log("Error Message: ", error.message); // display the error message
                            console.log("Error Code: ", error.code); // display the error code (if applicable)
                            console.log("Error Stack Trace: ", error.stack); // display the stack trace for the error
                        });
                }
                else if (result.key == "Wordnik Dictionary") {
                    dictionary = result.key;
                    const apiKey = '9x74h54wfmrgqclhx3q6psef34egur9qazhh3zz8cxem306jo';
                    fetch("https://api.wordnik.com/v4/word.json/" + word + "/definitions?limit=200&includeRelated=false&sourceDictionaries=wordnet&useCanonical=false&includeTags=false&api_key=" + apiKey)
                        .then(res => res.json())
                        .then(res => {
                            // for (let result of res) {
                            //     let ans = result.text;
                            //     sendResponse(ans);
                            //     meaning = ans;
                            // }
                            let ans = res[0].text;
                            sendResponse(ans);
                            meaning = ans;

                        })
                        .catch(error => {
                            console.log("Error Message: ", error.message); // display the error message
                            console.log("Error Code: ", error.code); // display the error code (if applicable)
                            console.log("Error Stack Trace: ", error.stack); // display the stack trace for the error
                        });
                }
            })
            return true;
        }
    }

);
// Define the endpoint URL and HTTP method
var url = 'http://localhost/Practice/php/check_login_status.php';
var method = 'GET';

// Send the GET request to the server
(async () => {
    await chrome.runtime.onMessage.addListener(
        function (req, sender, sendResponse) {
            let response = req.button;
            if (response == "Worked") {
                chrome.cookies.get({ url: "http://localhost/Practice/", name: "PHPSESSID" }, function (cookie) {
                    if (cookie) {
                        chrome.cookies.get({ url: "http://localhost/Practice/", name: "email" }, function (cookie) {
                            if (cookie) {
                                let email = decodeURIComponent(cookie.value);
                                // console.log("Email:", email);
                                console.log(mword, ": ", meaning);
                                let data = {
                                    myemail: email,
                                    myword: mword,
                                    mymeaning: meaning,
                                    mydictionary: dictionary
                                };
                                let phpUrl = 'http://localhost/Extension/php/getdata.php';
                                let options = {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(data)
                                };
                                // console.log(options);
                                // console.log(JSON.stringify(data));
                                fetch(phpUrl, options)
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data);
                                        // console.log(JSON.stringify(data));
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        // console.log(JSON.stringify(data));
                                    });
                                sendResponse("Saved");
                            } else {
                                console.log("Email cookie not found");
                                sendResponse("Save");
                                chrome.tabs.create({ url: 'http://localhost/Practice/login/login.html' });
                            }
                        });
                    } else {
                        console.log("Session cookie not found");
                        sendResponse("Save");
                    }
                });
                fetch(url, { method: method })
                    .then(function (response) {
                        if (response.ok) {
                            return "Your Connnection is working. You can go ahead and save your words";
                        } else {
                            throw new Error('Connection Error, Go login first');
                        }
                    })
                    .then(function (responseText) {
                        console.log(responseText);

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    );
})();


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.cookies.get({ url: "http://localhost/Practice/", name: "PHPSESSID" }, function (cookie) {
        if (cookie) {
            chrome.cookies.get({ url: "http://localhost/Practice/", name: "email" }, function (cookie) {
                if (cookie) {
                    let email = decodeURIComponent(cookie.value);

                    let newdata = { userEmail: email };
                    fetch('http://localhost/Extension/php/selection.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newdata)
                    })
                        .then(response => response.json())
                        .then(newdata => {
                            // console.log(newdata.userEmail);
                            // console.log(newdata.savedWords);
                            let savedWords = newdata.savedWords;
                            let savedDef = newdata.savedDef
                            // console.log(savedWords);
                            if (savedWords.length > 0) {

                                // Get the current active tab
                                chrome.tabs.query(
                                    { active: true, lastFocusedWindow: true },
                                    tabs => {
                                        let currentTab = tabs[0];
                                        let newUrl = currentTab.url;
                                        if (newUrl.includes("www.google.com") || newUrl === "https://www.google.com/") {
                                            console.log(newUrl);
                                        }
                                        else {
                                            chrome.tabs.sendMessage(tabId, {
                                                newUrl: newUrl,
                                                savedWords: savedWords,
                                                savedDef: savedDef,
                                                type: "save"
                                            });
                                        }
                                    }
                                );

                                // Listen for when the user switches tabs
                                chrome.tabs.onActivated.addListener(
                                    tab => {
                                        // Get the tab that was just activated
                                        chrome.tabs.get(tab.tabId, newTab => {

                                            let newUrl = newTab.url;
                                            if (newUrl.includes("www.google.com") || newUrl === "https://www.google.com/") {
                                                console.log(newUrl);
                                            }
                                            else {
                                                chrome.tabs.sendMessage(tabId, {
                                                    newUrl: newUrl,
                                                    savedWords: savedWords,
                                                    savedDef: savedDef,
                                                    type: "save"
                                                });
                                            }
                                        });
                                    }
                                );
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
        }
    });
});