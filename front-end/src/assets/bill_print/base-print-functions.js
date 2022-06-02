let onDestroy;

// internal
function valorizeValue(id, data) {
  const el = document.getElementById(id);
  const value = data[id];

  if (el && value) {
    el.innerHTML = value;
  }
}

// internal
function setProductColumn(wrapper, product, colName) {
  if (elementExist("product-" + colName + "-header")) {
    createEl("span", wrapper, "product-" + colName, product[colName]);
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
function registerOnDestroy(_onDestroy) {
  onDestroy = _onDestroy;
}

// from parent
function setData(data) {
  /**
   * Valorizzo tutti i possibili valori. Se non sono presenti
   * l'elemento nel dom o il valore, la funzione non fa nulla
   */
  // summary
  valorizeValue("title", data);
  valorizeValue("orderNumber", data);
  valorizeValue("total", data);
  valorizeValue("date", data);

  /**
   * Per ogni prodotto istanzio dinamicamente una riga.
   * Se non esiste l'id dell'header non metto la colonna.
   */
  for (let p of data.products || []) {
    const parentElement = document.getElementById("products-wrapper");
    const wrapper = createEl("div", parentElement, "product-wrapper");

    setProductColumn(wrapper, p, "description");
    setProductColumn(wrapper, p, "quantity");
    setProductColumn(wrapper, p, "price");
  }
}

// from parent
function printBill() {
  window.print();
  setTimeout(() => onDestroy(), 1 * 1000);
}
