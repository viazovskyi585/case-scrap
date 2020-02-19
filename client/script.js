"use strict";
const select = document.querySelector(".js-select");
const input = document.querySelector(".js-case");
const submitButton = document.querySelector(".js-submit");
const infoContainer = document.querySelector(".js-info-container");
const preloader = document.querySelector(".preloader");

submitButton.addEventListener("click", function() {
    const court = select.value;
    const caseID = encodeURIComponent(input.value);
    getData(court, caseID);
});

const getData = async (court, caseID) => {
    submitButton.disabled = true;
    preloader.classList.remove("hidden");
    const data = await fetch(`/api/${court}/${caseID}`);
    const info = await data.json();

    const row = `
          <tr role="row">
            <th tabindex="0" rowspan="1" colspan="1">${info.date}</th>
            <th tabindex="0" rowspan="1" colspan="1">${info.name}</th>
            <th tabindex="0" rowspan="1" colspan="1">${info.id}</th>
            <th tabindex="0" rowspan="1" colspan="1">${info.sides}</th>
            <th tabindex="0" rowspan="1" colspan="1">${info.content}</th>
            <th tabindex="0" rowspan="1" colspan="1">${info.type}</th>
            <th tabindex="0" rowspan="1" colspan="1">${info.hall}</th>
        </tr>
          `;
    infoContainer.innerHTML += row;
    submitButton.disabled = false;
    preloader.classList.add("hidden");
};
