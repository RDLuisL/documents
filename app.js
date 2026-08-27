// ==========================================
// ELEMENTOS HTML
// ==========================================

const carousel =
    document.getElementById("carousel");

const previewIcon =
    document.getElementById("previewIcon");

const previewTitle =
    document.getElementById("previewTitle");

const previewContent =
    document.getElementById("previewContent");

const selectedCount =
    document.getElementById("selectedCount");

const sendButton =
    document.getElementById("sendButton");

const sendModal =
    document.getElementById("sendModal");

const closeModal =
    document.getElementById("closeModal");

const modalSelected =
    document.getElementById("modalSelected");

const modalBackdrop =
    document.querySelector(".modal__backdrop");

const shareSlider =
    document.getElementById("shareSlider");

const shareTrack =
    document.getElementById("shareTrack");

const shareHandle =
    document.getElementById("shareHandle");

const shareProgress =
    document.getElementById("shareProgress");

const shareStatus =
    document.getElementById("shareStatus");


// ==========================================
// VALIDACIONES
// ==========================================

if (!Array.isArray(window.documentos)) {

    throw new Error(
        "data.js no cargó correctamente. window.documentos no existe."
    );
}


if (!carousel) {

    throw new Error(
        'No existe id="carousel" en documentos.html'
    );
}


// ==========================================
// SELECCIÓN
// ==========================================

const seleccionados =
    new Set();

let documentosSeleccionados =
    [];


// ==========================================
// ARCHIVOS PREPARADOS PARA COMPARTIR
// ==========================================

let archivosPreparados =
    [];

let archivosListos =
    true;

let preparacionVersion =
    0;


// ==========================================
// AUDIO CONTEXT
// ==========================================

let audioContext =
    null;


// ==========================================
// OBTENER AUDIO CONTEXT
// ==========================================

function obtenerAudioContext() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {

        return null;
    }


    if (!audioContext) {

        audioContext =
            new AudioContext();
    }


    if (
        audioContext.state === "suspended"
    ) {

        audioContext.resume();
    }


    return audioContext;
}


// ==========================================
// SONIDO DEL CARRUSEL
// ==========================================

function reproducirSonido(
    direccion = "siguiente"
) {

    const contexto =
        obtenerAudioContext();


    if (!contexto) {

        return;
    }


    const ahora =
        contexto.currentTime;


    const oscilador =
        contexto.createOscillator();


    const volumen =
        contexto.createGain();


    oscilador.type =
        "sine";


    // ======================================
    // SIGUIENTE
    // ======================================

    if (
        direccion === "siguiente"
    ) {

        oscilador.frequency
            .setValueAtTime(
                390,
                ahora
            );


        oscilador.frequency
            .exponentialRampToValueAtTime(
                540,
                ahora + 0.07
            );

    }

    // ======================================
    // ANTERIOR
    // ======================================

    else {

        oscilador.frequency
            .setValueAtTime(
                390,
                ahora
            );


        oscilador.frequency
            .exponentialRampToValueAtTime(
                280,
                ahora + 0.07
            );
    }


    volumen.gain
        .setValueAtTime(
            0.0001,
            ahora
        );


    volumen.gain
        .exponentialRampToValueAtTime(
            0.035,
            ahora + 0.01
        );


    volumen.gain
        .exponentialRampToValueAtTime(
            0.0001,
            ahora + 0.11
        );


    oscilador.connect(
        volumen
    );


    volumen.connect(
        contexto.destination
    );


    oscilador.start(
        ahora
    );


    oscilador.stop(
        ahora + 0.12
    );
}


// ==========================================
// SONIDO SELECCIONAR / DESELECCIONAR
// ==========================================

function reproducirSonidoSeleccion(
    accion = "seleccionar"
) {

    const contexto =
        obtenerAudioContext();


    if (!contexto) {

        return;
    }


    const ahora =
        contexto.currentTime;


    const oscilador =
        contexto.createOscillator();


    const volumen =
        contexto.createGain();


    oscilador.type =
        "sine";


    // ======================================
    // SELECCIONAR
    // Sonido ascendente
    // ======================================

    if (
        accion === "seleccionar"
    ) {

        oscilador.frequency
            .setValueAtTime(
                620,
                ahora
            );


        oscilador.frequency
            .exponentialRampToValueAtTime(
                850,
                ahora + 0.08
            );

    }

    // ======================================
    // DESELECCIONAR
    // Sonido descendente
    // ======================================

    else {

        oscilador.frequency
            .setValueAtTime(
                520,
                ahora
            );


        oscilador.frequency
            .exponentialRampToValueAtTime(
                340,
                ahora + 0.08
            );
    }


    // Volumen suave

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
            ahora + 0.11
        );


    oscilador.connect(
        volumen
    );


    volumen.connect(
        contexto.destination
    );


    oscilador.start(
        ahora
    );


    oscilador.stop(
        ahora + 0.12
    );
}


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


        item.dataset.index =
            index;


        item.innerHTML = `

            <div class="carousel__item-head">

                ${documento.icono || "📄"}

            </div>


            <div class="carousel__item-body">

                <p class="title">

                    ${documento.descripcion}

                </p>


                <input
                    class="document-check"
                    type="checkbox"
                    aria-label="Seleccionar ${documento.descripcion}"
                >

            </div>

        `;


        const checkbox =
            item.querySelector(
                ".document-check"
            );


        // Evitar que tocar el checkbox
        // active el movimiento o apertura
        // de la tarjeta.

        checkbox.addEventListener(
            "pointerdown",
            (event) => {

                event.stopPropagation();

            }
        );


        checkbox.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );


        // ==================================
        // SELECCIÓN
        // ==================================

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


        carousel.appendChild(
            item
        );

    }
);


// ==========================================
// DATOS DEL CARRUSEL
// ==========================================

const items =
    Array.from(
        document.querySelectorAll(
            ".carousel__item"
        )
    );


const cantidad =
    items.length;


let indiceActual =
    0;

let inicioY =
    0;

let movimientoY =
    0;

let arrastrando =
    false;

let tarjetaPulsada =
    null;


const distanciaTarjetas =
    115;

const limiteArrastre =
    40;

const limiteClick =
    10;


// ==========================================
// FUNCIÓN MÓDULO
// ==========================================

function modulo(
    numero,
    total
) {

    return (
        (numero % total) +
        total
    ) % total;
}


// ==========================================
// CAMBIAR SELECCIÓN
// ==========================================

function cambiarSeleccion(
    documento,
    seleccionado,
    item
) {

    // ======================================
    // SELECCIONAR
    // ======================================

    if (seleccionado) {

        seleccionados.add(
            documento.id
        );


        item.classList.add(
            "is-selected"
        );


        reproducirSonidoSeleccion(
            "seleccionar"
        );

    }

    // ======================================
    // DESELECCIONAR
    // ======================================

    else {

        seleccionados.delete(
            documento.id
        );


        item.classList.remove(
            "is-selected"
        );


        reproducirSonidoSeleccion(
            "deseleccionar"
        );
    }


    actualizarSeleccionados();
}


// ==========================================
// ACTUALIZAR SELECCIONADOS
// ==========================================

function actualizarSeleccionados() {

    documentosSeleccionados =
        window.documentos.filter(
            documento =>
                seleccionados.has(
                    documento.id
                )
        );


    window.documentosSeleccionados =
        documentosSeleccionados;


    const total =
        documentosSeleccionados.length;


    selectedCount.textContent =
        total === 1
            ? "1 documento seleccionado"
            : `${total} documentos seleccionados`;


    sendButton.disabled =
        total === 0;


    // Preparar PDFs anticipadamente
    // para que Web Share pueda ejecutarse
    // directamente desde el gesto.

    prepararArchivosEnSegundoPlano();
}


// ==========================================
// PREPARAR ARCHIVOS
// ==========================================

async function prepararArchivosEnSegundoPlano() {

    const version =
        ++preparacionVersion;


    archivosPreparados =
        [];


    const documentosArchivo =
        documentosSeleccionados.filter(
            documento =>
                documento.tipo === "archivo"
        );


    // Si no hay PDFs

    if (
        documentosArchivo.length === 0
    ) {

        archivosListos =
            true;


        actualizarEstadoCompartir();

        return;
    }


    archivosListos =
        false;


    actualizarEstadoCompartir();


    const nuevosArchivos =
        [];


    for (
        const documento
        of documentosArchivo
    ) {

        try {

            const respuesta =
                await fetch(
                    documento.enlace
                );


            if (!respuesta.ok) {

                console.warn(
                    "No se pudo cargar:",
                    documento.enlace
                );

                continue;
            }


            const blob =
                await respuesta.blob();


            const nombre =
                documento.enlace
                    .split("/")
                    .pop();


            nuevosArchivos.push(

                new File(
                    [blob],
                    nombre,
                    {
                        type:
                            blob.type ||
                            "application/pdf"
                    }
                )

            );

        }

        catch (error) {

            console.error(
                "Error preparando archivo:",
                documento.enlace,
                error
            );
        }
    }


    // Evitar que una preparación antigua
    // reemplace una selección nueva.

    if (
        version !==
        preparacionVersion
    ) {

        return;
    }


    archivosPreparados =
        nuevosArchivos;


    archivosListos =
        true;


    actualizarEstadoCompartir();
}


// ==========================================
// ESTADO COMPARTIR
// ==========================================

function actualizarEstadoCompartir() {

    if (!shareStatus) {

        return;
    }


    if (
        documentosSeleccionados.length === 0
    ) {

        shareStatus.textContent =
            "";

        return;
    }


    if (!archivosListos) {

        shareStatus.textContent =
            "Preparando documentos...";

        return;
    }


    shareStatus.textContent =
        "Listo para compartir";
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
        documento.icono ||
        "📄";


    previewTitle.textContent =
        documento.descripcion;


    previewContent.innerHTML =
        "";


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

function abrirDocumento(
    item
) {

    const index =
        Number(
            item.dataset.index
        );


    const documento =
        window.documentos[
            index
        ];


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

    if (
        cantidad === 0
    ) {

        return;
    }


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


    // ======================================
    // TARJETA CENTRAL
    // ======================================

    const actual =
        items[
            indiceActual
        ];


    actual.style.visibility =
        "visible";


    actual.style.opacity =
        "1";


    actual.style.zIndex =
        "3";


    actual.style.transform =
        "translateY(0px) scale(1)";


    // ======================================
    // TARJETA ANTERIOR
    // ======================================

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
        "0.44";


    anterior.style.zIndex =
        "1";


    anterior.style.transform =
        `translateY(-${distanciaTarjetas}px) scale(0.72)`;


    // ======================================
    // TARJETA SIGUIENTE
    // ======================================

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
        "0.44";


    siguiente.style.zIndex =
        "1";


    siguiente.style.transform =
        `translateY(${distanciaTarjetas}px) scale(0.72)`;


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
// POINTER DOWN CARRUSEL
// ==========================================

carousel.addEventListener(
    "pointerdown",
    (event) => {

        if (
            event.target.closest(
                ".document-check"
            )
        ) {

            return;
        }


        const item =
            event.target.closest(
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
            event.clientY;


        movimientoY =
            0;


        carousel.setPointerCapture(
            event.pointerId
        );


        carousel.style.cursor =
            "grabbing";
    }
);


// ==========================================
// POINTER MOVE CARRUSEL
// ==========================================

carousel.addEventListener(
    "pointermove",
    (event) => {

        if (!arrastrando) {

            return;
        }


        movimientoY =
            event.clientY -
            inicioY;


        const actual =
            items[
                indiceActual
            ];


        actual.style.transition =
            "none";


        actual.style.transform =
            `translateY(${movimientoY}px) scale(1)`;


        // ==================================
        // MOVIMIENTO HACIA ARRIBA
        // ==================================

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
                `translateY(${distanciaTarjetas + movimientoY}px) scale(0.72)`;
        }


        // ==================================
        // MOVIMIENTO HACIA ABAJO
        // ==================================

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
                `translateY(${-distanciaTarjetas + movimientoY}px) scale(0.72)`;
        }
    }
);


// ==========================================
// POINTER UP CARRUSEL
// ==========================================

carousel.addEventListener(
    "pointerup",
    () => {

        if (!arrastrando) {

            return;
        }


        arrastrando =
            false;


        carousel.style.cursor =
            "grab";


        // ==================================
        // CLICK / TOQUE
        // ==================================

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


        // ==================================
        // ARRASTRE HACIA ARRIBA
        // ==================================

        if (
            movimientoY <
            -limiteArrastre
        ) {

            siguienteTarjeta();

        }

        // ==================================
        // ARRASTRE HACIA ABAJO
        // ==================================

        else if (
            movimientoY >
            limiteArrastre
        ) {

            anteriorTarjeta();

        }

        // ==================================
        // NO LLEGÓ AL LÍMITE
        // ==================================

        else {

            actualizarCarrusel();
        }


        tarjetaPulsada =
            null;
    }
);


// ==========================================
// CANCELAR CARRUSEL
// ==========================================

carousel.addEventListener(
    "pointercancel",
    () => {

        arrastrando =
            false;


        tarjetaPulsada =
            null;


        actualizarCarrusel();
    }
);


// ==========================================
// RUEDA DEL MOUSE
// ==========================================

let wheelBloqueado =
    false;


carousel.addEventListener(
    "wheel",
    (event) => {

        event.preventDefault();


        if (
            wheelBloqueado
        ) {

            return;
        }


        wheelBloqueado =
            true;


        if (
            event.deltaY > 0
        ) {

            siguienteTarjeta();

        }

        else {

            anteriorTarjeta();
        }


        setTimeout(
            () => {

                wheelBloqueado =
                    false;

            },
            420
        );

    },
    {
        passive: false
    }
);


// ==========================================
// TECLADO DEL CARRUSEL
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            sendModal.classList.contains(
                "is-open"
            )
        ) {

            return;
        }


        if (
            event.key === "ArrowDown"
        ) {

            siguienteTarjeta();
        }


        if (
            event.key === "ArrowUp"
        ) {

            anteriorTarjeta();
        }
    }
);


// ==========================================
// ACTUALIZAR MODAL
// ==========================================

function actualizarModal() {

    modalSelected.innerHTML =
        "";


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
                `${documento.icono || "📄"} ${documento.descripcion}`;


            modalSelected.appendChild(
                item
            );
        }
    );
}


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


        reiniciarShareSlider();


        actualizarEstadoCompartir();


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


    reiniciarShareSlider();
}


closeModal.addEventListener(
    "click",
    cerrarModal
);


modalBackdrop.addEventListener(
    "click",
    cerrarModal
);


// ==========================================
// CREAR TEXTO PARA COMPARTIR
// ==========================================

function crearTextoCompartir() {

    let texto =
        "Documentos de Luis Luna\n\n";


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


            texto +=
                "\n";
        }
    );


    return texto;
}


// ==========================================
// COMPARTIR
// ==========================================

function compartirArchivos() {

    if (
        !navigator.share
    ) {

        alert(
            "Este navegador no permite compartir directamente. Prueba desde Chrome, Safari o un teléfono compatible."
        );


        return false;
    }


    const datos =
        {

            title:
                "Documentos de Luis Luna",

            text:
                crearTextoCompartir()

        };


    // ======================================
    // ADJUNTAR ARCHIVOS
    // ======================================

    if (
        archivosPreparados.length > 0 &&
        navigator.canShare
    ) {

        try {

            if (
                navigator.canShare(
                    {
                        files:
                            archivosPreparados
                    }
                )
            ) {

                datos.files =
                    archivosPreparados;
            }

        }

        catch (error) {

            console.warn(
                "No es posible adjuntar los archivos:",
                error
            );
        }
    }


    // IMPORTANTE:
    // navigator.share se ejecuta
    // directamente desde el gesto.

    navigator.share(
        datos
    )
        .then(
            () => {

                cerrarModal();

            }
        )
        .catch(
            error => {

                if (
                    error.name !==
                    "AbortError"
                ) {

                    console.error(
                        "Error compartiendo:",
                        error
                    );
                }


                reiniciarShareSlider();
            }
        );


    return true;
}


// ==========================================
// SLIDER COMPARTIR
// ==========================================

let shareDragging =
    false;

let shareStartX =
    0;

let shareStartLeft =
    6;

let shareBusy =
    false;


// ==========================================
// RECORRIDO MÁXIMO
// ==========================================

function getShareMax() {

    return Math.max(

        shareTrack.clientWidth -
        shareHandle.offsetWidth -
        12,

        0
    );
}


// ==========================================
// ACTUALIZAR PROGRESO
// ==========================================

function actualizarShareProgress(
    posicion
) {

    const maximo =
        getShareMax();


    const porcentaje =
        maximo > 0

            ? Math.max(
                0,
                Math.min(
                    1,
                    (posicion - 6) /
                    maximo
                )
            )

            : 0;


    shareProgress.style.width =
        `${porcentaje * 100}%`;
}


// ==========================================
// REINICIAR SLIDER
// ==========================================

function reiniciarShareSlider() {

    shareDragging =
        false;


    shareBusy =
        false;


    shareHandle.style.transition =
        "left 0.25s ease";


    shareHandle.style.left =
        "6px";


    shareProgress.style.width =
        "0%";


    shareSlider.classList.remove(
        "is-complete"
    );


    shareHandle.disabled =
        !archivosListos;
}


// ==========================================
// POINTER DOWN SLIDER
// ==========================================

shareHandle.addEventListener(
    "pointerdown",
    (event) => {

        if (
            shareBusy ||
            !archivosListos
        ) {

            return;
        }


        event.preventDefault();

        event.stopPropagation();


        shareDragging =
            true;


        shareStartX =
            event.clientX;


        shareStartLeft =
            parseFloat(
                shareHandle.style.left
            ) || 6;


        shareHandle.style.transition =
            "none";


        shareHandle.setPointerCapture(
            event.pointerId
        );
    }
);


// ==========================================
// POINTER MOVE SLIDER
// ==========================================

shareHandle.addEventListener(
    "pointermove",
    (event) => {

        if (
            !shareDragging
        ) {

            return;
        }


        event.preventDefault();

        event.stopPropagation();


        const movimiento =
            event.clientX -
            shareStartX;


        const maximo =
            getShareMax();


        let posicion =
            shareStartLeft +
            movimiento;


        posicion =
            Math.max(
                6,
                Math.min(
                    posicion,
                    maximo + 6
                )
            );


        shareHandle.style.left =
            `${posicion}px`;


        actualizarShareProgress(
            posicion
        );
    }
);


// ==========================================
// POINTER UP SLIDER
// ==========================================

shareHandle.addEventListener(
    "pointerup",
    (event) => {

        if (
            !shareDragging
        ) {

            return;
        }


        event.preventDefault();

        event.stopPropagation();


        shareDragging =
            false;


        try {

            shareHandle.releasePointerCapture(
                event.pointerId
            );

        }

        catch (error) {

            // No es grave.
        }


        const maximo =
            getShareMax();


        const posicion =
            parseFloat(
                shareHandle.style.left
            ) || 6;


        const porcentaje =
            maximo > 0

                ? (posicion - 6) /
                  maximo

                : 0;


        // ==================================
        // LLEGÓ AL FINAL
        // ==================================

        if (
            porcentaje >= 0.82
        ) {

            shareBusy =
                true;


            shareHandle.style.transition =
                "left 0.18s ease";


            shareHandle.style.left =
                `${maximo + 6}px`;


            shareProgress.style.width =
                "100%";


            shareSlider.classList.add(
                "is-complete"
            );


            // Sin setTimeout.
            // Debe mantenerse dentro
            // del gesto del usuario.

            compartirArchivos();

        }

        // ==================================
        // NO LLEGÓ AL FINAL
        // ==================================

        else {

            reiniciarShareSlider();
        }
    }
);


// ==========================================
// CANCELAR SLIDER
// ==========================================

shareHandle.addEventListener(
    "pointercancel",
    () => {

        reiniciarShareSlider();
    }
);


// ==========================================
// TECLADO EN SLIDER
// ==========================================

shareHandle.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Enter" &&
            event.key !== " "
        ) {

            return;
        }


        event.preventDefault();


        if (
            !archivosListos ||
            shareBusy
        ) {

            return;
        }


        const maximo =
            getShareMax();


        shareHandle.style.left =
            `${maximo + 6}px`;


        shareProgress.style.width =
            "100%";


        shareSlider.classList.add(
            "is-complete"
        );


        compartirArchivos();
    }
);


// ==========================================
// ESC PARA CERRAR MODAL
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            sendModal.classList.contains(
                "is-open"
            )
        ) {

            cerrarModal();
        }
    }
);


// ==========================================
// INICIALIZACIÓN
// ==========================================

carousel.style.cursor =
    "grab";


carousel.style.touchAction =
    "none";


carousel.style.userSelect =
    "none";


actualizarSeleccionados();


actualizarCarrusel();


reiniciarShareSlider();