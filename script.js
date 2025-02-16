const sheetId = "1_pKpJnNG66rHfO3KnffE85tX-0iHuhN4-pKgn6UT8tw";
const apiKey = "AIzaSyBwnJTt3tZV61gebywzYb8MIDk4CTcleHQ";
const sheetName = "Sheet1";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const rows = data.values.slice(1).reverse(); // Reverse to show latest first
        console.log("Fetched Data:", rows);

        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous content

        rows.forEach(row => {
            const name = row[1]; // Jewelry Name
            const price = parseFloat(row[2]); // Original Price
            const discountedPrice = (price * 0.5).toFixed(2); // 50% Discounted Price
            const discountPercent = 50;
            const fullDescription = row[4] || "Beautiful handcrafted jewelry."; // ✅ Full description
            let shortDescription = fullDescription.length > 50 ? fullDescription.substring(0, 50) + "..." : fullDescription;

            const imageUrls = row[3].split(", ").map(link =>
                link.replace("https://drive.google.com/open?id=", "https://lh3.googleusercontent.com/d/")
            );

            function redirectToProductPage() {
                const queryString = `product.html?name=${encodeURIComponent(name)}&price=${encodeURIComponent(discountedPrice)}&description=${encodeURIComponent(fullDescription)}&images=${encodeURIComponent(imageUrls.join(","))}`;
                window.location.href = queryString;
            }

            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.style.cursor = "pointer";
            productItem.onclick = redirectToProductPage;

            const imgContainer = document.createElement("div");
            imgContainer.classList.add("image-slider");

            const img = document.createElement("img");
            let currentIndex = 0;
            img.src = imageUrls[currentIndex];
            img.alt = name;

            imgContainer.onclick = redirectToProductPage;

            if (imageUrls.length > 1) {
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % imageUrls.length;
                    img.src = imageUrls[currentIndex];
                }, 2000);
            }

            imgContainer.appendChild(img);

            const productDetails = document.createElement("div");
            productDetails.classList.add("product-details");

            const title = document.createElement("h3");
            title.textContent = name;

            const priceSection = document.createElement("div");
            priceSection.classList.add("price-section");

            const priceInfo = document.createElement("p");
            priceInfo.classList.add("price-info");
            priceInfo.innerHTML = `<span class="discount-text">↓${discountPercent}%</span> <del>₹${price}</del> <strong>₹${discountedPrice}</strong>`;

            const detailsPara = document.createElement("p");
            detailsPara.classList.add("product-details-text");
            detailsPara.innerText = shortDescription;

            const hotDeal = document.createElement("p");
            hotDeal.classList.add("hot-deal");
            hotDeal.textContent = "🔥Hot Deal";

            const shareBtn = document.createElement("button");
            shareBtn.textContent = "Share";
            shareBtn.onclick = (event) => {
                event.stopPropagation();
                const currentPageLink = window.location.href; // Get current page URL
                const message = `Check this out: ${name} \nOriginal Price: ₹${price} \nDiscounted Price: ₹${discountedPrice} \n${imageUrls[0]} \nView more: ${currentPageLink}`;
                const whatsappUrl = `http://wa.me/+917795383476?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
            };

            priceSection.appendChild(priceInfo);
            productDetails.appendChild(title);
            productDetails.appendChild(priceSection);
            productDetails.appendChild(detailsPara);
            productDetails.appendChild(hotDeal);
            productDetails.appendChild(shareBtn);

            productItem.appendChild(imgContainer);
            productItem.appendChild(productDetails);
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchData();
