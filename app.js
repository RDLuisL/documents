const carousel =
    document.getElementById("carousel");

const previewIcon =
    document.getElementById("previewIcon");

const previewTitle =
    document.getElementById("previewTitle");

const previewContent =
    document.getElementById("previewContent");

const sendButton =
    document.getElementById("sendButton");

const selectedCount =
    document.getElementById("selectedCount");

const sendModal =
    document.getElementById("sendModal");

const closeModal =
    document.getElementById("closeModal");

const modalSelected =
    document.getElementById("modalSelected");



// ==========================================
// DOCUMENTOS SELECCIONADOS
// ==========================================

const seleccionados = new Set();


// Este será el arreglo solicitado
let documentosSeleccionados = [];



// ==========================================
// CREAR TARJETAS
// ==========================================

window.documentos.forEach(
    (documento, index) => {

        const item =
            document.createElement("div");


        item.classList.add(
            "carousel__item"
        );


        item.dataset.index = index;


        item.innerHTML = `

            <div class="carousel__item-head">

                ${documento.icono}

            </div>


            <div class="carousel__item-body">

                <p class="title">

                    ${documento.descripcion}

                </p>


                <input
                    type="checkbox"
                    class="document-check"
                    aria-label="Seleccionar ${documento.descripcion}"
                >

            </div>

        `;


        const checkbox =
            item.querySelector(
                ".document-check"
            );



        // Evitar que el checkbox abra el documento
        checkbox.addEventListener(
            "pointerdown",
            (e) => {

                e.stopPropagation();

            }
        );


        checkbox.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

            }
        );



        checkbox.addEventListener(
            "change",
            () => {

                cambiarSeleccion(
                    documento,
                    checkbox.checked,
                    item
                );

            }
        );


        carousel.appendChild(item);

    }
);



// ==========================================
// VARIABLES CARRUSEL
// ==========================================

const items = Array.from(
    document.querySelectorAll(
        ".carousel__item"
    )
);


const cantidad = items.length;


let indiceActual = 0;

let inicioY = 0;

let movimientoY = 0;

let arrastrando = false;

let tarjetaPulsada = null;


const distanciaTarjetas = 115;

const limiteArrastre = 40;

const limiteClick = 10;



// ==========================================
// SELECCIONAR DOCUMENTOS
// ==========================================

function cambiarSeleccion(
    documento,
    seleccionado,
    item
) {

    if (seleccionado) {

        seleccionados.add(
            documento.id
        );

        item.classList.add(
            "is-selected"
        );

    }

    else {

        seleccionados.delete(
            documento.id
        );

        item.classList.remove(
            "is-selected"
        );

    }


    actualizarSeleccionados();

}



// ==========================================
// ACTUALIZAR ARREGLO
// ==========================================

function actualizarSeleccionados() {

    documentosSeleccionados =
        window.documentos.filter(
            documento =>
                seleccionados.has(
                    documento.id
                )
        );


    const total =
        documentosSeleccionados.length;


    selectedCount.textContent =
        total === 1
            ? "1 documento seleccionado"
            : `${total} documentos seleccionados`;


    sendButton.disabled =
        total === 0;


    // Disponible globalmente
    window.documentosSeleccionados =
        documentosSeleccionados;


    console.log(
        "Documentos seleccionados:",
        documentosSeleccionados
    );

}



// ==========================================
// SONIDO
// ==========================================

let audioContext = null;


function reproducirSonido(
    direccion = "siguiente"
) {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {
        return;
    }


    if (!audioContext) {

        audioContext =
            new AudioContext();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    const ahora =
        audioContext.currentTime;


    const oscilador =
        audioContext.createOscillator();


    const volumen =
        audioContext.createGain();


    oscilador.type = "sine";


    if (
        direccion === "siguiente"
    ) {

        oscilador.frequency
            .setValueAtTime(
                420,
                ahora
            );


        oscilador.frequency
            .exponentialRampToValueAtTime(
                620,
                ahora + 0.08
            );

    }

    else {

        oscilador.frequency
            .setValueAtTime(
                420,
                ahora
            );


        oscilador.frequency
            .exponentialRampToValueAtTime(
                300,
                ahora + 0.08
            );

    }


    volumen.gain
        .setValueAtTime(
            0.0001,
            ahora
        );


    volumen.gain
        .exponentialRampToValueAtTime(
            0.045,
            ahora + 0.01
        );


    volumen.gain
        .exponentialRampToValueAtTime(
            0.0001,
            ahora + 0.12
        );


    oscilador.connect(
        volumen
    );


    volumen.connect(
        audioContext.destination
    );


    oscilador.start(
        ahora
    );


    oscilador.stop(
        ahora + 0.13
    );

}



// ==========================================
// MÓDULO
// ==========================================

function modulo(numero, total) {

    return (
        (numero % total) + total
    ) % total;

}



// ==========================================
// PREVIEW
// ==========================================

function actualizarPreview() {

    const documento =
        window.documentos[
            indiceActual
        ];


    if (!documento) {
        return;
    }


    previewIcon.textContent =
        documento.icono;


    previewTitle.textContent =
        documento.descripcion;


    previewContent.innerHTML = "";



    // ======================================
    // ARCHIVO PDF
    // ======================================

    if (
        documento.tipo === "archivo"
    ) {

        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.classList.add(
            "preview__pdf"
        );


        iframe.src =
            `${documento.enlace}#toolbar=0&navpanes=0&scrollbar=0`;


        iframe.title =
            documento.descripcion;


        previewContent.appendChild(
            iframe
        );


        const hint =
            document.createElement(
                "div"
            );


        hint.classList.add(
            "preview__hint"
        );


        hint.textContent =
            "Seleccionar tarjeta para abrir";


        previewContent.appendChild(
            hint
        );


        return;
    }



    // ======================================
    // WEB / WHATSAPP
    // ======================================

    const panel =
        document.createElement(
            "div"
        );


    panel.classList.add(
        "preview__web"
    );


    const icono =
        document.createElement(
            "div"
        );


    icono.classList.add(
        "preview__web-icon"
    );


    icono.textContent =
        documento.tipo === "whatsapp"
            ? "💬"
            : "🌐";


    const mensaje =
        document.createElement(
            "p"
        );


    mensaje.classList.add(
        "preview__web-message"
    );


    mensaje.textContent =
        "Seleccionar para redirigir a Webpage";


    panel.appendChild(
        icono
    );


    panel.appendChild(
        mensaje
    );


    previewContent.appendChild(
        panel
    );

}



// ==========================================
// ABRIR DOCUMENTO
// ==========================================

function abrirDocumento(item) {

    const index =
        Number(
            item.dataset.index
        );


    const documento =
        window.documentos[index];


    if (
        !documento ||
        !documento.enlace
    ) {

        return;

    }


    window.open(
        documento.enlace,
        "_blank"
    );

}



// ==========================================
// ACTUALIZAR CARRUSEL
// ==========================================

function actualizarCarrusel() {

    items.forEach(
        item => {

            item.style.transition =
                "transform 0.45s ease, opacity 0.45s ease";


            item.style.visibility =
                "hidden";


            item.style.opacity =
                "0";


            item.style.zIndex =
                "0";


            item.style.transform =
                "translateY(0px) scale(0.5)";

        }
    );



    // CENTRAL

    const actual =
        items[indiceActual];


    actual.style.visibility =
        "visible";

    actual.style.opacity =
        "1";

    actual.style.zIndex =
        "3";

    actual.style.transform =
        "translateY(0px) scale(1)";



    // ANTERIOR

    const anterior =
        items[
            modulo(
                indiceActual - 1,
                cantidad
            )
        ];


    anterior.style.visibility =
        "visible";

    anterior.style.opacity =
        "0.4";

    anterior.style.zIndex =
        "1";

    anterior.style.transform =
        `translateY(-${distanciaTarjetas}px) scale(0.7)`;



    // SIGUIENTE

    const siguiente =
        items[
            modulo(
                indiceActual + 1,
                cantidad
            )
        ];


    siguiente.style.visibility =
        "visible";

    siguiente.style.opacity =
        "0.4";

    siguiente.style.zIndex =
        "1";

    siguiente.style.transform =
        `translateY(${distanciaTarjetas}px) scale(0.7)`;


    actualizarPreview();

}



// ==========================================
// SIGUIENTE
// ==========================================

function siguienteTarjeta() {

    indiceActual =
        modulo(
            indiceActual + 1,
            cantidad
        );


    reproducirSonido(
        "siguiente"
    );


    actualizarCarrusel();

}



// ==========================================
// ANTERIOR
// ==========================================

function anteriorTarjeta() {

    indiceActual =
        modulo(
            indiceActual - 1,
            cantidad
        );


    reproducirSonido(
        "anterior"
    );


    actualizarCarrusel();

}



// ==========================================
// POINTER DOWN
// ==========================================

carousel.addEventListener(
    "pointerdown",
    e => {

        if (
            e.target.closest(
                ".document-check"
            )
        ) {

            return;

        }


        const item =
            e.target.closest(
                ".carousel__item"
            );


        if (!item) {
            return;
        }


        tarjetaPulsada =
            item;


        arrastrando =
            true;


        inicioY =
            e.clientY;


        movimientoY =
            0;


        carousel.setPointerCapture(
            e.pointerId
        );


        carousel.style.cursor =
            "grabbing";

    }
);



// ==========================================
// POINTER MOVE
// ==========================================

carousel.addEventListener(
    "pointermove",
    e => {

        if (!arrastrando) {
            return;
        }


        movimientoY =
            e.clientY -
            inicioY;


        const actual =
            items[indiceActual];


        actual.style.transition =
            "none";


        actual.style.transform =
            `translateY(${movimientoY}px) scale(1)`;



        if (
            movimientoY < 0
        ) {

            const siguiente =
                items[
                    modulo(
                        indiceActual + 1,
                        cantidad
                    )
                ];


            siguiente.style.transition =
                "none";


            siguiente.style.transform =
                `translateY(${distanciaTarjetas + movimientoY}px) scale(0.7)`;

        }



        if (
            movimientoY > 0
        ) {

            const anterior =
                items[
                    modulo(
                        indiceActual - 1,
                        cantidad
                    )
                ];


            anterior.style.transition =
                "none";


            anterior.style.transform =
                `translateY(${-distanciaTarjetas + movimientoY}px) scale(0.7)`;

        }

    }
);



// ==========================================
// POINTER UP
// ==========================================

carousel.addEventListener(
    "pointerup",
    () => {

        if (!arrastrando) {
            return;
        }


        arrastrando = false;


        carousel.style.cursor =
            "grab";



        // CLICK

        if (
            Math.abs(
                movimientoY
            ) <= limiteClick
        ) {

            if (
                tarjetaPulsada
            ) {

                abrirDocumento(
                    tarjetaPulsada
                );

            }


            tarjetaPulsada =
                null;


            actualizarCarrusel();


            return;

        }



        if (
            movimientoY <
            -limiteArrastre
        ) {

            siguienteTarjeta();

        }


        else if (
            movimientoY >
            limiteArrastre
        ) {

            anteriorTarjeta();

        }


        else {

            actualizarCarrusel();

        }


        tarjetaPulsada =
            null;

    }
);



// ==========================================
// RUEDA
// ==========================================

let bloqueadoWheel = false;


carousel.addEventListener(
    "wheel",
    e => {

        e.preventDefault();


        if (
            bloqueadoWheel
        ) {

            return;

        }


        bloqueadoWheel = true;


        if (
            e.deltaY > 0
        ) {

            siguienteTarjeta();

        }

        else {

            anteriorTarjeta();

        }


        setTimeout(
            () => {

                bloqueadoWheel =
                    false;

            },
            450
        );

    },

    {
        passive: false
    }
);



// ==========================================
// TECLADO
// ==========================================

document.addEventListener(
    "keydown",
    e => {

        if (
            e.key ===
            "ArrowDown"
        ) {

            siguienteTarjeta();

        }


        if (
            e.key ===
            "ArrowUp"
        ) {

            anteriorTarjeta();

        }

    }
);



// ==========================================
// ABRIR MODAL
// ==========================================

sendButton.addEventListener(
    "click",
    () => {

        if (
            documentosSeleccionados.length === 0
        ) {

            return;

        }


        actualizarModal();


        sendModal.classList.add(
            "is-open"
        );


        sendModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }
);



// ==========================================
// ACTUALIZAR MODAL
// ==========================================

function actualizarModal() {

    modalSelected.innerHTML = "";


    documentosSeleccionados.forEach(
        documento => {

            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "modal__selected-item"
            );


            item.textContent =
                `${documento.icono} ${documento.descripcion}`;


            modalSelected.appendChild(
                item
            );

        }
    );

}



// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarModal() {

    sendModal.classList.remove(
        "is-open"
    );


    sendModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


closeModal.addEventListener(
    "click",
    cerrarModal
);


document
    .querySelector(
        ".modal__backdrop"
    )
    .addEventListener(
        "click",
        cerrarModal
    );



// ==========================================
// PREPARAR ARCHIVOS
// ==========================================

async function prepararArchivos() {

    const archivos = [];


    const documentosArchivo =
        documentosSeleccionados.filter(
            documento =>
                documento.tipo ===
                "archivo"
        );


    for (
        const documento
        of documentosArchivo
    ) {

        try {

            const respuesta =
                await fetch(
                    documento.enlace
                );


            if (
                !respuesta.ok
            ) {

                continue;

            }


            const blob =
                await respuesta.blob();


            const nombre =
                documento.enlace
                    .split("/")
                    .pop();


            const archivo =
                new File(
                    [blob],
                    nombre,
                    {
                        type:
                            blob.type ||
                            "application/pdf"
                    }
                );


            archivos.push(
                archivo
            );

        }

        catch (error) {

            console.error(
                "No se pudo preparar:",
                documento.descripcion,
                error
            );

        }

    }


    return archivos;

}



// ==========================================
// CREAR TEXTO
// ==========================================

function crearTextoCompartir() {

    let texto =
        "Documentos seleccionados:\n\n";


    documentosSeleccionados.forEach(
        documento => {

            texto +=
                `• ${documento.descripcion}\n`;


            if (
                documento.tipo !==
                "archivo"
            ) {

                texto +=
                    `${documento.enlace}\n`;

            }


            texto += "\n";

        }
    );


    return texto;

}



// ==========================================
// COMPARTIR ARCHIVOS
// ==========================================

async function compartirArchivos(
    modo
) {

    const archivos =
        await prepararArchivos();


    const texto =
        crearTextoCompartir();


    const datosCompartir = {

        title:
            "Documentos",

        text:
            texto

    };



    // Agregar archivos si el navegador
    // permite compartirlos

    if (
        archivos.length > 0 &&
        navigator.canShare &&
        navigator.canShare(
            {
                files:
                    archivos
            }
        )
    ) {

        datosCompartir.files =
            archivos;

    }



    // ======================================
    // WEB SHARE API
    // ======================================

    if (
        navigator.share
    ) {

        try {

            await navigator.share(
                datosCompartir
            );


            cerrarModal();

            return true;

        }

        catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return true;

            }


            console.error(
                error
            );

        }

    }


    // ======================================
    // ALTERNATIVA
    // ======================================

    if (
        modo === "whatsapp"
    ) {

        const url =
            "https://wa.me/?text=" +
            encodeURIComponent(
                texto
            );


        window.open(
            url,
            "_blank"
        );

    }


    else if (
        modo === "email"
    ) {

        const subject =
            encodeURIComponent(
                "Documentos"
            );


        const body =
            encodeURIComponent(
                texto
            );


        window.location.href =
            `mailto:?subject=${subject}&body=${body}`;

    }


    cerrarModal();


    return false;

}



// ==========================================
// CONFIGURACIÓN INICIAL
// ==========================================

carousel.style.cursor =
    "grab";


carousel.style.touchAction =
    "none";


carousel.style.userSelect =
    "none";


actualizarSeleccionados();


actualizarCarrusel();