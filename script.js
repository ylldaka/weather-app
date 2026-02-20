document.addEventListener("DOMContentLoaded", () => {
  const inputEl =
    document.getElementById("input") || document.getElementById("myInputField");
  if (!inputEl) {
    console.warn(
      'No input element found with id "input" or "myInputField". Pressing Enter will not trigger weather().',
    );
    return;
  }

  inputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      weather();
    }
  });
});

async function api() {
  const input = document.getElementById("input").value;
  const cUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=dac9beecd7853eb72ba0db308514ffb4`;

  try {
    const response = await fetch(cUrl);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();

    if (!data || data.length === 0) {
      alert("this city doesnt exist");
      return null;
    }

    const lonc = data[0].lon;
    const latc = data[0].lat;
    console.log("coords from api():", lonc, latc);
    document.getElementById("c-name").innerHTML = input;

    return { lon: lonc, lat: latc };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function weather() {
  const cor = await api();
  console.log("coords received in weather():", cor);

  if (!cor) {
    return;
  }

  const { lon, lat } = cor;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=dac9beecd7853eb72ba0db308514ffb4`,
    );
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    const impoImg = document.getElementById("impoImg");
    console.log(data);
    // let type=data,
    console.log(Math.round(data.main.temp - 273));
    document.getElementById("deg").innerHTML =
      `${Math.round(data.main.temp - 273)}°C`;
    let weatherType = data.weather[0].main;

    document.getElementById("wether").innerHTML = weatherType;
    impoImg.src = `${weatherType}.png`;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
