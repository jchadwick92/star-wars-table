// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx
import {Character} from "./types";
import {calculateCharacterPower, fetchAllCharacters} from "./common";

export async function runVanillaApp() {
    const characters = await fetchAllCharacters();
    populateTableBody(characters);
    setupFilter();
    setupMultiplier();
    setupEscapeListener();
}

function setupFilter() {
    const filterInputEl = document.getElementById('filter') as HTMLInputElement;
    filterInputEl.addEventListener('input', (e) => {
        const filter = (e.target as HTMLInputElement).value.toLowerCase();
        const tbodyEl = document.getElementsByTagName('tbody')[0];
        const trTags = tbodyEl.childNodes;
        for (let i=0; i < trTags.length; i++) {
            const row = trTags[i] as HTMLElement;
            const name = row.children[0].innerHTML
            row.style.display = name.toLowerCase().indexOf(filter) > -1 ? '' : 'none'
        }
    });
}

function setupMultiplier() {
    const multiplierInputEl = document.getElementById('multiplier') as HTMLInputElement;
    multiplierInputEl.addEventListener('input', (e) => {
        const multiplier = (e.target as HTMLInputElement).value;
        const tbodyEl = document.getElementsByTagName('tbody')[0];
        const trTags = tbodyEl.childNodes;
        for (let i=0; i < trTags.length; i++) {
            const row = trTags[i] as HTMLElement;
            const height = row.getElementsByClassName('height')[0].innerHTML;
            const mass = row.getElementsByClassName('mass')[0].innerHTML;
            row.getElementsByClassName('power')[0].innerHTML = calculateCharacterPower(height, mass, multiplier);
        }
    });
}

function setupEscapeListener() {
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            resetFilter();
            resetMultiplier();
        }
    })
}

function resetFilter() {
    const inputEvent = new Event('input');
    const filterInputEl = document.getElementById('filter') as HTMLInputElement;
    filterInputEl.value = "";
    filterInputEl.dispatchEvent(inputEvent);
}

function resetMultiplier() {
    const inputEvent = new Event('input');
    const multiplierInputEl = document.getElementById('multiplier') as HTMLInputElement;
    multiplierInputEl.value = multiplierInputEl.defaultValue;
    multiplierInputEl.dispatchEvent(inputEvent);
}

function hideLoader() {
    const loaderEl = document.getElementById('loader') as HTMLInputElement;
    loaderEl.style.display = 'none';
}

function populateTableBody(characters: Character[]) {
    hideLoader();
    const tbodyEl = document.getElementsByTagName('tbody')[0];
    const multiplierInputEl = document.getElementById('multiplier') as HTMLInputElement;
    const multiplierDefaultValue = multiplierInputEl.defaultValue;
    characters.forEach(character => {
        const tr = document.createElement('tr');
        tbodyEl.appendChild(tr);
        appendCell(tr, character.name, 'name');
        appendCell(tr, character.height, 'height');
        appendCell(tr, character.mass, 'mass');
        appendCell(tr, calculateCharacterPower(character.height, character.mass, multiplierDefaultValue), 'power');
    });
    resetFilter();
    resetMultiplier();
}

function appendCell(rowEl: HTMLElement, text: string, className: string) {
    const firstCell = document.createElement('td');
    firstCell.className = className;
    firstCell.innerHTML = text;
    rowEl.appendChild(firstCell);
}

