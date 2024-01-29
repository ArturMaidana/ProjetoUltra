class HttpResponse {
  constructor(res) {
    this.res = res;
  }

  created(data) {
    return this.res.status(201).json(data);
  }

  ok(data) {
    return this.res.status(200).json(data);
  }

  badRequest(message) {
    return this.res.status(400).json({
      error: message,
    });
  }

  unauthorized() {
    return this.res.status(401).json({
      error: "Usuário não autorizado.",
    });
  }

  forbidden(message) {
    return this.res.status(403).json({
      error: message,
    });
  }

  notFound(message) {
    return this.res.status(404).json({
      error: message,
    });
  }

  conflict(message) {
    return this.res.status(409).json({
      error: message,
    });
  }

  internalError(error) {
    return this.res.status(500).json({
      error: `Erro interno: ${error}`,
    });
  }
}

module.exports = { HttpResponse };
