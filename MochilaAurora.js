import { validate } from "bycontract";
import { Ferramenta } from "./Basicas.js";

// Esta classe substitui a Mochila base
export class MochilaComLimite {
	#ferramentas;
	#limite;

	constructor(limite) {
		validate(limite, "Number");
		this.#ferramentas = [];
		this.#limite = limite;
	}

	// Método 'guarda' MODIFICADO
	guarda(ferramenta) {
		validate(ferramenta, Ferramenta);
		
		// VERIFICAÇÃO DO LIMITE
		if (this.#ferramentas.length >= this.#limite) {
			console.log("[Mochila] Mochila cheia! Não é possível guardar.");
			return false; // Retorna false se a mochila estiver cheia
		}

		this.#ferramentas.push(ferramenta);
		return true; // Retorna true se guardou com sucesso
	}

	// NOVO MÉTODO: larga
	larga(nomeFerramenta) {
		validate(arguments, ["String"]);
		
		const index = this.#ferramentas.findIndex(f => f.nome === nomeFerramenta);

		if (index === -1) {
			return null; // Não encontrou a ferramenta
		}

		// Remove a ferramenta do array e a retorna
		const ferramentaRemovida = this.#ferramentas.splice(index, 1);
		return ferramentaRemovida[0];
	}

	// --- Métodos originais (iguais ao Basicas.js) ---

	pega(nomeFerramenta) {
		validate(arguments, ["String"]);
		let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
		return ferramenta;
	}

	tem(nomeFerramenta) {
		validate(arguments, ["String"]);
		return this.#ferramentas.some(f => f.nome === nomeFerramenta);
	}

	inventario() {
		return this.#ferramentas.map(obj => obj.nome).join(", ");
	}
}