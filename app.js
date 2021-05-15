// Contact contructor
function Contact(name, number, email, birthday) {
  this.name = name;
  this.number = number;
  this.email = email;
  this.birthday = birthday;
}

// Main UI fucntion
function UI() {}

// Local storage
function Store() {}

// Add Contact
UI.prototype.addContact = function (contact) {
  const contactList = document.querySelector(".contact__lists-section");

  // Create list
  const list = document.createElement("li");
  list.classList = "contact__list";

  list.innerHTML = `
            <h2 class="contact__name">${contact.name}</h2>
            <p class="contact__number">${contact.number}</p>
            <p class="contact__email">${contact.email}</p>
            <p class="contact__birthdate">Birthday: ${contact.birthday}</p>

            <button class="contact__delete">
                <i class="fas fa-trash"></i>
            </button>
  `;
  // Append list
  contactList.appendChild(list);
};

// Form Validation
UI.prototype.formValidation = function (contactEl, contactValue) {
  // Contact array
  let contact = {};

  // Instantiate UI
  const ui = new UI();
  const store = new Store();

  // Name
  if (contactValue.name === "") {
    ui.showError(contactEl.name, "Name cannot be empty");
  } else {
    contact.name = contactValue.name;
  }

  // Phone
  if (contactValue.number === "") {
    ui.showError(contactEl.number, "Phone number cannot be empty");
  } else {
    contact.number = contactValue.number;
  }

  // Email
  if (contactValue.email === "") {
    ui.showError(contactEl.email, "Email cannto be empty");
  } else if (!/\S+\@+\S+\.+\S+/.test(contactValue.email)) {
    ui.showError(contactEl.email, "Enter a valid email.");
  } else {
    contact.email = contactValue.email;
  }

  // Birthday
  if (contactValue.birthday === "") {
    ui.showError(contactEl.birthday, "Birtday cannot be empty");
  } else {
    contact.birthday = contactValue.birthday;
  }

  // Add contact to the list
  if (Object.keys(contact).length === Object.keys(contactEl).length) {
    // Add contact to the list
    ui.addContact(contact);
    // Show message
    ui.showMessage("Added Contact.");
    // Add local storage
    store.addLocalStorage(contact);
  }
};

// Show Error
UI.prototype.showError = function (action, text) {
  const inputGroup = action.parentElement;

  const span = document.createElement("span");
  span.className = "error";
  span.innerText = text;

  inputGroup.appendChild(span);

  // Display none
  setTimeout(() => {
    span.remove();
  }, 1000);
};

// Show message
UI.prototype.showMessage = function (text) {
  const formSection = document.querySelector(".form");

  const span = document.createElement("span");
  span.classList = "message";
  span.innerText = text;

  let sibling = formSection.firstElementChild.nextElementSibling;

  formSection.insertBefore(span, sibling);

  // Remove span after show alert
  setTimeout(() => {
    span.remove();
  }, 1000);
};

// Clear fields
UI.prototype.clearFields = function (contact) {
  contact.name.value = "";
  contact.number.value = "";
  contact.email.value = "";
  contact.birthday.value = "";
};

// Delete contact
UI.prototype.deleteContact = function (button) {
  if (
    button.tagName.toLowerCase() === "i" &&
    button.classList.contains("fa-trash")
  ) {
    const parent = button.parentElement.parentElement;
    const number = parent.querySelector(".contact__number").textContent;

    // Remove
    parent.remove();

    // Remove from local storage
    const store = new Store();
    store.removeFromStorage(number);
    // Show Message
    this.showMessage("Deleted Contact.");
  }
};

// Search Contact
UI.prototype.searchContact = function (text) {
  const lists = document.querySelectorAll(".contact__list");

  lists.forEach((list) => {
    let name = list.firstElementChild.textContent.toLowerCase();

    if (!name.includes(text.toLowerCase())) {
      list.style.display = "none";
    } else {
      list.style.display = "block";
    }
  });
};

// Add local storage
Store.prototype.addLocalStorage = function (contact) {
  let contactArray = this.getLocalStorage();

  contactArray.push(contact);

  localStorage.setItem("contacts", JSON.stringify(contactArray));
};

// Get Local storage
Store.prototype.getLocalStorage = function () {
  return localStorage.getItem("contacts")
    ? JSON.parse(localStorage.getItem("contacts"))
    : [];
};

// Display from local storage
UI.prototype.showFromStorage = function () {
  const ui = new UI();
  const store = new Store();
  let contactArray = store.getLocalStorage();

  if (contactArray.length > 0) {
    contactArray.forEach((contact) => {
      ui.addContact(contact);
    });
  }
};

// Remove from local storage
Store.prototype.removeFromStorage = function (number) {
  let contactArray = this.getLocalStorage();

  contactArray.forEach((contact, index) => {
    if (contact.number === number) {
      contactArray.splice(index, 1);
    }
  });
  localStorage.setItem("contacts", JSON.stringify(contactArray));
};

// ===== Event ==== //

// Show from local storage when loaded
window.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();

  ui.showFromStorage();
});

// Form submit
const form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Instantiate UI
  const ui = new UI();

  // Contact elements
  const contactEl = {
    name: document.querySelector("#input__name"),
    number: document.querySelector("#input__number"),
    email: document.querySelector("#input__email"),
    birthday: document.querySelector("#input__birthday"),
  };

  // Get values
  nameValue = contactEl.name.value;
  numberValue = contactEl.number.value;
  emailValue = contactEl.email.value;
  birthdayValue = contactEl.birthday.value;

  // Instantiate the Contact
  const contact = new Contact(
    nameValue,
    numberValue,
    emailValue,
    birthdayValue
  );

  // Validation
  ui.formValidation(contactEl, contact);

  // Clear fields
  ui.clearFields(contactEl);
});

// Delete contact list
document.addEventListener("click", (e) => {
  const ui = new UI();

  // Delete
  ui.deleteContact(e.target);
});

// Search contact
const search = document.querySelector("#input__search");

search.addEventListener("keyup", (e) => {
  const ui = new UI();

  // Search value
  ui.searchContact(e.target.value);
});
