const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const message = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
    for (let code in countryList) {
        let newoption = document.createElement("option");
        newoption.innerText = code;
        newoption.value = code;
        if (select.name === "from" && code === "USD") {
            newoption.selected = true;
        } else if (select.name === "to" && code === "INR") {
            newoption.selected = true;
        }
        select.append(newoption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Fetch exchange rates using new API structure
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtval = amount.value.trim();
    if (!amtval || amtval < 1) {
        amtval = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}/${fromcurr.value.toLowerCase()}.json`;

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Failed to fetch data");

        let data = await response.json();
        let rate = data[fromcurr.value.toLowerCase()][tocurr.value.toLowerCase()];

        if (!rate) {
            message.innerText = "Exchange rate not available.";
            return;
        }

        let finalamount = amtval * rate;
        message.innerText = `${amtval} ${fromcurr.value} = ${finalamount.toFixed(2)} ${tocurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        message.innerText = "Error fetching exchange rate. Please try again.";
    }
};

// Update flag images
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    if (!countryCode) return; // Prevent errors if country code is missing

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");

    if (img) img.src = newSrc; // Update only if the image exists
};


btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});


document.querySelector("form").addEventListener("submit", (evt) => {
    evt.preventDefault();
});


window.addEventListener("load", () => {
    updateExchangeRate();
});
