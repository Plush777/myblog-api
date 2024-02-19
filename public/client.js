const btnGetAPIkey = document.getElementById('btnGetAPIkey');
const myKey = document.getElementById('myKey');
const getButtonCount = localStorage.getItem('buttonCount');
const getMyAPIkey = localStorage.getItem('apiKey');

const getAPIkey = () => {
    fetch('/api/key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        alert('API key가 발급되었습니다.');
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

btnGetAPIkey.addEventListener('click', () => {
    const addCount = () => { 
        buttonCount++;
        localStorage.setItem('buttonCount', buttonCount);
    }

    if (buttonCount >= 1 || getButtonCount >= 1) {
        alert('API key는 한 번만 발급 가능합니다.');
    } else {
        getAPIkey();
    }

    if (buttonCount > 0 || getButtonCount) {
        return;
    } else if(!buttonCount > 0 || !getButtonCount) {
        addCount();
    }
});

if (!getMyAPIkey) {
    myKey.innerHTML = '발급받은 API key가 없습니다.';
} else {
    myKey.innerHTML = getMyAPIkey;
}