document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveBtn');
    const category = document.getElementById('category');
    const list = document.getElementById('list');

    // Function to add item to the list
    function addItemToList(item) {
        const listItem = document.createElement('li');
        const itemName = truncateString(item.name, 50); // Truncate item name to 50 characters
        listItem.textContent = `${item.category}: ${itemName}`; // Display category and truncated item name

        // Add a button to remove the item
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn'); // Add a class for styling
        removeBtn.addEventListener('click', function() {
            listItem.remove();
            removeItemFromStorage(item); // Remove the item from storage when removed from the list
        });

        listItem.appendChild(removeBtn);
        list.appendChild(listItem);
    }

    // Event listener for Save button
    saveBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tab = tabs[0];
            if (!tab || !tab.url || !tab.title) {
                alert('Error: Unable to retrieve tab information.');
                return;
            }
            const item = {
                url: tab.url,
                category: category.value,
                name: tab.title
            };
            if (item.category) {
                addItemToList(item);
                saveItemToStorage(item);
                alert('Item saved successfully!');
            } else {
                alert('Please select a category and try again.');
            }
        });
    });

    // Function to truncate string to specified length
    function truncateString(str, maxLength) {
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }

    // Function to save item to storage
    function saveItemToStorage(item) {
        chrome.storage.sync.get('savedItems', function(data) {
            const savedItems = data.savedItems || [];
            savedItems.push(item);
            chrome.storage.sync.set({savedItems: savedItems});
        });
    }

    // Function to remove item from storage
    function removeItemFromStorage(item) {
        chrome.storage.sync.get('savedItems', function(data) {
            const savedItems = data.savedItems || [];
            const updatedItems = savedItems.filter(savedItem => savedItem.url !== item.url);
            chrome.storage.sync.set({savedItems: updatedItems});
        });
    }
});
