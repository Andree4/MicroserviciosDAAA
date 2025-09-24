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

const estudiantes = [];
const cursos = [];
const inscripciones = [];

const serviceImpl = {
    AgregarEstudiante: (call, callback) => {
        const estudiante = call.request;
        const existe = estudiantes.find((e) => e.ci === estudiante.ci);
        if (existe) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "El estudiante ya existe",
            });
            return;
        }
        estudiantes.push(estudiante);
        callback(null, { estudiante });
    },

    AgregarCurso: (call, callback) => {
        const curso = call.request;
        const existe = cursos.find((c) => c.codigo === curso.codigo);
        if (existe) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "El curso ya existe",
            });
            return;
        }
        cursos.push(curso);
        callback(null, { curso });
    },

    InscribirEstudiante: (call, callback) => {
        const { ci, codigo_curso } = call.request;

        const estudiante = estudiantes.find((e) => e.ci === ci);
        if (!estudiante) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Estudiante no encontrado",
            });
            return;
        }

        const curso = cursos.find((c) => c.codigo === codigo_curso);
        if (!curso) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Curso no encontrado",
            });
            return;
        }

        const yaInscrito = inscripciones.find(
            (i) => i.ci === ci && i.codigo_curso === codigo_curso
        );
        if (yaInscrito) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "El estudiante ya está inscrito en este curso",
            });
            return;
        }

        inscripciones.push({ ci, codigo_curso });
        callback(null, { mensaje: "Inscripción exitosa" });
    },

    ListarCursosDeEstudiante: (call, callback) => {
        const { ci } = call.request;
        const estudiante = estudiantes.find((e) => e.ci === ci);
        if (!estudiante) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Estudiante no encontrado",
            });
            return;
        }

        const cursosEstudiante = inscripciones
            .filter((i) => i.ci === ci)
            .map((i) => cursos.find((c) => c.codigo === i.codigo_curso))
            .filter((c) => c);
        callback(null, { cursos: cursosEstudiante });
    },

    ListarEstudiantesDeCurso: (call, callback) => {
        const { codigo } = call.request;
        const curso = cursos.find((c) => c.codigo === codigo);
        if (!curso) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Curso no encontrado",
            });
            return;
        }

        const estudiantesCurso = inscripciones
            .filter((i) => i.codigo_curso === codigo)
            .map((i) => estudiantes.find((e) => e.ci === i.ci))
            .filter((e) => e); // Filtrar posibles nulos
        callback(null, { estudiantes: estudiantesCurso });
    },
};

const server = new grpc.Server();
server.addService(proto.UniversidadService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, bindPort) => {
        if (err) {
            console.error("Error al iniciar el servidor:", err);
            return;
        }
        console.log(`Servidor gRPC escuchando en el puerto ${bindPort}`);
        server.start();
    }
);