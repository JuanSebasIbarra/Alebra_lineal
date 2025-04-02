class Matriz {
    constructor(filas, columnas) {
        if (!Number.isInteger(filas) || !Number.isInteger(columnas) || filas <= 0 || columnas <= 0) {
            throw new Error("Las dimensiones deben ser enteros positivos");
        }
        
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = this._crearMatrizVacia();
    }

    // Crea una matriz llena de ceros
    _crearMatrizVacia() {
        return Array.from({length: this.filas}, () => 
            Array.from({length: this.columnas}, () => 0)
        );
    }

    // Llena la matriz desde un array bidimensional
    llenarDesdeArray(valores) {
        if (!Array.isArray(valores)) {
            throw new Error("Debe proporcionar un array bidimensional");
        }
        
        if (valores.length !== this.filas || valores[0].length !== this.columnas) {
            throw new Error("Las dimensiones del array no coinciden con la matriz");
        }
        
        this.matriz = valores.map(fila => [...fila]);
    }

    // Suma esta matriz con otra
    sumar(otraMatriz) {
        if (!(otraMatriz instanceof Matriz)) {
            throw new Error("Debe proporcionar una instancia de Matriz");
        }
        
        if (this.filas !== otraMatriz.filas || this.columnas !== otraMatriz.columnas) {
            throw new Error("Las matrices deben tener las mismas dimensiones para sumarse");
        }
        
        const resultado = new Matriz(this.filas, this.columnas);
        
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                resultado.matriz[i][j] = this.matriz[i][j] + otraMatriz.matriz[i][j];
            }
        }
        
        return resultado;
    }

    // Multiplica esta matriz por otra
    multiplicar(otraMatriz) {
        if (!(otraMatriz instanceof Matriz)) {
            throw new Error("Debe proporcionar una instancia de Matriz");
        }
        
        if (this.columnas !== otraMatriz.filas) {
            throw new Error("El número de columnas de la primera matriz debe coincidir con el número de filas de la segunda");
        }
        
        const resultado = new Matriz(this.filas, otraMatriz.columnas);
        
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < otraMatriz.columnas; j++) {
                let suma = 0;
                for (let k = 0; k < this.columnas; k++) {
                    suma += this.matriz[i][k] * otraMatriz.matriz[k][j];
                }
                resultado.matriz[i][j] = suma;
            }
        }
        
        return resultado;
    }

    // Calcula el determinante (solo para matrices cuadradas)
    calcularDeterminante() {
        if (this.filas !== this.columnas) {
            throw new Error("La matriz debe ser cuadrada para calcular el determinante");
        }
        
        // Caso base para matriz 1x1
        if (this.filas === 1) return this.matriz[0][0];
        
        // Caso para matriz 2x2
        if (this.filas === 2) {
            return this.matriz[0][0] * this.matriz[1][1] - this.matriz[0][1] * this.matriz[1][0];
        }
        
        // Caso para matriz 3x3 (Regla de Sarrus)
        if (this.filas === 3) {
            const [a, b, c] = this.matriz[0];
            const [d, e, f] = this.matriz[1];
            const [g, h, i] = this.matriz[2];
            
            return a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
        }
        
        // Para matrices n×n (expansión por cofactores)
        let det = 0;
        for (let j = 0; j < this.columnas; j++) {
            det += this.matriz[0][j] * this._calcularCofactor(0, j);
        }
        
        return det;
    }

    // Método auxiliar para calcular cofactores
    _calcularCofactor(fila, columna) {
        const submatriz = new Matriz(this.filas - 1, this.columnas - 1);
        let subi = 0;
        
        for (let i = 0; i < this.filas; i++) {
            if (i === fila) continue;
            
            let subj = 0;
            for (let j = 0; j < this.columnas; j++) {
                if (j === columna) continue;
                
                submatriz.matriz[subi][subj] = this.matriz[i][j];
                subj++;
            }
            subi++;
        }
        
        const signo = (fila + columna) % 2 === 0 ? 1 : -1;
        return signo * submatriz.calcularDeterminante();
    }

    // Calcula la matriz inversa (solo para matrices cuadradas invertibles)
    calcularInversa() {
        const det = this.calcularDeterminante();
        if (det === 0) {
            throw new Error("La matriz no tiene inversa (determinante = 0)");
        }
        
        // Caso especial para matriz 2x2
        if (this.filas === 2) {
            const [[a, b], [c, d]] = this.matriz;
            const inversa = new Matriz(2, 2);
            
            inversa.matriz = [
                [d/det, -b/det],
                [-c/det, a/det]
            ];
            
            return inversa;
        }
        
        // Método general para matrices n×n (usando matriz adjunta)
        const cofactores = new Matriz(this.filas, this.columnas);
        
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                cofactores.matriz[i][j] = this._calcularCofactor(i, j);
            }
        }
        
        // Transponer la matriz de cofactores para obtener la adjunta
        const adjunta = cofactores.transponer();
        
        // Multiplicar cada elemento por 1/det
        const inversa = new Matriz(this.filas, this.columnas);
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                inversa.matriz[i][j] = adjunta.matriz[i][j] / det;
            }
        }
        
        return inversa;
    }

    // Devuelve la matriz transpuesta
    transponer() {
        const resultado = new Matriz(this.columnas, this.filas);
        
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                resultado.matriz[j][i] = this.matriz[i][j];
            }
        }
        
        return resultado;
    }

    // Resuelve un sistema de ecuaciones (matriz aumentada [A|B])
    resolverSistema() {
        if (this.columnas !== this.filas + 1) {
            throw new Error("La matriz debe ser aumentada (n filas × n+1 columnas)");
        }
        
        // Método 1: Por matriz inversa (A⁻¹·B)
        try {
            const A = new Matriz(this.filas, this.filas);
            const B = new Matriz(this.filas, 1);
            
            // Separar la matriz de coeficientes y términos independientes
            for (let i = 0; i < this.filas; i++) {
                for (let j = 0; j < this.filas; j++) {
                    A.matriz[i][j] = this.matriz[i][j];
                }
                B.matriz[i][0] = this.matriz[i][this.filas]; // Última columna
            }
            
            const AInversa = A.calcularInversa();
            const X = AInversa.multiplicar(B);
            
            // Convertir el resultado a un array simple
            return X.matriz.map(fila => fila[0]);
            
        } catch (error) {
            throw new Error(`No se pudo resolver por inversa: ${error.message}`);
        }
    }

    // Método estático para crear matriz desde array
    static desdeArray(arr) {
        if (!Array.isArray(arr)) {
            throw new Error("Debe proporcionar un array");
        }
        
        const filas = arr.length;
        const columnas = arr[0].length;
        
        const matriz = new Matriz(filas, columnas);
        matriz.llenarDesdeArray(arr);
        
        return matriz;
    }
}

// Funciones adicionales (podrían ser métodos estáticos)
Matriz.resolverSistema2x2 = function(matriz) {
    const sistema = Matriz.desdeArray(matriz);
    return sistema.resolverSistema();
};

Matriz.resolverSistema3x3 = function(matriz) {
    const sistema = Matriz.desdeArray(matriz);
    return sistema.resolverSistema();
};

