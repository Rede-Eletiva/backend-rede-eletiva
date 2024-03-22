import "dotenv/config";
import JWT from "jsonwebtoken";

export const authService = {
  generateToken(payload) {
    return new Promise((resolve, reject) => {
      JWT.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: "1d" },

        function (err, token) {
          if (err) {
            reject(new Error("ERR_INVALID_TOKEN"));
          } else {
            resolve(token);
          }
        }
      );
    });
  },
  verifyToken(token) {
    try {
      const decodedToken = JWT.verify(token, process.env.SECRET_KEY);
      if (!decodedToken.id) {
        throw new Error("ID do usuário não encontrado no token");
      }

          
      return decodedToken;
    } catch (error) {
      return null;
    }
  },

  authenticateRequest: (request, reply, done) => {
    const token = request.headers.authorization?.replace(/^Bearer /, "");

    if (!token) {
      reply.status(401).send({ message: "Rota não autorizado!" });
      return done();
    }

    const validate = authService.verifyToken(token);

    if (!validate) {
      reply.status(404).send({ message: "Não autorizado: Token Inválido" });
      return done();
    }

    request.data = validate;

    done();
  },
};
