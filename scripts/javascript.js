const chat = document.querySelector('main');

let current = new Date;

function currentTime(){
    return( 
        ((current.getHours() < 10)?"0":"") + current.getHours() +
        ":" + ((current.getMinutes() < 10)?"0":"") + current.getMinutes() +
        ":" + ((current.getSeconds() < 10)?"0":"") + current.getSeconds()
        );
}

const yourName = prompt("Qual seu lindo nome?");

const userName = {
    name: yourName
};

function ingressRoom(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
    promise.then(ingressSuccess);
    promise.catch(ingressFail);
}

ingressRoom();

function keepInTheRoom(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
}

setInterval(keepInTheRoom, 5000);

function ingressSuccess(resp){
    console.log("Entrou com sucesso");
    console.log(resp);
}

function ingressFail(erro){
    console.log("Não conseguiu entrar");
    console.log(erro);
}

let chatMessages = [];

function loadMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(loadMsgSuccess);
    promise.catch(loadMsgFail);
}

setInterval(loadMessages, 3000);

function loadMsgSuccess(resp){
    console.log("Carregou com sucesso");
    console.log(resp);
    chatMessages = resp.data;
    displayMessages();
}

function loadMsgFail(erro){
    console.log(erro);
    console.log("Não carregou");
}

function displayMessages(){
    chat.innerHTML = '';
    for(let i = 0; i < chatMessages.length; i++){
        const message = chatMessages[i];
        switch (message.type){
            case 'status':
                displayStatusMsg(message);
                break;
            case 'private_message':
                displayPrivateMsg(message);
                break;
            case 'message':
                displayNormalMsg(message);
                break;
            default:
                console.log("Não reconheço o tipo da mensagem");
        }
    }
}

function displayStatusMsg(message) {
    chat.innerHTML+= `
    <div class="status-msg">
        <div class="div-message">
            <p>
                <span class="time">(${message.time}) </span>
                <span class="name">${message.from} </span>
                <span class="text">${message.text}<span>
            </p>
        </div>
    </div>
    `;
    const lastMessage = chat.querySelector('.status-msg:last-child');
    lastMessage.scrollIntoView(); 
}

function displayNormalMsg(message) {
    chat.innerHTML+=`
    <div class="normal-msg">
        <div class="div-message">
            <p>
                <span class="time">(${message.time}) </span>
                <span class="from">${message.from} </span>
                para <span class="to">${message.to}: </span>
                <span class="text">${message.text}</span>
            </p>
        </div>
    </div>
    `;
    const lastMessage = chat.querySelector('.normal-msg:last-child');
    lastMessage.scrollIntoView(); 
}

function displayPrivateMsg(message) {
    if (message.to === userName.name){
        chat.innerHTML+=`
        <div class="private-msg">
            <div class="div-message">
                <p>
                    <span class="time">(${message.time}) </span>
                    <span class="from">${message.from} </span>
                    reservadamente para <span class="to">${message.to}: </span>
                    <span class="text">${message.text}</span>
                </p>
            </div>
        </div>
        `;
        const lastMessage = chat.querySelector('.private-msg:last-child');
        lastMessage.scrollIntoView(); 
    }
}

