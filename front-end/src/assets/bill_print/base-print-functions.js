let title, data;

// internal
function valorizeValue(id) {
  const el = document.getElementById(id);
  const value = data[id];

  if (el && value) {
    el.innerHTML = value;
  }
}

// internal
function createEl(type, parent, clas, content) {
  const element = document.createElement(type);
  element.classList.add(clas);

  if (content) {
    element.innerHTML = content;
  }

  parent.appendChild(element);
  return element;
}

// internal
function elementExist(id) {
  return !!document.getElementById(id);
}

// from parent
function setData(newData) {
  data = newData;

  /**
   * Valorizzo tutti i possibili valori. Se non sono presenti
   * l'elemento nel dom o il valore, la funzione non fa nulla
   */
  // summary
  valorizeValue("title");
  valorizeValue("orderNumber");
  valorizeValue("total");
  valorizeValue("date");

  /**
   * Per ogni prodotto istanzio dinamicamente una riga.
   * Se non esiste l'id dell'header non metto la colonna.
   */
  for (let p of data.products || []) {
    const parentElement = document.getElementById("products-wrapper");
    const wrapper = createEl("div", parentElement, "product-wrapper");

    if (elementExist("product-description-header")) {
      createEl("span", wrapper, "product-description", p.description);
    }

    if (elementExist("product-quantity-header")) {
      createEl("span", wrapper, "product-quantity", p.quantity);
    }

    if (elementExist("product-price-header")) {
      createEl("span", wrapper, "product-price", p.price);
    }
  }
}

// from parent
function printBill() {
  /**
   * Stampo solo se ho effettivamente qualcosa da stampare
   */
  if (data.products.length > 0) {
    window.print();
    window.location.reload();
  }
}
