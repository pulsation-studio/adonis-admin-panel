import { BaseModel, Form, ObjectEntries } from '../models/index.js'

/**
 * Resolution of asynchronous FormField.options: () => Promise<SelectOptions>
 * (could be more than just the options in a future impl)
 * @param form : Form defined in admin config
 * @returns the FormFieldProps with FormField.options that has been asynchronously resolved
 * TODO : typage de retour a revoir
 */
export async function resolveFormFieldFunction<Model extends BaseModel, ExtraFields extends object>(
  form: Form<Model, ExtraFields>
): Promise<Form<Model, ExtraFields>> {
  const fieldEntries = Object.entries(form.fields) as ObjectEntries<typeof form.fields>

  const updatedFields = await Promise.all(
    fieldEntries.map(async ([fieldKey, field]) => {
      const attrEntries = await Promise.all(
        Object.entries(field).map(async ([attrKey, attr]) => {
          // @ts-expect-error TS2536 : Typage a revoir
          const isToResolve = field.__toResolve.includes(attrKey)

          if (isToResolve) return [attrKey, attr instanceof Function ? await attr() : await attr]
          else return [attrKey, attr]
        })
      )

      return [fieldKey, Object.fromEntries(attrEntries)]
    })
  )

  return { ...form, fields: Object.fromEntries(updatedFields) }
}
