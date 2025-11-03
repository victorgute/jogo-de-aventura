import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { PeDeCabra, CartaoAcesso, Lanterna } from "./FerramentasAurora.js"; // Importa Lanterna

// --- Objeto da Sala do Reator (BUG CORRIGIDO) ---
export class PainelEnergia extends Objeto {
	constructor() {
		super("painel_energia",
              "Um painel de energia solto na parede.",
			  "O painel foi arrancado. Há um slot de cartão atrás dele.");
	}

	usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        
        // CORREÇÃO DO BUG "USO DUPLO":
        // Checa se a ação já foi feita
        if (this.acaoOk) {
            console.log("O painel já foi arrancado.");
            return false;
        }

		if (ferramenta instanceof PeDeCabra) {
			this.acaoOk = true; // Muda a descrição
			return true;
		}
		return false;
	}
}

// --- Objeto Armadilha (igual) ---
export class PainelExposto extends Objeto {
	constructor() {
		super("painel_exposto",
              "Um painel elétrico com fios expostos e faíscas.",
			  "VOCÊ ROMPEU A TUBULAÇÃO DE PLASMA!");
	}
	usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (this.acaoOk) return false; // Não pode ser usado duas vezes

		if (ferramenta instanceof PeDeCabra) {
            this.acaoOk = true;
            return true; // Ativa a armadilha
        }
		return false;
	}
}

// --- NOVOS OBJETOS (Para 4ª Sala) ---

// A porta trancada
export class PortaControle extends Objeto {
    constructor() {
        super("porta_controle",
              "A porta trancada da Sala de Controle. Requer um cartão.",
              "A porta da Sala de Controle está destrancada.");
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (this.acaoOk) return false;

        if (ferramenta instanceof CartaoAcesso) {
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

// O console final
export class ConsoleSuporteVida extends Objeto {
    constructor() {
        super("console_suporte_vida",
              "O console do Suporte de Vida. Está desligado e o painel de reparo está escuro.",
              "O console brilha em verde. SISTEMAS REATIVADOS.");
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (this.acaoOk) return false;

        // Requer a Lanterna para "iluminar" o reparo
        if (ferramenta instanceof Lanterna) {
            if (ferramenta.usar()) { // O 'usar' da Lanterna checa a bateria
                this.acaoOk = true;
                return true;
            } else {
                console.log("A lanterna está sem bateria para iluminar o painel!");
                return false;
            }
        }
        return false;
    }
}