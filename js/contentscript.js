let getSelectedText = () => {

    let selectedText = window.getSelection().toString().toLowerCase().trim();
    return selectedText;
}

function popup(p) {

    const block = document.createElement("div");
    let newScroll = document.querySelector('#body.style-scope');
    if (newScroll) {
        newScroll.addEventListener('scroll', () => {
            const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
            console.log("start");
            block.style.position = 'sticky';
            block.style.top = `${rect.bottom}px`;
            block.style.left = `${rect.right}px`;
            console.log("Is it working");
        });
    }
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    block.setAttribute("id", "box");
    block.style.backgroundColor = "#EBECEE";
    block.style.color = "black";
    block.style.fontSize = "15px";
    block.style.borderRadius = "10px";
    block.style.borderTopLeftRadius = "0px";
    block.style.boxShadow = "1px 1px 5px #999";
    block.style.maxWidth = "300px";
    block.style.minWidth = "250px";
    block.style.padding = "1em";
    block.style.position = 'fixed';
    block.style.top = `${rect.bottom}px`;
    block.style.left = `${rect.right}px`;
    block.style.zIndex = "9999";

    p.style.margin = "0px";
    p.style.color = "black";
    block.appendChild(p);
    window.addEventListener('scroll', () => {
        const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect();

        // update the position for the scroll
        block.style.left = `${selectionRect.right}px`;
        block.style.top = `${selectionRect.bottom}px`;
    });

    if (selection.rangeCount > 0) {
        document.body.append(block);
    }
    let newDiv = document.createElement("div");
    newDiv.style.display = "flex";
    newDiv.style.justifyContent = "space-between";
    newDiv.style.alignItems = "flex-end";
    block.appendChild(newDiv);

    // Creating the save button
    newDiv.insertAdjacentHTML("beforeend", "<button id='blockBtn'>Save</button>");
    let button = document.getElementById("blockBtn");
    button.style.backgroundColor = "#5072A7";
    button.style.color = "white";
    button.style.paddingRight = "20px";
    button.style.paddingLeft = "20px";
    button.style.paddingTop = "5px";
    button.style.paddingBottom = "5px";
    button.style.marginTop = "8px";
    // button.style.marginRight = "48px";
    button.style.border = "none";
    button.addEventListener("click", () => {
        let worked = "Worked";
        (async () => {
            await chrome.runtime.sendMessage({ button: worked },
                function (res) {
                    // if (res == "Saved") {
                    button.innerText = "Saved";
                    // }
                    // else {
                    //     button.innerText = "Save";
                    // }
                    // button.innerText = res;
                }
            )
        })();

    })
    const name = document.createElement("label");
    chrome.storage.sync.get(["key"]).then((result) => {
        name.innerHTML = result.key;
    })

    name.style.fontSize = "12px";
    name.style.float = "right";
    name.style.display = "flex";
    name.style.marginTop = "10px";
    name.style.color = "#0047AB";
    name.style.bottom = "0";
    // block.appendChild(name);
    newDiv.appendChild(name);

    const removePopup = () => {
        block.remove();
        document.removeEventListener("click", removePopup);
    };
    // Listen for a single click to remove the popup
    document.addEventListener("click", removePopup, { once: true });

    block.addEventListener("click", function (event) {
        event.stopPropagation();
    });
    block.addEventListener("mousedown", function (event) {
        event.preventDefault();
        return false;
    });
}

ondblclick = () => {
    const p = document.createElement("p");
    p.setAttribute("id", "para");

    chrome.runtime.sendMessage(
        {
            value: getSelectedText(),
            type: "m1"
        },
        function (r) {
            if ((getSelectedText().includes(" ") || getSelectedText() === "") && (r == " " || r == "")) {
            }
            else {
                p.innerHTML = r;
                console.log(r);
                popup(p);
            }
        }
    );
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    // console.log(message.newUrl);
    // console.log(message.savedDef);
    // console.log(message.savedWords);

    let url = message.newUrl;
    if (url.includes("https://www.google.com") || url.includes("https://www.google.com/search?")) {
        console.log(url);
    }
    else {
        let savedWords = message.savedWords;
        let savedDef = message.savedDef;

        const regex = new RegExp(`(?:^|\\s)(\\b${savedWords.join('|')}\\b)(?=$|[\\s,.?!])`, 'gi');

        function searchForTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {

                // const words = node.textContent.trim().split(/(\s+)/);
                const words = node.textContent.trim().split(/([\s,.;]+)/);

                const replacedText = words.map(word => {
                    if (regex.test(word)) {
                        return ` ${word} `.replace(regex, `<span class="word-definition" data-definition="${savedDef[savedWords.indexOf(word.toLowerCase())]}" style="text-decoration: underline;">$&</span>`);
                    } else {
                        return word;
                    }
                }).join('');

                const span = document.createElement('span');
                span.innerHTML = replacedText;
                node.parentNode.replaceChild(span, node);

                const underlinedWords = span.querySelectorAll('.word-definition');
                underlinedWords.forEach(word => {
                    word.addEventListener('mouseover', (event) => {
                        const definition = word.getAttribute('data-definition');
                        // console.log(definition);

                        const newPopup = document.createElement('div');
                        newPopup.classList.add('newPopup');
                        newPopup.textContent = definition;

                        const rect = event.target.getBoundingClientRect();
                        newPopup.style.left = rect.left + 'px';
                        newPopup.style.top = rect.bottom + 'px';
                        newPopup.style.zIndex = "9999";
                        newPopup.style.position = "fixed";
                        newPopup.style.backgroundColor = "#EBECEE";
                        newPopup.style.color = "black";
                        newPopup.style.fontSize = "15px";
                        newPopup.style.borderRadius = "10px";
                        newPopup.style.borderTopLeftRadius = "0px";
                        newPopup.style.boxShadow = "1px 1px 5px #cfcfcf";
                        newPopup.style.maxWidth = "300px";
                        newPopup.style.minWidth = "250px";
                        newPopup.style.padding = "1em";

                        document.body.appendChild(newPopup);
                    });
                    word.addEventListener('mouseout', () => {
                        const newPopup = document.querySelector('.newPopup');
                        if (newPopup) {
                            document.body.removeChild(newPopup);
                        }
                    });
                });

            } else {
                Array.from(node.childNodes).forEach(childNode => searchForTextNodes(childNode));
            }
        }
        searchForTextNodes(document.body);
    }
});