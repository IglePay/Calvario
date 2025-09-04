import Link from "next/link"

const CreateP = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-base-100 ">
            <h1 className="text-2xl font-bold mb-4">Nuevo Registro</h1>
            <div className="flex flex-wrap gap-2 col-span-full w-full ">
                <Link
                    href="/control/panel"
                    className="btn btn-primary rounded-2xl ml-3 sm:ml-10 ">
                    Regresar
                </Link>
            </div>

            <div className="w-full max-w-7xl bg-base-200 p-3 rounded-lg shadow-lg mt-4">
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="label">Foto</label>
                        <input type="file" className="file-input w-full" />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Identificación</label>
                        <input
                            type="text"
                            placeholder="409011"
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ingrese su nombre"
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Apellido</label>
                        <input
                            type="text"
                            placeholder="Ingrese su apellido"
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Correo</label>
                        <input
                            type="email"
                            placeholder="Ingrese email"
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Teléfono</label>
                        <input
                            type="text"
                            placeholder="Número de teléfono"
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Fecha de nacimiento</label>
                        <input type="date" className="input w-full" />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Sexo</label>
                        <select className="input w-full">
                            <option value="">Seleccione</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Dirección</label>
                        <input
                            type="text"
                            placeholder="Ingrese su dirección"
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Estado civil</label>
                        <select className="input w-full">
                            <option value="">Seleccione</option>
                            <option value="S">Soltero</option>
                            <option value="C">Casado</option>
                            <option value="D">Divorciado</option>
                            <option value="V">Viudo</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">
                            Año de inicio en la iglesia
                        </label>
                        <input type="date" className="input w-full" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="checkbox checkbox-neutral"
                        />
                        <label>Bautizado?</label>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Fecha de Bautismo</label>
                        <input type="date" className="input w-full" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="checkbox checkbox-neutral"
                        />
                        <label>Es servidor en nuestra iglesia?</label>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Procesos completados</label>
                        <input
                            type="text"
                            placeholder="Ingrese procesos"
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Grupo al que pertenece?</label>
                        <select className="input w-full">
                            <option value="">Seleccione</option>
                            <option value="S">Sí</option>
                            <option value="N">No</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Área de servicio</label>
                        <input
                            type="text"
                            placeholder="Ingrese área"
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">
                            Lo favorito en la iglesia
                        </label>
                        <input className="input w-full" />
                    </div>

                    <div className="flex flex-wrap gap-2 col-span-full items-center justify-center">
                        <button className="btn btn-accent w-auto rounded-2xl">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateP
