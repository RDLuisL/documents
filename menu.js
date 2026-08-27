// ==========================================
// CONFIGURACIÓN
// ==========================================

const PIN_CORRECTO =
    "979121";


// ==========================================
// ELEMENTOS
// ==========================================

const documentsButton =
    document.getElementById(
        "documentsButton"
    );


const pinModal =
    document.getElementById(
        "pinModal"
    );


const pinBackdrop =
    document.getElementById(
        "pinBackdrop"
    );


const closePinModal =
    document.getElementById(
        "closePinModal"
    );


const pinForm =
    document.getElementById(
        "pinForm"
    );


const pinInput =
    document.getElementById(
        "pinInput"
    );


const pinMessage =
    document.getElementById(
        "pinMessage"
    );


// ==========================================
// ABRIR MODAL
// ==========================================

function abrirPinModal() {

    pinInput.value =
        "";


    pinMessage.textContent =
        "";


    pinMessage.classList.remove(
        "is-success"
    );


    pinInput.classList.remove(
        "is-error"
    );


    pinModal.classList.add(
        "is-open"
    );


    pinModal.setAttribute(
        "aria-hidden",
        "false"
    );


    // Pequeño retraso para que
    // el teclado se abra correctamente
    // en algunos dispositivos.

    setTimeout(
        () => {

            pinInput.focus();

        },
        100
    );
}


// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarPinModal() {

    pinModal.classList.remove(
        "is-open"
    );


    pinModal.setAttribute(
        "aria-hidden",
        "true"
    );


    pinInput.value =
        "";


    pinMessage.textContent =
        "";


    pinInput.classList.remove(
        "is-error"
    );
}


// ==========================================
// FILTRAR SOLO NÚMEROS
// ==========================================

pinInput.addEventListener(
    "input",
    () => {

        pinInput.value =
            pinInput.value
                .replace(
                    /\D/g,
                    ""
                )
                .slice(
                    0,
                    6
                );


        pinInput.classList.remove(
            "is-error"
        );


        pinMessage.textContent =
            "";
    }
);


// ==========================================
// VALIDAR PIN
// ==========================================

function validarPin() {

    const pinIngresado =
        pinInput.value.trim();


    // ======================================
    // PIN CORRECTO
    // ======================================

    if (
        pinIngresado ===
        PIN_CORRECTO
    ) {

        pinInput.classList.remove(
            "is-error"
        );


        pinMessage.classList.add(
            "is-success"
        );


        pinMessage.textContent =
            "Acceso autorizado";


        // Guardamos autorización
        // durante esta sesión del navegador.

        sessionStorage.setItem(
            "documentosAutorizados",
            "true"
        );


        setTimeout(
            () => {

                window.location.href =
                    "./documentos.html";

            },
            350
        );


        return;
    }


    // ======================================
    // PIN INCORRECTO
    // ======================================

    pinMessage.classList.remove(
        "is-success"
    );


    pinMessage.textContent =
        "Clave incorrecta";


    pinInput.classList.remove(
        "is-error"
    );


    // Reiniciar animación

    void pinInput.offsetWidth;


    pinInput.classList.add(
        "is-error"
    );


    pinInput.value =
        "";


    pinInput.focus();
}


// ==========================================
// BOTÓN DOCUMENTOS
// ==========================================

documentsButton.addEventListener(
    "click",
    abrirPinModal
);


// ==========================================
// FORMULARIO
// ==========================================

pinForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        validarPin();
    }
);


// ==========================================
// CERRAR
// ==========================================

closePinModal.addEventListener(
    "click",
    cerrarPinModal
);


pinBackdrop.addEventListener(
    "click",
    cerrarPinModal
);


// ==========================================
// ESC
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            pinModal.classList.contains(
                "is-open"
            )
        ) {

            cerrarPinModal();
        }
    }
);