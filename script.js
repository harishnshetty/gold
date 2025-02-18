const sheetId = "1HJlPhChfQUqIxFfRKGx5JksOY7CMB8unPZkFmJ1y-6o";
const apiKey = "AIzaSyA6msL2TJ6OKT1vAtzPB6kEY8y4ZFpWsiU";
const sheetName = "Sheet1";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        let rows = data.values.slice(1).reverse(); // Reverse to show latest first
        console.log("Fetched Data:", rows);

        const sortOrder = document.getElementById("sortOrder").value;

        if (sortOrder === "low-to-high") {
            rows.sort((a, b) => parseFloat(a[2]) - parseFloat(b[2])); // Sort by price ascending
        } else if (sortOrder === "high-to-low") {
            rows.sort((a, b) => parseFloat(b[2]) - parseFloat(a[2])); // Sort by price descending
        }

        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        rows.forEach((row, index) => {
            const serialNumber = rows.length - index;
            const name = row[1];
            const price = parseFloat(row[2]);
            const discountedPrice = (price * 0.5).toFixed(2);
            const discountPercent = 50;
            const fullDescription = row[4] || "Beautiful handcrafted jewelry.";
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
            title.textContent = `${serialNumber}. ${name}`;

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
                const currentPageLink = window.location.href;
                const message = `🔥 -50% OFF | 6 months warranty \nSerial No: ${serialNumber} \nCheck this out: ${name} \n\nDiscounted Price: ₹${discountedPrice} \n${imageUrls[0]} \n \nView more: ${currentPageLink}`;
                const whatsappUrl = `http://wa.me/+918073562972?text=${encodeURIComponent(message)}`;
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
