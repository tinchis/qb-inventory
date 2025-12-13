import { changeClass, getStatus, changeInfo } from "./modules/functions.js";
import { fetchNUI } from "./modules/fetch.js"

const doc = document;

window.addEventListener("message", ({data}) => {
    if (data.action === "emotesHTML") {
        doc.getElementById('home').addEventListener('mouseover', _ => changeInfo(true, 'Inicio'));
        doc.getElementById('home').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('home').addEventListener('click', e => changeClass(e.target));

        // doc.addEventListener('keyup', e => { 
        //     if (e.key == 'Escape') {
        //         fetchNUI('exitPanel');
        //     }
        // })

        doc.getElementById('favorite').addEventListener('mouseover', _ => changeInfo(true, 'Favoritos'));
        doc.getElementById('favorite').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('favorite').addEventListener('click', e => changeClass(e.target));

        doc.getElementById('dances').addEventListener('mouseover', _ => changeInfo(true, 'Bailes'));
        doc.getElementById('dances').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('dances').addEventListener('click', e => changeClass(e.target));

        doc.getElementById('props').addEventListener('mouseover', _ => changeInfo(true, 'Objetos'));
        doc.getElementById('props').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('props').addEventListener('click', e => changeClass(e.target));

        doc.getElementById('scenarios').addEventListener('mouseover', _ => changeInfo(true, 'Escenarios'));
        doc.getElementById('scenarios').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('scenarios').addEventListener('click', e => changeClass(e.target));

        doc.getElementById('walks').addEventListener('mouseover', _ => changeInfo(true, 'Formas de Caminar'));
        doc.getElementById('walks').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('walks').addEventListener('click', e => changeClass(e.target));

        doc.getElementById('expressions').addEventListener('mouseover', _ => changeInfo(true, 'Expresiones'));
        doc.getElementById('expressions').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('expressions').addEventListener('click', e => changeClass(e.target));

        doc.getElementById('shared').addEventListener('mouseover', _ => changeInfo(true, 'Animaciones Compartidas'));
        doc.getElementById('shared').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('shared').addEventListener('click', e => changeClass(e.target));

        doc.getElementById('search-bar').addEventListener('input', e => {
            let input = e.target.value.toUpperCase();
            const panels = doc.getElementsByClassName('anim');
            for (let i = 0; i < panels.length; i++) {
                let text = panels[i].getElementsByTagName('div')[0].firstChild
                let val = text.textContent || text.innerText;
                if (val.toUpperCase().indexOf(input) > -1) {
                    panels[i].style.display = "";
                } else {
                    text = panels[i].getElementsByTagName('div')[0].lastChild
                    val = text.textContent || text.innerText;
                    if (val.toUpperCase().indexOf(input) > -1) {
                        panels[i].style.display = "";
                    } else {
                        panels[i].style.display = "none";
                    }
                }
            }
        })


        doc.getElementById('cancel').addEventListener('mouseover', _ => changeInfo(true, 'Cancelar animación'));
        doc.getElementById('cancel').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('cancel').addEventListener('click', e => {
            e.target.style.backgroundColor = "rgb(255, 255, 255, 0.4)";
            setTimeout(() => {
                e.target.style.backgroundColor = 'rgb(255, 255, 255, 0.4)';
            }, 300);
            fetchNUI('cancelAnimation');
        });

        doc.getElementById('delete').addEventListener('mouseover', _ => changeInfo(true, 'Eliminar objetos'));
        doc.getElementById('delete').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('delete').addEventListener('click', e => {
            e.target.style.backgroundColor = "rgb(255, 255, 255, 0.4)";
            setTimeout(() => {
                e.target.style.backgroundColor = 'rgb(255, 255, 255, 0.4)';
            }, 300);
            fetchNUI('removeProps');
        });
        doc.getElementById('movement').addEventListener('mouseover', _ => changeInfo(true, 'Movimiento'));
        doc.getElementById('movement').addEventListener('mouseleave', _ => changeInfo(false));
        doc.getElementById('movement').addEventListener('click', e => (getStatus(e.target)));
    }
})