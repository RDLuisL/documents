// ==========================================
// DATOS DEL CONTACTO
// ==========================================

const contacto = {

    nombre:
        "Luis Antonio Luna Serrano",

    nombrePila:
        "Luis Antonio",

    apellidos:
        "Luna Serrano",

    telefono:
        "+56944887031",

    correo:
        "luislunandroid@gmail.com",

    rut:
        "25871741-4"
};


// ==========================================
// ELEMENTOS
// ==========================================

const addContactButton =
    document.getElementById(
        "addContactButton"
    );


const contactStatus =
    document.getElementById(
        "contactStatus"
    );


// ==========================================
// GENERAR VCARD
// ==========================================

function generarVCard() {

    return [
        "BEGIN:VCARD",
        "VERSION:3.0",

        `N:${contacto.apellidos};${contacto.nombrePila};;;`,

        `FN:${contacto.nombre}`,

        `TEL;TYPE=CELL:${contacto.telefono}`,

        `EMAIL;TYPE=INTERNET:${contacto.correo}`,

        `NOTE:RUT: ${contacto.rut}`,

        "END:VCARD"

    ].join("\r\n");
}


// ==========================================
// AGREGAR A CONTACTOS
// ==========================================

function agregarAContactos() {

    const contenido =
        generarVCard();


    const blob =
        new Blob(
            [contenido],
            {
                type:
                    "text/vcard;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const enlace =
        document.createElement(
            "a"
        );


    enlace.href =
        url;


    enlace.download =
        "Luis_Antonio_Luna_Serrano.vcf";


    document.body.appendChild(
        enlace
    );


    enlace.click();


    enlace.remove();


    contactStatus.textContent =
        "Contacto preparado para agregar al dispositivo.";


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1500
    );
}


// ==========================================
// EVENTO
// ==========================================

addContactButton.addEventListener(
    "click",
    agregarAContactos
);