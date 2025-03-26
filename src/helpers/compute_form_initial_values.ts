import { BaseModel, Form, FormInitialValues, ObjectEntries } from '../models/index.js'

export async function computeFormInitialValues<Model extends BaseModel, ExtraFields extends object>(
  form: Form<Model, ExtraFields>,
  instance?: InstanceType<Model>
): Promise<FormInitialValues<Model, ExtraFields>> {
  const initialValues: FormInitialValues<Model, ExtraFields> = {} as FormInitialValues<
    Model,
    ExtraFields
  >
  const formEntries = Object.entries(form.fields) as ObjectEntries<typeof form.fields>

  await Promise.all(
    formEntries.map(async ([, field]) => {
      initialValues[field.accessKey] = instance
        ? await field.valueAccessor(instance)
        : field.initialValue
    })
  )

  return initialValues
}
