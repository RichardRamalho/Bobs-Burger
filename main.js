// ----- VARIABLES ----- //

const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartItemsTotal = document.getElementById("cart-total");
const checkBtn = document.getElementById("check-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressError = document.getElementById("address-error");

let cart = [];

cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";

  updateCartModal();
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existItem = cart.find((item) => item.name === name);

  if (existItem) {
    existItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p> Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2 mb-2"> R$${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>
                
            </div>
        `
        total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  })

  cartItemsTotal.textContent = total.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener('click', function(event) {
    if(event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index]

        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value

    if(inputValue !== "") {
      addressError.classList.add("hidden")
    }
})

checkBtn.addEventListener('click', function() {
    const isOpen = openToWork();
    if(!isOpen) {
      Toastify({
        text: "Ops, ainda não abrimos!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "#ef4444",
        },
        onClick: function(){}
      }).showToast();

      return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === "") {
        addressError.classList.remove("hidden")
        return;
    }

    const cartItems = cart.map((item) => {
      return(
        `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)} |`
      )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5511994680346"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

function openToWork() {
  const data = new Date();
  const hours = data.getHours();
  return hours >= 18 && hours < 23;
}

const spanItem = document.getElementById("date-span");
const isOpen = openToWork();

if(isOpen) {
  spanItem.classList.remove("bg-red-600");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-600");
}
