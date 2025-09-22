export const validateForm = async (schema, values) => {
    try {
        await schema.validate(values, { abortEarly: false })
        return {} // No hay errores
    } catch (err) {
        const errors = {}
        if (err.inner) {
            err.inner.forEach((e) => {
                if (!errors[e.path]) errors[e.path] = e.message
            })
        }
        return errors
    }
}
