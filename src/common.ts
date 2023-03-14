import {Character, CharactersResponse} from "./types";

export function fetchAllCharacters() {
    let firstPageCharacters: Character[];
    return fetchCharactersByPage()
        .then(({count, results}) => {
            firstPageCharacters = results;
            const totalPages = Math.ceil((count) /10);
            let promises = [];
            for (let i=2; i <= totalPages; i++) {
                promises.push(fetchCharactersByPage(i));
            }
            return Promise.all(promises);
        })
        .then(characterResponses => characterResponses
            .reduce((acc, curr) => ([...acc, ...curr.results]), firstPageCharacters)
        )
}

function fetchJson<T>(url: string) {
    return fetch(url).then(res => res.json() as Promise<T>);
}

function fetchCharactersByPage(page?: number) {
    const urlQuery = page ? `&page=${page}` : '';
    return fetchJson<CharactersResponse>(`https://swapi.dev/api/people/?format=json${urlQuery}`)
}

export function calculateCharacterPower(height: string, mass: string, multiplier: string) {
    const heightAsNumber = Number(height);
    const massAsNumber = Number(mass);
    const multiplierAsNumber = Number(multiplier);
    if (isNaN(heightAsNumber) || isNaN(massAsNumber) || isNaN(multiplierAsNumber)) {
        return '-';
    }
    return (heightAsNumber * massAsNumber * multiplierAsNumber).toFixed().toString();
}