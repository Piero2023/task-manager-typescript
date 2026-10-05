import { useEffect, useState } from "react";
import "./App.css";

type Tarea = {
  id: number;
  titulo: string;
  completada: boolean;
};

function App() {
  const [tareas, setTareas] = useState<Tarea[]>(() => {
    const tareasGuardadas = localStorage.getItem("tareas");

    if (tareasGuardadas) {
      return JSON.parse(tareasGuardadas);
    }

    return [
      {
        id: 1,
        titulo: "Estudiar TypeScript",
        completada: true,
      },
      {
        id: 2,
        titulo: "Hacer ejercicio",
        completada: false,
      },
      {
        id: 3,
        titulo: "Leer un libro",
        completada: true,
      },
      {
        id: 4,
        titulo: "Aprender React",
        completada: false,
      },
      {
        id: 5,
        titulo: "Construir proyecto personal",
        completada: false,
      },
    ];
  });

  const [titulo, setTitulo] = useState<string>("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Guardar tareas en localStorage
  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  // CREATE
  const agregarTarea = () => {
    if (titulo.trim() === "") return;

    const nuevaTarea: Tarea = {
      id: Date.now(),
      titulo: titulo.trim(),
      completada: false,
    };

    setTareas([...tareas, nuevaTarea]);
    setTitulo("");
  };

  // Preparar tarea para editar
  const editarTarea = (tarea: Tarea) => {
    setTitulo(tarea.titulo);
    setEditandoId(tarea.id);
  };

  // UPDATE
  const guardarEdicion = () => {
    if (titulo.trim() === "" || editandoId === null) return;

    setTareas(
      tareas.map((tarea) =>
        tarea.id === editandoId
          ? {
              ...tarea,
              titulo: titulo.trim(),
            }
          : tarea
      )
    );

    setTitulo("");
    setEditandoId(null);
  };

  // Cambiar estado
  const cambiarEstado = (id: number) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id
          ? {
              ...tarea,
              completada: !tarea.completada,
            }
          : tarea
      )
    );
  };

  // DELETE
  const eliminarTarea = (id: number) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));

    if (editandoId === id) {
      setTitulo("");
      setEditandoId(null);
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setTitulo("");
    setEditandoId(null);
  };

  // Enter para agregar o guardar
  const manejarEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (editandoId === null) {
        agregarTarea();
      } else {
        guardarEdicion();
      }
    }
  };

  return (
    <main className="app">
      {/* ENCABEZADO */}
      <header className="encabezado">
        <h1>Task Manager</h1>

        <p>CRUD de tareas con React + TypeScript</p>
      </header>

      {/* FORMULARIO */}
      <section className="formulario">
        <input
          type="text"
          placeholder={
            editandoId === null
              ? "Nueva tarea..."
              : "Editar tarea..."
          }
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          onKeyDown={manejarEnter}
        />

        {editandoId === null ? (
          <button
            className="boton boton-agregar"
            onClick={agregarTarea}
          >
            Agregar
          </button>
        ) : (
          <div className="botones-edicion">
            <button
              className="boton boton-agregar"
              onClick={guardarEdicion}
            >
              Guardar
            </button>

            <button
              className="boton boton-cancelar"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          </div>
        )}
      </section>

      {/* LISTA */}
      <section className="seccion-tareas">
        <h2>Mis tareas</h2>

        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th className="columna-numero">#</th>
                <th>Tarea</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tareas.map((tarea, index) => (
                <tr key={tarea.id}>
                  <td className="numero">
                    {index + 1}
                  </td>

                  <td
                    className={
                      tarea.completada
                        ? "titulo-tarea completada-texto"
                        : "titulo-tarea"
                    }
                  >
                    {tarea.titulo}
                  </td>

                  <td>
                    <button
                      className={
                        tarea.completada
                          ? "estado estado-completada"
                          : "estado estado-pendiente"
                      }
                      onClick={() => cambiarEstado(tarea.id)}
                    >
                      <span className="estado-icono">
                        {tarea.completada ? "✓" : "◷"}
                      </span>

                      {tarea.completada
                        ? "Completada"
                        : "Pendiente"}
                    </button>
                  </td>

                  <td>
                    <div className="acciones">
                      <button
                        className="boton boton-editar"
                        onClick={() => editarTarea(tarea)}
                      >
                        <span>✎</span>
                        Editar
                      </button>

                      <button
                        className="boton boton-eliminar"
                        onClick={() => eliminarTarea(tarea.id)}
                      >
                        <span>♜</span>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {tareas.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="sin-tareas"
                  >
                    No hay tareas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="contador">
          {tareas.length}{" "}
          {tareas.length === 1
            ? "tarea en total"
            : "tareas en total"}
        </p>
      </section>
    </main>
  );
}

export default App;