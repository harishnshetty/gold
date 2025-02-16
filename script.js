const sheetId = "1_pKpJnNG66rHfO3KnffE85tX-0iHuhN4-pKgn6UT8tw";
const apiKey = "AIzaSyBwnJTt3tZV61gebywzYb8MIDk4CTcleHQ";
const sheetName = "Sheet1";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const rows = data.values.slice(1);
        console.log("Fetched Data:", rows);

        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous content

        rows.forEach(row => {
            const name = row[1]; // Jewelry Name
            const price = parseFloat(row[2]); // Original Price
            const discountedPrice = (price * 0.5).toFixed(2); // 50% Discounted Price
            const description = row[4] || "Beautiful handcrafted jewelry."; // Description (Modify column if needed)
            const imageUrls = row[3].split(", ").map(link =>
                link.replace("https://drive.google.com/open?id=", "https://lh3.googleusercontent.com/d/")
            );

            // Create product item div
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");

            // Image container with slideshow effect
            const imgContainer = document.createElement("div");
            imgContainer.classList.add("image-slider");

            const img = document.createElement("img");
            let currentIndex = 0;
            img.src = imageUrls[currentIndex];
            img.alt = name;
            img.style.cursor = "pointer"; // Show pointer on hover

            // Redirect to product.html on click with images, price, and description
            img.onclick = () => {
                const queryString = `product.html?name=${encodeURIComponent(name)}&price=${encodeURIComponent(discountedPrice)}&description=${encodeURIComponent(description)}&images=${encodeURIComponent(imageUrls.join(","))}`;
                window.location.href = queryString;
            };

            // Auto slide images every 2 seconds
            if (imageUrls.length > 1) {
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % imageUrls.length;
                    img.src = imageUrls[currentIndex];
                }, 2000);
            }

            imgContainer.appendChild(img);

            // Add product details
            const title = document.createElement("h3");
            title.textContent = name;

            const priceInfo = document.createElement("p");
            priceInfo.innerHTML = `<del>₹${price}</del> <strong>₹${discountedPrice}</strong> <span class="discount-label">(-50%)</span>`;

            // WhatsApp share button
            const shareBtn = document.createElement("button");
            shareBtn.textContent = "Share";
            shareBtn.onclick = () => {
                const message = `Check this out: ${name} \nOriginal Price: ₹${price} \nDiscounted Price: ₹${discountedPrice} \n${imageUrls.join("\n")}`;
                const whatsappUrl = `https://wa.me/+917795383476?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
            };

            // Append elements
            productItem.appendChild(imgContainer);
            productItem.appendChild(title);
            productItem.appendChild(priceInfo);
            productItem.appendChild(shareBtn);
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call function to load data
fetchData();
