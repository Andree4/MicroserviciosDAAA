const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/calcular", (req, res) => {
    const { operacion, a, b } = req.body;

    const numA = parseFloat(a);
    const numB = parseFloat(b);
    let resultado;

    switch (operacion) {
        case "sumar":
            resultado = numA + numB;
            break;
        case "restar":
            resultado = numA - numB;
            break;
        case "multiplicar":
            resultado = numA * numB;
            break;
        case "dividir":
            resultado = numB === 0 ? "Error: División por cero" : numA / numB;
            break;
        default:
            resultado = "Operación no válida";
    }

    res.send(`
    <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Resultado</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f0f4f8;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }

      .container {
        background-color: #ffffff;
        padding: 30px 40px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 400px;
        width: 100%;
      }

      h2 {
        color: #0078d4;
        font-size: 24px;
        margin-bottom: 20px;
      }

      a {
        display: inline-block;
        padding: 10px 20px;
        background-color: #0078d4;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 16px;
        transition: background-color 0.3s ease;
      }

      a:hover {
        background-color: #005fa3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Resultado: ${resultado}</h2>
      <a href="/">Volver</a>
    </div>
  </body>
</html>
  `);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
