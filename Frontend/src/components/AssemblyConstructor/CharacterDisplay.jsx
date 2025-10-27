import React from 'react';
import './AssemblyConstructor.css';

const CharacterDisplay = ({ selectedCharacter }) => {
    return (
        <div>
            {selectedCharacter ? (
                <div>
                    <h3>{selectedCharacter.name}</h3>
                    <img src={selectedCharacter.image} alt={selectedCharacter.name} style={{ width: '100%', height: 'auto' }} />
                    {/* Характеристики могут также быть добавлены здесь */}
                </div>
            ) : (
                <p>Выберите персонажа</p>
            )}
        </div>
    );
};

export default CharacterDisplay;
