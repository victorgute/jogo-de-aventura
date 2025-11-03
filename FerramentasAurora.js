import { Ferramenta } from "./Basicas.js";

// --- FERRAMENTA COM BATERIA (Já funciona) ---
export class Lanterna extends Ferramenta {
    #bateria;
	constructor() {
		super("lanterna");
        this.#bateria = 50;
	}
    get bateria() { return this.#bateria; }
    temBateria() { return this.#bateria > 0; }
    recarregar() {
        this.#bateria = 100;
        console.log("[Lanterna] Bateria recarregada para 100%.");
    }
    gastarBateria(quantidade = 10) {
        if (this.#bateria > 0) {
            this.#bateria -= quantidade;
            if (this.#bateria <= 0) {
                this.#bateria = 0;
                console.log("[Lanterna] A bateria acabou!");
            } else {
                console.log(`[Lanterna] Bateria agora em ${this.#bateria}%.`);
            }
        }
    }
    usar() {
        if (!this.temBateria()) {
            console.log("[Lanterna] Não pode ser usada. Bateria esgotada.");
            return false;
        }
        return true; // Retorna true se ainda tem bateria
    }
}

// --- FERRAMENTA DESCARTÁVEL (Requisito) ---
export class PeDeCabra extends Ferramenta {
    #usos;
    constructor() {
        super("pe_de_cabra");
        this.#usos = 2; // Só pode ser usado 2 vezes
    }

    // Sobrescreve o método 'usar'
    usar() {
        if (this.#usos > 0) {
            this.#usos -= 1;
            console.log(`[Pe de Cabra] Você usou o pé de cabra. Usos restantes: ${this.#usos}`);
            if (this.#usos === 0) {
                console.log("[Pe de Cabra] O pé de cabra quebrou!");
            }
            return true; // Sucesso ao usar
        } else {
            console.log("[Pe de Cabra] O pé de cabra está quebrado e não pode ser usado.");
            return false; // Falha ao usar
        }
    }
}

// --- Próxima ferramenta (Progresso) ---
export class CartaoAcesso extends Ferramenta {
    constructor() {
        super("cartao_acesso");
    }
}


// --- Ferramentas de Teste (Pode remover se quiser) ---
export class FerramentaTeste1 extends Ferramenta { constructor() { super("teste1"); } }
export class FerramentaTeste2 extends Ferramenta { constructor() { super("teste2"); } }
export class FerramentaTeste3 extends Ferramenta { constructor() { super("teste3"); } }