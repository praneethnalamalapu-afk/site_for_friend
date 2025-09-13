 // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    fetch("products.json")
      .then(res => res.json())
      .then(products => {
        const product = products.find(p => p.id == productId);

        if(product){
          document.getElementById("product-img").src = product.image;
          document.getElementById("product-name").innerText = product.name;
          document.getElementById("product-desc").innerText = product.description;
          document.getElementById("product-price").innerText = product.price;
          document.getElementById("product-id").innerText = product.productId;
        }

        
        
document.addEventListener("DOMContentLoaded", function() {
  const mainImage = document.getElementById("mainImage");
  const zoomLens = document.getElementById("zoomLens");
  const zoomResult = document.getElementById("zoomResult");

  // When hovering image
  mainImage.addEventListener("mouseenter", () => {
    zoomLens.style.display = "block";
    zoomResult.style.display = "block";
    zoomResult.style.backgroundImage = `url(${mainImage.src})`;
  });

  mainImage.addEventListener("mouseleave", () => {
    zoomLens.style.display = "none";
    zoomResult.style.display = "none";
  });

  mainImage.addEventListener("mousemove", moveLens);
  zoomLens.addEventListener("mousemove", moveLens);

  function moveLens(e) {
    e.preventDefault();

    const pos = getCursorPos(e);
    let x = pos.x - zoomLens.offsetWidth / 2;
    let y = pos.y - zoomLens.offsetHeight / 2;

    // Prevent lens from going outside
    if (x > mainImage.width - zoomLens.offsetWidth) x = mainImage.width - zoomLens.offsetWidth;
    if (x < 0) x = 0;
    if (y > mainImage.height - zoomLens.offsetHeight) y = mainImage.height - zoomLens.offsetHeight;
    if (y < 0) y = 0;

    zoomLens.style.left = x + "px";
    zoomLens.style.top = y + "px";

    // Calculate zoom
    const cx = zoomResult.offsetWidth / zoomLens.offsetWidth;
    const cy = zoomResult.offsetHeight / zoomLens.offsetHeight;

    zoomResult.style.backgroundSize = (mainImage.width * cx) + "px " + (mainImage.height * cy) + "px";
    zoomResult.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
  }

  function getCursorPos(e) {
    const rect = mainImage.getBoundingClientRect();
    return {
      x: e.pageX - rect.left - window.pageXOffset,
      y: e.pageY - rect.top - window.pageYOffset
    };
  }
});



        // Load Recommended (other products except current)
        let recContainer = document.getElementById("recommended-list");
        products
          .filter(p => p.id != productId)
          .forEach(p => {
            let card = document.createElement("div");
            card.classList.add("rec-card");
            card.innerHTML = `
              <img src="${p.image}" alt="${p.name}">
              <h4>${p.name}</h4>
              <p>${p.price}</p>
            `;
            // Clicking opens its details page
            card.onclick = () => {
              window.location.href = `products_.html?id=${p.id}`;
            };
            recContainer.appendChild(card);
          });
});

function goToOrderPage() {
  const productId = document.getElementById("product-id").innerText; // product id from details
  const productName = document.getElementById("product-name").innerText; // product name
  const productPrice = document.getElementById("product-price").innerText; // product price
  const productImg = document.getElementById("product-img").src; // product image

  // send all details in URL
  window.location.href = `order.html?id=${encodeURIComponent(productId)}&name=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}&image=${encodeURIComponent(productImg)}`;
}