/* =========================================
   CORAZÓN 3D DE PARTÍCULAS
   ========================================= */

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const kittyImages =
    document.querySelectorAll(".kitty");


/* =========================================
   TAMAÑO
========================================= */

let W;
let H;

function resize() {

    W = window.innerWidth;
    H = window.innerHeight;

    const pixelRatio =
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.width =
        W * pixelRatio;

    canvas.height =
        H * pixelRatio;

    canvas.style.width =
        W + "px";

    canvas.style.height =
        H + "px";

    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );
}

resize();

window.addEventListener(
    "resize",
    resize
);


/* =========================================
   ROTACIÓN DEL CORAZÓN
========================================= */

let rotX = -0.15;

let rotY = 0;

let rotZ = 0;


/*
   Zoom
*/

let zoom = 1;


/*
   Control manual
*/

let dragging = false;

let lastX = 0;

let lastY = 0;


/* =========================================
   PARTÍCULAS
========================================= */

const particles = [];

const cantidad = 3500;


/* =========================================
   CREAR CORAZÓN
========================================= */

function crearCorazon() {

    particles.length = 0;

    for (let i = 0; i < cantidad; i++) {

        const t =
            Math.random() *
            Math.PI *
            2;


        /*
           Fórmula matemática
           del corazón
        */

        const x =
            16 *
            Math.pow(
                Math.sin(t),
                3
            );


        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);


        /*
           Profundidad 3D
        */

        const z =
            (Math.random() - 0.5) * 12;


        /*
           Pequeña variación
        */

        const variacion =
            Math.random() * 1.8;


        particles.push({

            x:
                x +
                (Math.random() - 0.5) *
                variacion,

            y:
                y +
                (Math.random() - 0.5) *
                variacion,

            z: z,

            size:
                Math.random() * 1.7 +
                0.4,

            brillo:
                Math.random() *
                Math.PI *
                2

        });

    }
}


crearCorazon();


/* =========================================
   ESTRELLAS
========================================= */

const stars = [];


for (let i = 0; i < 500; i++) {

    stars.push({

        x:
            Math.random() *
            window.innerWidth,

        y:
            Math.random() *
            window.innerHeight,

        size:
            Math.random() *
            1.5,

        opacity:
            Math.random()

    });

}


/* =========================================
   ROTACIÓN 3D
========================================= */

function rotarPunto(p) {

    let x = p.x;

    let y = p.y;

    let z = p.z;


    /* ROTACIÓN X */

    const cosX =
        Math.cos(rotX);

    const sinX =
        Math.sin(rotX);


    let y1 =
        y * cosX -
        z * sinX;


    let z1 =
        y * sinX +
        z * cosX;


    /* ROTACIÓN Y */

    const cosY =
        Math.cos(rotY);

    const sinY =
        Math.sin(rotY);


    let x2 =
        x * cosY +
        z1 * sinY;


    let z2 =
        -x * sinY +
        z1 * cosY;


    /* ROTACIÓN Z */

    const cosZ =
        Math.cos(rotZ);

    const sinZ =
        Math.sin(rotZ);


    let x3 =
        x2 * cosZ -
        y1 * sinZ;


    let y3 =
        x2 * sinZ +
        y1 * cosZ;


    return {

        x: x3,

        y: y3,

        z: z2

    };

}


/* =========================================
   PROYECCIÓN 3D
========================================= */

function proyectar(p) {

    const distancia = 250;


    const profundidad =
        distancia /
        (distancia - p.z);


    return {

        x:
            W / 2 +
            p.x *
            10 *
            profundidad *
            zoom,

        y:
            H / 2 -
            p.y *
            10 *
            profundidad *
            zoom,

        escala:
            profundidad,

        z:
            p.z

    };

}


/* =========================================
   ESTRELLAS
========================================= */

function dibujarEstrellas() {

    for (const star of stars) {

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );


        const brillo =
            0.4 +
            Math.sin(
                performance.now() *
                0.001 +
                star.x
            ) *
            0.3;


        ctx.fillStyle =
            `rgba(
                255,
                150,
                220,
                ${Math.max(0.1, brillo)}
            )`;


        ctx.fill();

    }

}


/* =========================================
   CORAZÓN
========================================= */

function dibujarCorazon() {

    const render = [];


    for (const p of particles) {

        const rotado =
            rotarPunto(p);


        const proyectado =
            proyectar(rotado);


        render.push({

            ...proyectado,

            brillo:
                p.brillo,

            size:
                p.size *
                proyectado.escala

        });

    }


    /*
       Las partículas más lejanas
       se dibujan primero.
    */

    render.sort(
        (a, b) =>
            a.z - b.z
    );


    for (const p of render) {

        const brillo =
            0.55 +
            Math.sin(
                performance.now() *
                0.004 +
                p.brillo
            ) *
            0.35;


        ctx.beginPath();


        ctx.arc(

            p.x,

            p.y,

            Math.max(
                0.3,
                p.size
            ),

            0,

            Math.PI * 2

        );


        ctx.fillStyle =
            `rgba(
                255,
                ${70 + brillo * 80},
                190,
                ${brillo}
            )`;


        ctx.shadowBlur =
            8 *
            p.escala;


        ctx.shadowColor =
            "#ff1493";


        ctx.fill();

    }


    ctx.shadowBlur = 0;

}


/* =========================================
   TEXTOS ALREDEDOR
========================================= */

const frases = [

    "Mi persona favorita",

    "Eres mi mundo",

    "Siempre tú",

    "Te quiero",

    "Mi lugar favorito",

    "Eres especial",

    "Gracias por existir"

];


function dibujarTextos3D() {

    frases.forEach(
        (texto, i) => {

            const angulo =
                performance.now() *
                0.0003 +
                i *
                (
                    Math.PI *
                    2 /
                    frases.length
                );


            const radio = 19;


            const punto = {

                x:
                    Math.cos(angulo) *
                    radio,

                y:
                    Math.sin(angulo) *
                    5,

                z:
                    Math.sin(angulo) *
                    radio

            };


            const rotado =
                rotarPunto(punto);


            const p =
                proyectar(rotado);


            ctx.save();


            ctx.font =
                "bold 13px Arial";


            ctx.textAlign =
                "center";


            ctx.fillStyle =
                "#ff9bd0";


            ctx.shadowBlur =
                12;


            ctx.shadowColor =
                "#ff1493";


            ctx.globalAlpha =
                Math.max(
                    0.2,
                    Math.min(
                        1,
                        p.escala
                    )
                );


            ctx.fillText(
                texto,
                p.x,
                p.y
            );


            ctx.restore();

        }
    );

}


/* =========================================
   ANILLO 3D
========================================= */

function dibujarAnillo() {

    const centroX =
        W / 2;


    const centroY =
        H / 2 + 155;


    ctx.save();


    ctx.translate(
        centroX,
        centroY
    );


    ctx.rotate(
        rotY * 0.4
    );


    ctx.beginPath();


    ctx.ellipse(

        0,

        0,

        120 * zoom,

        30 * zoom,

        0,

        0,

        Math.PI * 2

    );


    ctx.strokeStyle =
        "rgba(255,50,190,.7)";


    ctx.lineWidth = 1;


    ctx.shadowBlur = 15;


    ctx.shadowColor =
        "#ff1493";


    ctx.stroke();


    ctx.restore();


    ctx.shadowBlur = 0;

}


/* =========================================
   HELLO KITTY 3D
========================================= */

function moverKitties() {

    /*
       Posiciones 3D
       alrededor del corazón
    */

    const posiciones = [

        {
            x: -23,
            y: -12,
            z: 20
        },

        {
            x: 23,
            y: -10,
            z: -20
        },

        {
            x: -24,
            y: 13,
            z: -30
        },

        {
            x: 23,
            y: 14,
            z: 30
        }

    ];


    kittyImages.forEach(
        (kitty, i) => {

            /*
               Si hay más imágenes
               de las posiciones,
               usamos una posición
               calculada.
            */

            let p =
                posiciones[i];


            if (!p) {

                const angulo =
                    i *
                    1.5;

                p = {

                    x:
                        Math.cos(angulo) *
                        25,

                    y:
                        Math.sin(angulo) *
                        15,

                    z:
                        Math.sin(angulo) *
                        20

                };

            }


            /*
               Aplicamos la misma
               rotación 3D del corazón.
            */

            const rotado =
                rotarPunto(p);


            const proyectado =
                proyectar(rotado);


            /*
               Tamaño dependiendo
               de la profundidad.
            */

            const escala =
                Math.max(
                    0.4,
                    Math.min(
                        1.4,
                        proyectado.escala
                    )
                );


            /*
               Posición en pantalla
            */

            kitty.style.left =
                (
                    proyectado.x -
                    40
                ) +
                "px";


            kitty.style.top =
                (
                    proyectado.y -
                    40
                ) +
                "px";


            /*
               Tamaño 3D
            */

            kitty.style.transform =
                `scale(${escala})`;


            /*
               Profundidad
            */

            kitty.style.opacity =
                Math.max(
                    0.35,
                    Math.min(
                        1,
                        proyectado.escala
                    )
                );


            /*
               Las que están atrás
               quedan visualmente
               más pequeñas.
            */

            kitty.style.zIndex =
                Math.round(
                    100 +
                    proyectado.z
                );

        }
    );

}


/* =========================================
   CONTROL MANUAL
========================================= */


/*
   Detectar si agarramos
   el corazón
*/

function estaSobreElCorazon(
    x,
    y
) {

    const centroX =
        W / 2;


    const centroY =
        H / 2;


    const distancia =
        Math.sqrt(

            Math.pow(
                x - centroX,
                2
            )

            +

            Math.pow(
                y - centroY,
                2
            )

        );


    return (
        distancia <
        230 * zoom
    );

}


/*
   TOCAR / AGARRAR
*/

canvas.addEventListener(
    "pointerdown",
    (e) => {

        const x =
            e.clientX;


        const y =
            e.clientY;


        if (
            !estaSobreElCorazon(
                x,
                y
            )
        ) {

            return;

        }


        dragging = true;


        lastX = x;

        lastY = y;


        canvas.setPointerCapture(
            e.pointerId
        );

    }
);


/*
   MOVER
*/

canvas.addEventListener(
    "pointermove",
    (e) => {

        if (!dragging) {
            return;
        }


        const x =
            e.clientX;


        const y =
            e.clientY;


        const movimientoX =
            x - lastX;


        const movimientoY =
            y - lastY;


        /*
           Girar izquierda/derecha
        */

        rotY +=
            movimientoX *
            0.012;


        /*
           Girar arriba/abajo
        */

        rotX +=
            movimientoY *
            0.012;


        /*
           Límite vertical
        */

        rotX =
            Math.max(

                -Math.PI / 2,

                Math.min(
                    Math.PI / 2,
                    rotX
                )

            );


        lastX = x;

        lastY = y;

    }
);


/*
   SOLTAR
*/

canvas.addEventListener(
    "pointerup",
    (e) => {

        dragging = false;


        try {

            canvas.releasePointerCapture(
                e.pointerId
            );

        } catch (error) {}

    }
);


/*
   CANCELAR
*/

canvas.addEventListener(
    "pointercancel",
    () => {

        dragging = false;

    }
);


/* =========================================
   ZOOM CON RUEDA
========================================= */

canvas.addEventListener(
    "wheel",
    (e) => {

        e.preventDefault();


        zoom +=
            e.deltaY *
            -0.001;


        zoom =
            Math.max(
                0.5,

                Math.min(
                    2,
                    zoom
                )

            );

    },
    {
        passive: false
    }
);


/* =========================================
   DOBLE CLICK
   RESTABLECER
========================================= */

canvas.addEventListener(
    "dblclick",
    () => {

        rotX = -0.15;

        rotY = 0;

        rotZ = 0;

        zoom = 1;

    }
);


/* =========================================
   ANIMACIÓN INFINITA
========================================= */

function animar() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    /*
       Fondo
    */

    dibujarEstrellas();


    /*
       Anillo
    */

    dibujarAnillo();


    /*
       Corazón
    */

    dibujarCorazon();


    /*
       Textos
    */

    dibujarTextos3D();


    /*
       Hello Kitty
    */

    moverKitties();


    /*
       Continuar para siempre
    */

    requestAnimationFrame(
        animar
    );

}


animar();