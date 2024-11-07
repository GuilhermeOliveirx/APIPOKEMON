function fetchDataPokemon() {
    const pokemonName = document.getElementById('pokemonName').value;

    // Limpa o sprite e as categorias secundárias ao procurar outro Pokémon
    const pokemonSprite = document.getElementById('pokemonSprite');
    const typesElement = document.getElementById('pokemonTypes');
    const abilitiesElement = document.getElementById('pokemonAbilities');
    const locationsElement = document.getElementById('pokemonLocations');

    // Esconde o sprite e limpa as informações anteriores
    pokemonSprite.style.display = 'none';
    typesElement.textContent = '';
    abilitiesElement.textContent = '';
    locationsElement.textContent = '';

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon não encontrado');
            }
            return response.json();
        })
        .then(data => {
            pokemonSprite.src = data.sprites.front_default; // Define a imagem do Pokémon
            pokemonSprite.style.display = 'block'; // Torna a imagem visível
            fetchPokemonType(pokemonName); // Busca e exibe os tipos
            fetchPokemonAbilities(pokemonName); // Busca e exibe as habilidades
            fetchPokemonLocations(pokemonName); // Busca e exibe as localizações
        })
        .catch(error => {
            console.error(error);
            alert('Erro: ' + error.message); // Exibe um erro se o Pokémon não for encontrado
        });
}

// Função para adicionar um Pokémon aos favoritos
function addPokemonToFavorites(pokemonName) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(pokemonName)) {
        favorites.push(pokemonName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${pokemonName} foi adicionado aos favoritos!`);
        listFavorites(); // Atualiza a lista de favoritos exibida
    } else {
        alert(`${pokemonName} já está nos favoritos.`);
    }
}

// Função para listar os favoritos
function listFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteContainer = document.getElementById('favoriteList');
    favoriteContainer.innerHTML = ''; // Limpa a lista antes de renderizar

    favorites.forEach(name => {
        const listItem = document.createElement('li');
        listItem.textContent = name;

        // Botão para remover dos favoritos
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remover';
        deleteButton.onclick = () => deleteFromFavorites(name);

        listItem.appendChild(deleteButton);
        favoriteContainer.appendChild(listItem);
    });
}

// Função para deletar um Pokémon dos favoritos
function deleteFromFavorites(pokemonName) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(name => name !== pokemonName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${pokemonName} foi removido dos favoritos.`);
    listFavorites(); // Atualiza a lista exibida
}

// Função para atualizar o apelido de um Pokémon nos favoritos
function updateFavoritePokemonData(pokemonName, newNickname) {
    let favoritesData = JSON.parse(localStorage.getItem('favoritesData')) || {};
    favoritesData[pokemonName] = { nickname: newNickname };
    localStorage.setItem('favoritesData', JSON.stringify(favoritesData));
    alert(`O apelido de ${pokemonName} foi atualizado para ${newNickname}.`);
}

// Função para buscar e exibir os tipos do Pokémon
function fetchPokemonType(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
        .then(response => {
            if (!response.ok) throw new Error('Pokémon não encontrado');
            return response.json();
        })
        .then(data => {
            const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
            document.getElementById('pokemonTypes').textContent = types;
        })
        .catch(error => {
            console.error(error);
            document.getElementById('pokemonTypes').textContent = 'Erro ao carregar tipos.';
        });
}

// Função para buscar e exibir as habilidades do Pokémon
function fetchPokemonAbilities(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
        .then(response => {
            if (!response.ok) throw new Error('Pokémon não encontrado');
            return response.json();
        })
        .then(data => {
            const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name); // Extrai os nomes das habilidades (abilities) do Pokémon e cria um array com esses nomes.
            document.getElementById('pokemonAbilities').textContent = abilities.slice().join(', ');
        })
        .catch(error => {
            console.error(error);
            document.getElementById('pokemonAbilities').textContent = 'Erro ao carregar habilidades.';
        });
}

// Função para buscar e exibir as localizações do Pokémon
function fetchPokemonLocations(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/encounters`)
        .then(response => {
            if (!response.ok) throw new Error('Pokémon não encontrado');
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                document.getElementById('pokemonLocations').textContent = 'Nenhuma localização encontrada.';
                return;
            }
            const locations = data.map(location => location.location_area.name);
            document.getElementById('pokemonLocations').textContent = locations.slice().join(', ');
        })
        .catch(error => {
            console.error(error);
            document.getElementById('pokemonLocations').textContent = 'Erro ao carregar localizações.';
        });
}
