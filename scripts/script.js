const container = document.querySelector(".div-atletas")
const select = document.querySelector('.select-elencos')

const verificaSenha = () => {
    const entrada = document.getElementById("Senha").value;
    
    // Mapeamento de senhas criptografadas para URLs
    const senhasMap = {
        "48569c03100bdfd68c29f10876cd716c5c6a76d0792387c1e73df39029842fd3": "ezequiel.html",
        "3a65134d21a70a565a632ee246feb59364381748905c8b45bdb2937aeca69cb3": "luka.html",
        "7adf061e1dc3272107f8846b6f918b7e3acde9d2082dc2b556a11319b5a3076a": "alexei.html"
    };

    const entradaCriptografada = hex_sha256(entrada); // Criptografa a entrada do usuário

    if (senhasMap.hasOwnProperty(entradaCriptografada)) {
        sessionStorage.setItem("logado", "sim");
        alert("O Convite");
        window.location = senhasMap[entradaCriptografada]; // Redireciona para a URL correspondente
    } else {
        alert("Incorreto");
    }
}

// const verificaSenha = () => {
//     const entrada = document.getElementById("Senha").value
//     const senha = {"48569c03100bdfd68c29f10876cd716c5c6a76d0792387c1e73df39029842fd3", "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"};
    
//     if (senha === hex_sha256(entrada)) {
//         sessionStorage.setItem("logado", "sim")
//         alert("Convidado")
//         window.location = "principal.html"
//     } else {
//         alert("Incorreto")
//     }
// }

document.getElementById("Sair").onclick = () => {
    sessionStorage.removeItem("logado")
    alert("Saiu")
    window.location = "index.html"
}

let atletasArmazenados = []

select.onchange = () => {
    let carregando = document.getElementById('carregando')
    if (!carregando) {
        carregando = document.createElement('p')
        carregando.id = 'carregando'
        carregando.style.color = 'white'
        carregando.textContent = 'Carregando...'
        container.appendChild(carregando)
    }

    container.innerHTML = ''
    container.appendChild(carregando)

    pega_json(`https://botafogo-atletas.mange.li/2024-1/${select.value}`).then(
        (retorno) => {
            atletasArmazenados = retorno

            container.removeChild(carregando)

            retorno.forEach((atleta) => montaCard(atleta))
        }
    ).catch(error => {
        console.error('Erro ao carregar atletas:', error)
        container.innerHTML = '<p style="color: white;">Erro ao carregar atletas</p>'
    })
}

const pesquisarAtletas = (entrada) => {
    const container = document.querySelector(".div-atletas")
    container.innerHTML = ""

    if (entrada.trim() === "") {
        atletasArmazenados.forEach(montaCard)
        return
    }

    const atletasFiltrados = atletasArmazenados.filter((atleta) => 
        atleta.nome.toLowerCase().includes(entrada.toLowerCase()) ||
        atleta.posicao.toLowerCase().includes(entrada.toLowerCase())
    )

    if (atletasFiltrados.length === 0) {
        container.innerHTML = "<p style='color: white; text-align: center;'>Nenhum atleta encontrado</p>"
    } else {
        atletasFiltrados.forEach(montaCard)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const campoPesquisa = document.getElementById("pesquisa")
    
    if (campoPesquisa) {
        campoPesquisa.addEventListener('input', (evento) => {
            const termoPesquisa = evento.target.value
            pesquisarAtletas(termoPesquisa)
        })
    }
})

const manipulaClick = (evento) => {
    const id = evento.currentTarget.dataset.id
    const nome = evento.currentTarget.dataset.nome
    const desc = evento.currentTarget.dataset.desc

    document.cookie = `id=${id}`
    document.cookie = `nome=${nome}`
    document.cookie = `desc=${desc}`

    sessionStorage.setItem("id", id)
    sessionStorage.setItem("atleta", JSON.stringify(evento.currentTarget.dataset))

    localStorage.setItem("id", id)
    localStorage.setItem("atleta", JSON.stringify(evento.currentTarget.dataset))

    window.location = `detalhes.html?id=${id}`
}

const montaCard = (atleta) => {
    const cartao = document.createElement("div");
    cartao.classList.add("cartao")
    const nome = document.createElement("h3");
    const imagem = document.createElement("img");
    const link = document.createElement("a");

    nome.innerHTML = atleta.nome;
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    link.innerHTML = "SAIBA MAIS"
    link.href = `detalhes.html?id=${atleta.id}`
    cartao.appendChild(link)

    cartao.dataset.id = atleta.id
    cartao.dataset.nome = atleta.nome
    cartao.dataset.posicao = atleta.posicao

    cartao.onclick = manipulaClick 
    container.appendChild(cartao)
}

const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
}

const mostrarmasculino = () => {
    pega_json(`https://botafogo-atletas.mange.li/2024-1/masculino`).then(
        (retorno) => {
            atletasArmazenados = retorno
            
            container.innerHTML = ""
            
            retorno.forEach((atleta) => montaCard(atleta))
        }
    )
}

const mostrarfeminino = () => {
    pega_json(`https://botafogo-atletas.mange.li/2024-1/feminino`).then(
        (retorno) => {
            atletasArmazenados = retorno
            
            container.innerHTML = ""
            
            retorno.forEach((atleta) => montaCard(atleta))
        }
    )
}

const mostrarcompleto = () => {
    pega_json(`https://botafogo-atletas.mange.li/2024-1/all`).then(
        (retorno) => {
            atletasArmazenados = retorno
            
            container.innerHTML = ""
            
            retorno.forEach((atleta) => montaCard(atleta))
        }
    )
}

if (sessionStorage.getItem("logado")) {
    pega_json(`https://botafogo-atletas.mange.li/2024-1/all`).then(
        (retorno) => {
            // Atualiza a variável global
            atletasArmazenados = retorno
            
            retorno.forEach((atleta) => montaCard(atleta))
        }
    )
} else {
    document.body.innerHTML = "<h1>Você precisa estar logado.</h1> <a href='index.html'>Voltar</a>"
}