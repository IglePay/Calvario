export const hasPermission = (permisosUsuario = [], permiso) => {
    const result = permisosUsuario.includes(permiso)

    console.log(
        "required:",
        permiso,
        "user:",
        permisosUsuario,
        "result:",
        result,
    )

    return result
}
