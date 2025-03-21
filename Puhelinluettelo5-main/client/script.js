(() => {
  fetch("http://localhost:3000/items")
    .then((res) => res.json())
    .then((data) => {
      displayUser(data);
    });
})();

const userDisplay = document.querySelector(".table"); // Haetaan taulukko elementti

displayUser = (data) => {
  userDisplay.innerHTML += `
    <thrad>
        <tr>
            <th>ID</th>
            <th>Nimi</th>
            <th>Puhelin</th>
        </tr>
    
    </thead>
    `;
  displayRow(data);
};

displayRow = (data) => {
  data.forEach((user) => {
    userDisplay.innerHTML += `
        <tbody>
        <tr>
            <td>${user.id}</td>
            <td>${user.nimi}</td>
            <td>${user.puhelin}</td>
        </tr>
        </tbody>
        `;
  });
};
