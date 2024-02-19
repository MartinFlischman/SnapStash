document.addEventListener('DOMContentLoaded', function() {
    var saveBtn = document.getElementById('saveBtn');
    var category = document.getElementById('category');
    var list = document.getElementById('list');

    // Function to add item to the list
    function addItemToList(item) {
        var listItem = document.createElement('li');
        listItem.textContent = item.category + ': ' + item.url;
        
        // Add a button to remove the item
        var removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', function() {
        listItem.remove();
        });
        
        listItem.appendChild(removeBtn);
        list.appendChild(listItem);
    }

    // Event listener for Save button
    saveBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        var item = {
            url: tab.url,
            category: category.value
        };
        addItemToList(item);
        });
    });
});
