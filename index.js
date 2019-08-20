'use strict';

const STORE = {
  items: [
    {id: cuid(), name: "apples", checked: false},
    {id: cuid(), name: "oranges", checked: false},
    {id: cuid(), name: "milk", checked: true},
    {id: cuid(), name: "bread", checked: false}
  ],
  hideCompleted: false,
  searchTerm: '',
};


function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
          <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item) => generateItemElement(item));
  
  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM

  let filteredItems = STORE.items;

  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(x => !x.checked)
  }

  if (STORE.searchTerm !== '') {
    filteredItems = [filteredItems.find(x => x.name === STORE.searchTerm)];
  }


  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}


function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}

function deleteItem(itemId) {
    const itemIndexToDelete = STORE.items.findIndex(x=> x.id === itemId);
    STORE.items.splice(itemIndexToDelete, 1);
}

function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
        const id = getItemIdFromElement(event.currentTarget);
        deleteItem(id);
        renderShoppingList();
    })
}

function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleHideFilter() {
  $('.js-hide-checked').on('click', ()=> {
    toggleHideFilter();
    renderShoppingList();
  })
}

function setSearchTerm(searchInput) {
  STORE.searchTerm = searchInput;
}

function handleSearchSubmit() {
  $('#search-form').on('submit', event => {
    event.preventDefault();
    setSearchTerm($('.search-field').val());
    $('.search-field').val('');
    renderShoppingList();
  })
}

function updateItemName(itemId, newName) {
  let item = STORE.items.find(item => item.id === itemId);
  item.name = newName;
}

function handleNameUpdate() {
  $('.js-item-edit').on('click', event => {
    let id = getItemIdFromElement(event.currentTarget);
    let name = window.prompt('please edit the selected item');
    updateItemName(id, name);
    renderShoppingList();
  })
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideFilter();
  handleSearchSubmit();
  handleNameUpdate();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);