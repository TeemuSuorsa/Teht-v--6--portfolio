(loadPage = () => {
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
              <th>Poista</th>
              <th>Muokkaa</th>
              <th>Muokattava numero</th>
              <th>Tallenna</th>
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
              <td id="name${user.id}">${user.nimi}</td>
              <td id="phone${user.id}">${user.puhelin}</td>     
              <td><input type="button" OnClick="removeRow(${user.id})" value="X"/> </td>
              <td><input type="button" OnClick="editButton(${user.id})" value="Muokkaa"/> </td>
              <td><input type="text" id="input${user.id}" value="${user.puhelin}" style="display:none;"></td>
              <td><input type="button" id="update${user.id}"  onClick="updateNumber(${user.id})" value="Tallenna" style="display:none;"></td>
          </tr>
          </tbody>
          `;
  });
};

removeRow = async (id) => {
  console.log(id);
  // Simple DELETE request with fetch
  let polku = "http://localhost:3000/items/" + id;
  await fetch(polku, { method: "DELETE" }).then(() =>
    console.log("Poisto onnistui")
  );
  window.location.reload(); //ladataan ikkuna uudelleen
};
// Muokkaa painike "avaa" tekstikentän sekä tallenna napin
editButton = async (id) => {
  if (document.getElementById("input" + id).style.display === "none") {
    document.getElementById("input" + id).style.display = "block";
    document.getElementById("update" + id).style.display = "block";
  } else {
    document.getElementById("input" + id).style.display = "none";
    document.getElementById("update" + id).style.display = "none";
  }
};
const updateNumber = async (id) => {
  let uusiPuhelin = document.getElementById(`input${id}`).value; // Haetaan tekstikentästä
  let polku = `http://localhost:3000/items/${id}`;
  let nameElement = document.getElementById(`name${id}`).innerText; // Haetaan nimi elementti

  const response = await fetch(polku, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // Lähetetään päivitetty numero ja nimi
    body: JSON.stringify({ nimi: nameElement, puhelin: uusiPuhelin }),
  });

  if (response.ok) {
    console.log("Päivitys onnistui");
    const updatedUser = await response.json();
    // Päivitetään päivitetty numero taulukossa
    document.getElementById(`phone${id}`).innerText = uusiPuhelin;

    // Piilotetaan tekstikenttä sekä tallenna nappi
    document.getElementById(`input${id}`).style.display = "none";
    document.getElementById(`update${id}`).style.display = "none";
  } else {
    console.error("Virhe päivityksessä");
  }
};

async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response.json();
}

async function handleFormSubmit(event) {
  event.preventDefault(); // Estetään lomakkeen lähettäminen, estää lomakkeen oletustapahtuman

  const form = event.currentTarget; //tapahtuman kohde eli lomake
  const url = form.action; //lomakkeen action attribuutti eli minne lomake lähetetään

  try {
    const formData = new FormData(form); //Luodaan uusi FormData olio ja annetaan sille lomake
    const responseData = await postFormDataAsJson({ url, formData }); //Kutsutaan funktiota ja annetaan sille url ja formData
    await loadPage(); //Ladataan sivu uudelleen
    console.log({ responseData }); //Tulostetaan responseData
  } catch (err) {
    console.error(error);
  }
}

const exampleForm = document.getElementById("puhelintieto_lomake"); //Haetaan lomake
exampleForm.addEventListener("submit", handleFormSubmit); //Kuunnellaan lomakkeen lähettämistä ja kutsutaan handleFormSubmit funktiota
