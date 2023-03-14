import {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {calculateCharacterPower, fetchAllCharacters} from "./common";
import {Character} from "./types";

const defaultMultiplier = '10';

function FunctionalComp() {
    const [allCharacters, setAllCharacters] = useState<Character[]>([]);
    const [filter, setFilter] = useState('');
    const [multiplier, setMultiplier] = useState(defaultMultiplier);
    useEffect(() => {
        fetchAllCharacters().then(data => setAllCharacters(data));
    }, []);
    useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setFilter('');
                setMultiplier(defaultMultiplier);
            }
        }
        document.addEventListener('keyup', handleKeyUp);
        return () => document.removeEventListener('keyup', handleKeyUp);
    }, []);

    const filteredCharacters = allCharacters.filter(character => character.name.toLowerCase().indexOf(filter.toLowerCase()) > -1);

    return (
        <div id="functional-comp">
            <h2>React Functional Component</h2>
            <Filter value={filter} setValue={setFilter}/>{" "}
            <Multiplier value={multiplier} setValue={setMultiplier}/>{" "}
            Press "Escape" to reset fields
            {!allCharacters.length && <div className="loader">Loading...</div>}
            <CharacterTable characters={filteredCharacters} multiplier={multiplier} />
        </div>
    );
}

interface FilterProps {
    value: string,
    setValue: Dispatch<SetStateAction<string>>
}

function Filter({value, setValue}: FilterProps) {
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }
    return (
        <>Filter: <input placeholder="Filter by name" value={value} onChange={handleOnChange}/></>
    )
}

interface MultiplierProps {
    value: string,
    setValue: Dispatch<SetStateAction<string>>
}

function Multiplier({value, setValue}: MultiplierProps) {
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }
    return (
        <>Multiplier:{" "}
            <input
                placeholder="Multiplier"
                type="number"
                min="1"
                max="20"
                value={value}
                onChange={handleOnChange}
            />
        </>
    )
}

interface CharacterTableProps {
    characters: Character[]
    multiplier: string
}

function CharacterTable({characters, multiplier}: CharacterTableProps) {
    return (
        <table width="100%">
            <thead>
            <tr>
                <th>Name</th>
                <th>Height</th>
                <th>Mass</th>
                <th>Power</th>
            </tr>
            </thead>
            <tbody>
            {characters.length > 0 && characters.map(({name, height, mass}) => (
                <CharacterRow
                    key={name}
                    name={name}
                    height={height}
                    mass={mass}
                    multiplier={multiplier}
                />
            ))}
            </tbody>
        </table>
    )
}

interface CharacterRowProps {
    key: string
    name: string
    height: string
    mass: string
    multiplier: string
}

function CharacterRow({name, height, mass, multiplier}: CharacterRowProps) {
    const power = calculateCharacterPower(height, mass, multiplier);
    return (
        <tr>
            <td>{name}</td>
            <td>{height}</td>
            <td>{mass}</td>
            <td>{power}</td>
        </tr>
    )
}

export default FunctionalComp;
