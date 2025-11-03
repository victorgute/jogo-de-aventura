import { Engine, Sala } from "./Basicas.js";
import { MochilaComLimite } from "./MochilaAurora.js"; 
// Importa todas as 4 salas
import { BaiaMedica, CorredorTeste, SalaDoReator, SalaDeControle } from "./SalasAurora.js"; 

export class JogoAurora extends Engine {

    #minhaMochila;
    #salasDoJogo; // para guardar as salas

    constructor() {
        super(); 
        
        // 1. Inicializa os campos
        this.#salasDoJogo = new Map();
        this.#minhaMochila = new MochilaComLimite(3);

        // 2. AGORA chama o criaCenario
        this.criaCenario(); 
    }

    get mochila() {
        return this.#minhaMochila;
    }

    // Método que permite que uma sala encontre outra
    getSala(nomeSala) {
        return this.#salasDoJogo.get(nomeSala);
    }

    // criaCenario é chamado pelo super()
    criaCenario() {
        // Cria as 4 salas
        let s1 = new BaiaMedica(this);
        let s2 = new CorredorTeste(this); 
        let s3 = new SalaDoReator(this);
        let s4 = new SalaDeControle(this); // Cria a 4ª sala

        // Guarda as salas no Map
        this.#salasDoJogo.set(s1.nome, s1);
        this.#salasDoJogo.set(s2.nome, s2);
        this.#salasDoJogo.set(s3.nome, s3);
        this.#salasDoJogo.set(s4.nome, s4);

        // Conecta Baia <-> Corredor
        s1.portas.set(s2.nome, s2);
        s2.portas.set(s1.nome, s1); 

        // Conecta Corredor <-> Reator
        s2.portas.set(s3.nome, s3);
        s3.portas.set(s2.nome, s2);

        // A porta para s4 (Sala_de_Controle) NÃO é conectada aqui.
        // Ela será conectada dinamicamente no usa() do CorredorTeste.

        this.salaCorrente = s1; 
    }
}