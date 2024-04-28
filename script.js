const html = document.querySelector('html');
const focoBtn = document.querySelector('.app__card-button--foco');
const curtoBtn = document.querySelector('.app__card-button--curto');
const longoBtn = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
const diminuirVolume = document.querySelector('#diminuir-volume');
const aumentarVolume = document.querySelector('#aumentar-volume');
const range = document.querySelector('#intervalo-volume');
const startPauseBtn = document.querySelector('#start-pause');
const textoBotao = document.querySelector('#start-pause span');
const iconeBotao = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');
const botaoMais = document.querySelector('.app__button--add-task-img');
const botaoOpcoes = document.querySelector('.app_button-more-img');

const somComecar = new Audio('./sons/play.wav');
const somPausar = new Audio('./sons/pause.mp3');
const somTempoEsgotado = new Audio('./sons/beep.mp3');

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musica.loop = true;
musica.volume = 0.5;
range.value = 5;

diminuirVolume.addEventListener('click', () => {
    musica.volume -= 0.1;
    range.value = musica.volume * 10;
});

aumentarVolume.addEventListener('click', () => {
    musica.volume += 0.1;
    range.value = musica.volume * 10;
});

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

focoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBtn.classList.add('active');
});

curtoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBtn.classList.add('active');
});

longoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBtn.classList.add('active');
});

function alterarContexto(contexto) {
    mostraTempo();
    botoes.forEach((botao) => {
        botao.classList.remove('active');
    });

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    botaoMais.setAttribute('src', `./imagens/add_circle_${contexto}.png`);
    botaoOpcoes.setAttribute('src', `./imagens/more_${contexto}.svg`)

    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        somTempoEsgotado.play();

        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        
        alert('Tempo esgotado!');
        zerar();
        textoBotao.textContent = 'Começar';
        iconeBotao.setAttribute('src', './imagens/play_arrow.png');
        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostraTempo();
}

startPauseBtn.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        zerar();
        somPausar.play();
        textoBotao.textContent = 'Retomar';
        iconeBotao.setAttribute('src', './imagens/play_arrow.png');
        return
    }
    somComecar.play();
    textoBotao.textContent = 'Pausar';
    iconeBotao.setAttribute('src', './imagens/pause.png');
    intervaloId = setInterval(contagemRegressiva, 1000);
}

function zerar() {
    clearInterval(intervaloId);
    intervaloId = null;
}

function mostraTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleString('pt-br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostraTempo();

