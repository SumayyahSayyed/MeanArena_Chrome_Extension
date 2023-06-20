let radios = document.forms["form1"].elements["dictionary"];
let dict1 = document.getElementById("Google Dictionary");
let dict2 = document.getElementById("Merriam Webster");
let dict3 = document.getElementById("Wordnik Dictionary");

for (let i = 0; i < radios.length; i++) {
    radios[i].onclick = () => {
        if (dict1.checked) {
            let dict = dict1.value;
            chrome.storage.sync.set({
                key: dict
            })
                .then(() => {
                    console.log("Value is set to " + dict);
                    chrome.runtime.sendMessage(
                        { dictionary: dict }
                    );
                });

            dict1.checked = true;
        }
        else if (dict2.checked) {
            let dict = dict2.value;
            chrome.storage.sync.set({
                key: dict
            })
                .then(() => {
                    console.log("Value is set to " + dict);
                    chrome.runtime.sendMessage(
                        { dictionary: dict }
                    );
                });

            dict2.checked = true;
        }
        else if (dict3.checked) {
            let dict = dict3.value;
            chrome.storage.sync.set({
                key: dict
            })
                .then(() => {
                    console.log("Value is set to " + dict);
                    chrome.runtime.sendMessage(
                        { dictionary: dict }
                    );
                });

            dict3.checked = true;
        }
    }
}

chrome.storage.sync.get('key', function (data) {
    let selectedDict = data.key;
    if (selectedDict === dict1.value) {
        dict1.checked = true;
    } else if (selectedDict === dict2.value) {
        dict2.checked = true;
    } else if (selectedDict === dict3.value) {
        dict3.checked = true;
    }
});
