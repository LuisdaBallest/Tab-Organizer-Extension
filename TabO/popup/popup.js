const tabs = await chrome.tabs.query({});
const template = document.getElementById("li_template");
let elements = [];

for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);
  const title = tab.title;
  const pathname = new URL(tab.url);

  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;
  element.querySelector(".chk").className= tab.id;
  element.querySelector(".close").name= tab.id;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });
  element.name=title + pathname;
  elements.push(element);
}
document.querySelector("ul").append(...elements);
console.log(elements)

//           GROUP BUTTON 
let checkTabs = [];
const markedCheckbox = document.getElementsByName("add");
const button = document.getElementById("button-group");
button.addEventListener("click", async () => {
    for (var checkbox of markedCheckbox) {
      if (checkbox.checked) checkTabs.push(+checkbox.className);
    }  
  const group = await chrome.tabs.group({tabIds: checkTabs }); 
  await chrome.tabGroups.update(group);
});

//            SEARCHBAR
const searchInput = document.querySelector("[data-search]");
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  elements.forEach((user) => {
    const isVisible = user.name.toLowerCase().includes(value); 
    user.classList.toggle("hide", !isVisible);
  });
});

//         CLOSE BUTTON
const closeBtn = document.getElementsByClassName("close");
console.log(closeBtn)

for(const btn of closeBtn){
    btn.addEventListener("click",()=>{
        chrome.tabs.remove(+btn.name);
    })
}


