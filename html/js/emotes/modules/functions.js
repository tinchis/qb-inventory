import { fetchNUI } from "./fetch.js";

export const changeClass = target => {
    const sidebar = document.getElementsByClassName('sidebar');
    for (let i = 0; i < sidebar.length; i++) {
        sidebar[i].style.color = 'whitesmoke';
    }
    target.classList.add('pop');
    target.style.color = "#999999";
    setTimeout(() => {
        target.classList.remove('pop');
    }, 500);

    if (target.id != 'menu') {
        const allClass = document.getElementsByClassName('anim');
        if (target.id != 'home') {
            const showClass = document.getElementsByClassName(target.id);
            for (let i = 0; i < allClass.length; i++) {
                allClass[i].style.display = 'none';
            }
            for (let i = 0; i < showClass.length; i++) {
                showClass[i].style.display = 'flex';
            }
            return;
        } else {
            for (let i = 0; i < allClass.length; i++) {
                allClass[i].style.display = 'flex';
            }
        }
    } 
}

const savedOpts = [
    "loop",
    "movement"
]

export const getStatus = elem => {
    for (let i = 0; i < savedOpts.length; i++) {
        if (savedOpts[i] == elem.id) {
            savedOpts.splice(i, 1);
            fetchNUI('changeCfg', { type: elem.id, state: true });
            elem.style.backgroundColor = "rgba(255,255,255,0.9)";
            return true;
        }
    }
    savedOpts.push(elem.id);
    fetchNUI('changeCfg', { type: elem.id, state: false });
    elem.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
    return false;
}

export const changeInfo = (type, titleM, descM) => {
    const title = document.getElementById('info-container');
    if (type) {
        title.textContent = titleM;
    } else {
        title.textContent = 'Información';
    }
}