import { __BaseInputProps } from '@mantine/core'

import { BaseModel, Form, FormInitialValues, HttpMethod } from './index.js'

export interface AdminFormProps<Model extends BaseModel, ExtraFields extends object = {}> {
  readonly submitPath: string
  readonly submitButtonLabel: string
  readonly form: Form<Model, ExtraFields>
  readonly initialValues: FormInitialValues<Model, ExtraFields>
  readonly httpMethod: HttpMethod
}
