import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/universidad.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

const client = new proto.UniversidadService(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

client.AgregarEstudiante(
    {
        ci: "67890",
        nombres: "Juan",
        apellidos: "Chavez",
        carrera: "Ingeniería Civil",
    },
    (err, response) => {
        if (err) return console.error("Error al agregar estudiante:", err);
        console.log("Estudiante agregado:", response.estudiante);

        client.AgregarCurso(
            { codigo: "CV201", nombre: "Mecánica de Materiales", docente: "Ing. Rojas" },
            (err, response) => {
                if (err) return console.error("Error al agregar curso 1:", err);
                console.log("Curso agregado:", response.curso);

                client.AgregarCurso(
                    { codigo: "CV202", nombre: "Estructuras", docente: "Ing. Méndez" },
                    (err, response) => {
                        if (err) return console.error("Error al agregar curso 2:", err);
                        console.log("Curso agregado:", response.curso);

                        client.InscribirEstudiante(
                            { ci: "67890", codigo_curso: "CV201" },
                            (err, response) => {
                                if (err) return console.error("Error al inscribir en curso 1:", err);
                                console.log(response.mensaje);

                                client.InscribirEstudiante(
                                    { ci: "67890", codigo_curso: "CV202" },
                                    (err, response) => {
                                        if (err) return console.error("Error al inscribir en curso 2:", err);
                                        console.log(response.mensaje);

                                        client.ListarCursosDeEstudiante(
                                            { ci: "67890" },
                                            (err, response) => {
                                                if (err) return console.error("Error al listar cursos:", err);
                                                console.log("Cursos del estudiante:", response.cursos);

                                                client.ListarEstudiantesDeCurso(
                                                    { codigo: "CV201" },
                                                    (err, response) => {
                                                        if (err) return console.error("Error al listar estudiantes:", err);
                                                        console.log("Estudiantes del curso CV201:", response.estudiantes);
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);
