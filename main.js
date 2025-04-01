// Definición de la clase Matriz
class Matriz {
    constructor(filas, columnas) {
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = this.crearMatriz();
    }

    // Método para crear una matriz llena de ceros
    crearMatriz() {
        let matriz = [];
        for (let i = 0; i < this.filas; i++) {
            matriz[i] = [];
            for (let j = 0; j < this.columnas; j++) {
                matriz[i][j] = 0;
            }
        }
        return matriz;
    }

    // Método para llenar la matriz con valores ingresados por el usuario
    llenarMatriz() {
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                this.matriz[i][j] = parseFloat(prompt(`Ingrese el valor para la posición [${i + 1},${j + 1}]:`));
            }
        }
    }
}

// Función para resolver un sistema de ecuaciones 2x2
function resolver2x2(matriz) {
    let a = matriz[0][0];
    let b = matriz[0][1];
    let c = matriz[1][0];
    let d = matriz[1][1];
    let e = matriz[0][2];
    let f = matriz[1][2];

    let determinante = a * d - b * c;

    if (determinante === 0) {
        return "El sistema no tiene solución única.";
    }

    let x = (e * d - b * f) / determinante;
    let y = (a * f - e * c) / determinante;

    return { x, y };
}

// Función para resolver un sistema de ecuaciones 3x3
function resolver3x3(matriz) {
    let a = matriz[0][0];
    let b = matriz[0][1];
    let c = matriz[0][2];
    let d = matriz[1][0];
    let e = matriz[1][1];
    let f = matriz[1][2];
    let g = matriz[2][0];
    let h = matriz[2][1];
    let i = matriz[2][2];
    let j = matriz[0][3];
    let k = matriz[1][3];
    let l = matriz[2][3];

    let determinante = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

    if (determinante === 0) {
        return "El sistema no tiene solución única.";
    }

    let x = (j * (e * i - f * h) - b * (k * i - f * l) + c * (k * h - e * l)) / determinante;
    let y = (a * (k * i - f * l) - j * (d * i - f * g) + c * (d * l - k * g)) / determinante;
    let z = (a * (e * l - k * h) - b * (d * l - k * g) + j * (d * h - e * g)) / determinante;

    return { x, y, z };
}

// Función principal
function main() {
    let filas = parseInt(prompt("Ingrese el número de filas:"));
    let columnas = parseInt(prompt("Ingrese el número de columnas:"));

    if ((filas === 2 && columnas === 3) || (filas === 3 && columnas === 4)) {
        let matriz = new Matriz(filas, columnas);
        matriz.llenarMatriz();

        console.log("Matriz ingresada:");
        console.log(matriz.matriz);

        let solucion;
        if (filas === 2 && columnas === 3) {
            solucion = resolver2x2(matriz.matriz);
            console.log("Solución del sistema 2x2:");
        } else if (filas === 3 && columnas === 4) {
            solucion = resolver3x3(matriz.matriz);
            console.log("Solución del sistema 3x3:");
        }

        console.log(solucion);
    } else {
        console.log("El sistema no es válido. Debe ser 2x3 para 2x2 o 3x4 para 3x3.");
    }
}
