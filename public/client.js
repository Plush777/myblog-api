const btnGetAPIkey = document.getElementById('btnGetAPIkey');
const btnRetryAPIkey = document.getElementById('btnRetryAPIkey');
const myKey = document.getElementById('myKey');
const getButtonCount = localStorage.getItem('buttonCount');
const getMyAPIkey = localStorage.getItem('apiKey');
const hasCookie = document.cookie.includes('getAPIkeyReset=true');

const getAPIkey = (msg) => {
    fetch('/api/key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        alert(msg);
        localStorage.setItem('apiKey', data.apiKey);
        localStorage.setItem('uuid', data.uuid);
        location.reload();
    })
    .catch(err => {
        alert('API key 발급에 실패했습니다.');
        console.error('API key 발급 실패', err);
    });
}

let buttonCount = 0;

const addCount = () => { 
    buttonCount++;
    localStorage.setItem('buttonCount', buttonCount);
}

const APIkeyRemove = () => {
    localStorage.removeItem('buttonCount');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('uuid');
}

const createResetCookie = () => {
    /* 쿠키를 만든 시점으로부터 하루 뒤에 만료되도록 설정합니다. 86400초 => 24시간 */
    document.cookie = 'getAPIkeyReset=true; max-age=86400';
    location.reload();
}

btnGetAPIkey.addEventListener('click', () => {
    if (getButtonCount || hasCookie) {
        alert('API key는 한 번만 발급 가능합니다.');
    } else {
        addCount();
        getAPIkey('API key가 발급되었습니다.');
    }
});

btnRetryAPIkey.addEventListener('click', () => {
    if (hasCookie) {
        alert('API key 재발급은 재발급 후 24시간이 지난 뒤로부터 가능합니다.');
        return;
    } 
    
    if (!hasCookie && getButtonCount) {
        createResetCookie();
        APIkeyRemove();
        addCount();
        getAPIkey('API key 재발급에 성공했습니다.');
    }
});