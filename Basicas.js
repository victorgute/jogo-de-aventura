import { validate } from "bycontract";
// CORREÇÃO 1: Importação do prompt-sync
import * as promptSyncPackage from 'prompt-sync';
const promptsync = promptSyncPackage.default;
const prompt = promptsync({ sigint: true });
// ---------------------------------------------
export class Ferramenta {
	#nome;

	constructor(nome) {
        validate(nome,"String");
		this.#nome = nome;
	}

	get nome() {
		return this.#nome;
	}
	
	usar() {
		return true;
	}
}

export class Mochila{
	#ferramentas;

	constructor(){
		this.#ferramentas = [];
	}

	guarda(ferramenta){
		validate(ferramenta,Ferramenta);
		this.#ferramentas.push(ferramenta);
	}

	pega(nomeFerramenta){
		validate(arguments,["String"]);
		let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
		return ferramenta;
	}

	tem(nomeFerramenta){
		validate(arguments,["String"]);
		return this.#ferramentas.some(f => f.nome === nomeFerramenta);
	}

	inventario(){
		return this.#ferramentas.map(obj => obj.nome).join(", ");
	}
}

// ---------------------------------------------
export class Objeto {
	#nome;
    #descricaoAntesAcao;
    #descricaoDepoisAcao;
    #acaoOk;
    	
	constructor(nome,descricaoAntesAcao, descricaoDepoisAcao) {
		validate(arguments,["String","String","String"]);
		this.#nome = nome;
		this.#descricaoAntesAcao = descricaoAntesAcao;
		this.#descricaoDepoisAcao = descricaoDepoisAcao;
		this.#acaoOk = false;
	}
	
	get nome(){
		return this.#nome;
	}

	get acaoOk() {
		return this.#acaoOk;
	}

	set acaoOk(acaoOk) {
		validate(acaoOk,"Boolean");
		this.#acaoOk = acaoOk;
	}

	get descricao() {
		if (!this.acaoOk) {
			return this.#descricaoAntesAcao;
		}else {
			return this.#descricaoDepoisAcao;
		}
	}

	usa(ferramenta,objeto){
	}
}
// ---------------------------------------------
export class Sala {
	#nome;
	#objetos;
	#ferramentas;
	#portas;
	#engine;
	
	constructor(nome,engine) {
		validate(arguments,["String",Engine]);
		this.#nome = nome;
		this.#objetos = new Map();
		this.#ferramentas = new Map();
		this.#portas = new Map();
		this.#engine = engine;
	}

	get nome() {
		return this.#nome;
	}
	
	
	get objetos() {
		return this.#objetos;
	}

	get ferramentas() {
		return this.#ferramentas;
	}
	
	get portas(){
		return this.#portas;
	}

	get engine(){
		return this.#engine;
	}
	
	objetosDisponiveis(){
		let arrObjs = [...this.#objetos.values()];
    	return arrObjs.map(obj=>obj.nome+":"+obj.descricao);
	}

	ferramentasDisponiveis(){
		let arrFer = [...this.#ferramentas.values()];
    	return arrFer.map(f=>f.nome);		
	}
	
	portasDisponiveis(){
		let arrPortas = [...this.#portas.values()];
    	return arrPortas.map(sala=>sala.nome);
	}
	
	// 'pega' com a correção do 'return false' da mochila
	pega(nomeFerramenta) {
		validate(nomeFerramenta,"String");
		let ferramenta = this.#ferramentas.get(nomeFerramenta);
		if (ferramenta != null) {
			if (this.#engine.mochila.guarda(ferramenta)) {
                this.#ferramentas.delete(nomeFerramenta);
			    return true; // Sucesso
            } else {
                return false; // Mochila cheia, falhou
            }
		}else {
			return false; // Ferramenta não está na sala
		}
	}

	sai(porta) {
		validate(porta,"String");
		return this.#portas.get(porta);
	}

	textoDescricao() {
		let descricao = "Você está no "+this.nome+"\n";
        if (this.objetos.size == 0){
            descricao += "Não há objetos na sala\n";
        }else{
            descricao += "Objetos: "+this.objetosDisponiveis()+"\n";
        }
        if (this.ferramentas.size == 0){
            descricao += "Não há ferramentas na sala\n";
        }else{
            descricao += "Ferramentas: "+this.ferramentasDisponiveis()+"\n";
        }
        descricao += "Portas: "+this.portasDisponiveis()+"\n";
		return descricao;
	}

	usa(ferramenta,objeto){
		return false;
	}
}
// ---------------------------------------------
// Engine
// ---------------------------------------------
export class Engine{
	#mochila;
	#salaCorrente;
	#fim;
    #venceu; // Atributo para vitória

	constructor(){
		this.#mochila = new Mochila();
		this.#salaCorrente = null;
		this.#fim = false;
        this.#venceu = false;
	}

	get mochila(){
		return this.#mochila;
	}

    get fim(){
        return this.#fim;
    }

    get venceu(){ 
        return this.#venceu;
    }

	get salaCorrente(){
		return this.#salaCorrente;
	}

	set salaCorrente(sala){
		validate(sala,Sala);
		this.#salaCorrente = sala;
	}

	indicaFimDeJogo(){
		this.#fim = true;
	}

    indicaVitoria(){
        this.#venceu = true;
        this.indicaFimDeJogo(); // Vencer também termina o jogo
    }

	criaCenario(){}

	joga() {
		let novaSala = null;
		let acao = "";
		let tokens = null;
		while (!this.#fim) {
			console.log("-------------------------");
			console.log(this.salaCorrente.textoDescricao());
			acao = prompt("O que voce deseja fazer? ");
			tokens = acao.split(" ");
			switch (tokens[0]) {
			case "fim":
				this.#fim = true;
				break;
			case "pega":
				if (this.salaCorrente.pega(tokens[1])) {
					console.log("Ok! " + tokens[1] + " guardado!");
				} else {
					console.log("Não foi possível pegar " + tokens[1] + ". (Não está na sala ou a mochila está cheia)");
				}
				break;
            case "larga":
                if (tokens[1]) {
                    let ferramenta = this.mochila.larga(tokens[1]); 
                    if (ferramenta) {
                        this.salaCorrente.ferramentas.set(ferramenta.nome, ferramenta);
                        console.log(ferramenta.nome + " largado no chão.");
                    } else {
                        console.log("Você não tem " + tokens[1] + ".");
                    }
                } else {
                    console.log("Largar o quê?");
                }
                break;
			case "inventario":
				console.log("Ferramentas disponiveis: " + this.mochila.inventario());
				break;
			case "usa":
					if (this.salaCorrente.usa(tokens[1],tokens[2])) {
						console.log("Feito !!");
						if (this.venceu == true){ // Correção do bug "Parabéns"
							console.log("Parabens, voce venceu!");
						}
					} else {
						console.log("Não é possível usar " + tokens[1] + " sobre " + tokens[2] + " nesta sala");
					}
				break;
			case "sai":
				novaSala = this.salaCorrente.sai(tokens[1]);
				if (novaSala == null) {
					console.log("Sala desconhecida ...");
				} else {
					this.#salaCorrente = novaSala;
                    if (this.#salaCorrente.escura) { 
                        if (this.mochila.tem("lanterna")) {
                            let lanterna = this.mochila.pega("lanterna");
                            if (lanterna.temBateria()) {
                                lanterna.gastarBateria(10);
                            } else {
                                console.log("Você entra na sala escura, mas a bateria da lanterna acabou!");
                            }
                        } else {
                            console.log("Você entra em uma sala escura sem lanterna!");
                        }
                    }
				}
				break;
			default:
				console.log("Comando desconhecido: " + tokens[0]);
				break;
			}
		}
		console.log("Jogo encerrado!");
        if (this.#fim && !this.#venceu){
            console.log("VOCÊ FALHOU."); // Mensagem de derrota
        }
	}
} // <-- ESTA CHAVE ESTAVA FALTANDO