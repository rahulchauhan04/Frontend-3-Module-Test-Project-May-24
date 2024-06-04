const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
let data = [];

// Fetch data using async/await
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const apiData = await response.json();
    console.log(apiData); // Add this line to check the fetched data
    data = apiData;
    renderTable(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();

function renderTable(data) {
  const tableBody = document.querySelector('#data-table tbody');
  tableBody.innerHTML = ''; // Clear existing data

  data.forEach(item => {
    const row = document.createElement('tr');
    row.classList.add('table-row'); // Add animation class
    const percentageChangeClass = item.price_change_percentage_24h >= 0 ? 'positive' : 'negative';

    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}">${item.name}</td>
      <td>${item.symbol.toUpperCase()}</td>
      <td>$${item.current_price.toLocaleString()}</td>
      <td>$${item.total_volume.toLocaleString()}</td>
      <td class="${percentageChangeClass}">${item.price_change_percentage_24h.toFixed(2)}%</td>
      <td>Mkt Cap: $${item.market_cap.toLocaleString()}</td>
    `;
    
    // Add event listener for click effect
    row.addEventListener('click', () => {
      document.querySelectorAll('.table-row').forEach(r => r.classList.remove('clicked'));
      row.classList.toggle('clicked');
    });

    tableBody.appendChild(row);
  });
}

function searchData() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const filteredData = data.filter(item => item.name.toLowerCase().includes(searchInput) || item.symbol.toLowerCase().includes(searchInput));
  renderTable(filteredData);
}

function sortData(criteria) {
  let sortedData;
  if (criteria === 'market_cap') {
    sortedData = [...data].sort((a, b) => b.market_cap - a.market_cap);
  } else if (criteria === 'percentage_change') {
    sortedData = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  }
  renderTable(sortedData);
}

document.getElementById('search-input').addEventListener('input', searchData);