import { BaseModel, Form, FormField, ModelDto } from '../models/index.js'

export class FormBuilder<Model extends BaseModel, ExtraFields extends object = {}> {
  private _form: Form<Model, ExtraFields> = { fields: {} } as Form<Model, ExtraFields>

  constructor() {}

  build(): Form<Model, ExtraFields> {
    return this._form
  }

  get form() {
    return this._form
  }

  add<Key extends keyof ModelDto<Model, ExtraFields>>(field: FormField<Model, Key, ExtraFields>) {
    this._form.fields[field.accessKey] = field
    return this
  }
}
