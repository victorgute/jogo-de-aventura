import { Sala } from "./Basicas.js";
import { validate } from "bycontract"; // Importa o validate
import { Lanterna, PeDeCabra, CartaoAcesso } from "./FerramentasAurora.js";
// Importa todos os nossos objetos
import { PainelEnergia, PainelExposto, PortaControle, ConsoleSuporteVida } from "./ObjetosAurora.js"; 

// --- Classe base SalaAurora (igual) ---
class SalaAurora extends Sala {
    #escura;
    constructor(nome, engine, escura = false) {
        super(nome, engine);
        this.#escura = escura;
    }
    get escura() { return this.#escura; }
    textoDescricao() {
        let descricao = super.textoDescricao();
        if (this.#escura) {
            let mochila = this.engine.mochila;
            if (mochila.tem("lanterna")) {
                let lanterna = mochila.pega("lanterna");
                if (lanterna.temBateria()) {
                    descricao += "A sala está escura, mas sua lanterna ilumina o caminho.\n";
                } else {
                    descricao += "A SALA ESTÁ ESCURA. Sua lanterna está sem bateria. Você não enxerga nada!\n";
                }
            } else {
                descricao += "A SALA ESTÁ ESCURA. Você mal consegue ver.\n";
            }
        }
        return descricao;
    }
}

// --- Nossas Salas ---

export class BaiaMedica extends SalaAurora {
	constructor(engine) {
		super("Baia_Medica", engine, false); 
		let f1 = new Lanterna();
		this.ferramentas.set(f1.nome, f1);
	}
	usa(ferramenta, objeto) { return false; }
}

// --- CorredorTeste (Atualizado) ---
export class CorredorTeste extends SalaAurora {
    constructor(engine) {
        super("Corredor_Teste", engine, true);
        // Adiciona a porta trancada (Objeto)
        let porta = new PortaControle();
        this.objetos.set(porta.nome, porta);
    }
    
    // O Corredor agora tem lógica de 'usa'
    usa(nomeFerramenta, nomeObjeto) {
        validate(arguments, ["String", "String"]);
		if (!this.engine.mochila.tem(nomeFerramenta)) return false;
		if (!this.objetos.has(nomeObjeto)) return false;

        let ferramenta = this.engine.mochila.pega(nomeFerramenta);
        let objeto = this.objetos.get(nomeObjeto);

        if (objeto.usar(ferramenta)) { // Tenta usar a ferramenta no objeto
            // Se foi sucesso (usou o Cartão na Porta)
            if (objeto instanceof PortaControle && objeto.acaoOk) {
                console.log("A porta para a Sala_de_Controle se destrancou!");
                
                // CRIAÇÃO DINÂMICA DA PORTA:
                // Pega a instância da Sala de Controle (criada no JogoAurora.js)
                let salaDeControle = this.engine.getSala("Sala_de_Controle");
                if (salaDeControle) {
                    this.portas.set(salaDeControle.nome, salaDeControle);
                    salaDeControle.portas.set(this.nome, this);
                }
            }
            return true;
        }
        return false;
	}
}

// --- SalaDoReator (Atualizada) ---
export class SalaDoReator extends SalaAurora {
    constructor(engine) {
        super("Sala_do_Reator", engine, false);
        this.ferramentas.set("pe_de_cabra", new PeDeCabra());
        this.objetos.set("painel_energia", new PainelEnergia());
        this.objetos.set("painel_exposto", new PainelExposto());
    }

    usa(nomeFerramenta, nomeObjeto) {
		if (!this.engine.mochila.tem(nomeFerramenta)) return false;
		if (!this.objetos.has(nomeObjeto)) return false;

        let ferramenta = this.engine.mochila.pega(nomeFerramenta);
        let objeto = this.objetos.get(nomeObjeto);

        // O 'usar()' do objeto (PainelEnergia) agora checa o 'acaoOk'
        if (objeto.usar(ferramenta)) { 
            // CONDIÇÃO DE DERROTA (usa 'indicaFimDeJogo')
            if (objeto instanceof PainelExposto) {
                console.log("!!! ALERTA DE AUTODESTRUIÇÃO !!!");
                this.engine.indicaFimDeJogo(); // Jogo termina, 'venceu' = false
                return true;
            }

            // CONDIÇÃO DE PROGRESSO
            if (objeto instanceof PainelEnergia) {
                if (ferramenta.usar()) { // 'usar()' do PeDeCabra
                    this.ferramentas.set("cartao_acesso", new CartaoAcesso());
                    console.log("Ao arrancar o painel, um 'cartao_acesso' caiu no chão!");
                    return true;
                } else {
                    return false; // Pe de cabra quebrou antes de funcionar
                }
            }
        }
        console.log(`Não parece funcionar usar ${nomeFerramenta} em ${nomeObjeto}.`);
        return false;
	}
}

// --- 4ª SALA: SALA DE CONTROLE (NOVA) ---
export class SalaDeControle extends SalaAurora {
    constructor(engine) {
        super("Sala_de_Controle", engine, false);
        // Adiciona o console final
        let console = new ConsoleSuporteVida();
        this.objetos.set(console.nome, console);
    }

    usa(nomeFerramenta, nomeObjeto) {
        validate(arguments, ["String", "String"]);
		if (!this.engine.mochila.tem(nomeFerramenta)) return false;
		if (!this.objetos.has(nomeObjeto)) return false;

        let ferramenta = this.engine.mochila.pega(nomeFerramenta);
        let objeto = this.objetos.get(nomeObjeto);

        if (objeto.usar(ferramenta)) {
            // CONDIÇÃO DE VITÓRIA
            if (objeto instanceof ConsoleSuporteVida) {
                console.log("Você usa a lanterna para iluminar o painel e religar os sistemas.");
                this.engine.indicaVitoria(); // Jogo termina, 'venceu' = true
                return true;
            }
        }
        return false;
    }
}