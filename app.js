document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");
  const fromCurrency = document.getElementById("from-currency");
  const toCurrency = document.getElementById("to-currency");
  const fromFlag = document.getElementById("from-flag");
  const toFlag = document.getElementById("to-flag");
  const resultBox = document.getElementById("result");
  const form = document.getElementById("converter-form");
  const swapBtn = document.getElementById("swap");
  const toggleBtn = document.getElementById("mode-toggle");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });


  const apiKey = "cur_live_mEwDk02asShULvkc4D9fRAjVdtskjXmQEb8Ym9TJ";

  // Populate dropdowns
  for (let currencyCode in countryList) {
    const countryCode = countryList[currencyCode];

    const option1 = document.createElement("option");
    option1.value = currencyCode;
    option1.textContent = currencyCode;
    fromCurrency.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currencyCode;
    option2.textContent = currencyCode;
    toCurrency.appendChild(option2);
  }

  // Set default selections
  fromCurrency.value = "USD";
  toCurrency.value = "INR";

  updateFlags();

  fromCurrency.addEventListener("change", updateFlags);
  toCurrency.addEventListener("change", updateFlags);

  swapBtn.addEventListener("click", () => {
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
    updateFlags();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
      resultBox.textContent = "Please enter a valid amount.";
      return;
    }

    try {
      const res = await fetch(
        `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${from}`
      );
      const data = await res.json();
      const rate = data.data[to]?.value;

      if (!rate) {
        resultBox.textContent = "Currency not supported.";
        return;
      }

      const converted = (amount * rate).toFixed(2);
      resultBox.textContent = `${amount} ${from} = ${converted} ${to}`;
    } catch (err) {
      console.error(err);
      resultBox.textContent = "Failed to fetch conversion rate.";
    }
  });

  function updateFlags() {
    const fromCode = countryList[fromCurrency.value];
    const toCode = countryList[toCurrency.value];

    fromFlag.src = `https://flagsapi.com/${fromCode}/flat/64.png`;
    toFlag.src = `https://flagsapi.com/${toCode}/flat/64.png`;
  }
});
