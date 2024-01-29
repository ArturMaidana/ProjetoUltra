const axios = require("axios");

async function viaCep(cep) {
  try {
    // Expressão regular para validar se o CEP possui 8 dígitos numéricos
    const cepRegex = /^[0-9]{8}$/;

    if (!cepRegex.test(cep)) {
      return {
        valid: false,
        error: "CEP inválido. Certifique-se de fornecer um CEP válido.",
      };
    }

    // Faz uma requisição à API do ViaCEP para obter informações sobre o CEP
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data = response.data;
    // Verifica se a resposta da API indica que o CEP não foi encontrado
    if (data.erro) {
      return {
        valid: false,
        error:
          "CEP não encontrado. Certifique-se de fornecer um CEP existente.",
      };
    }
    // Cria um objeto com as informações do CEP obtidas da resposta da API
    const result = {
      valid: true, // Indica que o CEP é válido e existe
      state: data.uf,
      city: data.localidade,
      neighborhood: data.bairro,
      avenue: data.logradouro,
    };

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = { viaCep };
