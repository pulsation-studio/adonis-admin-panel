import {
  __BaseInputProps,
  NumberInputProps,
  PasswordInputProps,
  TextInputProps,
} from '@mantine/core'
import { DatePickerInputProps } from '@mantine/dates'
import { HTMLInputTypeAttribute } from 'react'
import { BaseModel, ModelDto } from './index.js'
import { DateTime } from 'luxon'

export type FormInitialValues<Model extends BaseModel, ExtraFields extends object> = {
  [Key in keyof ModelDto<Model, ExtraFields>]: ModelDto<Model, ExtraFields>[Key]
}

export type FieldAttrs<
  Model extends BaseModel,
  Key extends keyof ModelDto<Model, ExtraFields>,
  ExtraFields extends object,
> = {
  readonly accessKey: Key
  readonly initialValue?: ModelDto<Model, ExtraFields>[Key]
  readonly valueAccessor?: (
    instance: InstanceType<Model>
  ) => Promise<ModelDto<Model, ExtraFields>[Key]> | ModelDto<Model, ExtraFields>[Key]
}

export type Form<Model extends BaseModel, ExtraFields extends object = {}> = {
  fields: {
    [Key in keyof ModelDto<Model, ExtraFields>]: FormField<Model, Key, ExtraFields>
  }
}

export abstract class FormField<
  Model extends BaseModel,
  Key extends keyof ModelDto<Model, ExtraFields>,
  ExtraFields extends object = {},
> {
  readonly accessKey: Key
  readonly type: HTMLInputTypeAttribute
  readonly initialValue: ModelDto<Model, ExtraFields>[Key]
  readonly props: __BaseInputProps
  readonly valueAccessor: (
    instance: InstanceType<Model>
  ) => Promise<ModelDto<Model, ExtraFields>[Key]> | ModelDto<Model, ExtraFields>[Key]

  readonly __toResolve: (keyof FormField<Model, Key, ExtraFields>)[] = []

  /**
   * Pourquoi ceci permet de ne pas faire new TextField<typeof MoModel, "maKey">({...})
   *
   * et de faire simpement TextField({...})
   * en permetant la reconaissance automatique de Model et Key d'apres les attrs passé dans le constructeur ?
   */
  declare private _: (field: FormField<Model, Key, ExtraFields>) => void

  constructor(
    attrs: {
      type: HTMLInputTypeAttribute
      initialValue: ModelDto<Model, ExtraFields>[Key]
    } & FieldAttrs<Model, Key, ExtraFields>,
    props: __BaseInputProps
  ) {
    props.required = props.required === undefined ? true : props.required

    // @ts-expect-error TS2536 : Typage a revoir pour éviter :
    // 'keyof ModelDto<Model, ExtraFields>'
    // cannot be used to index type 'InstanceType<Model>'
    const defaultValueAccessor = (instance: InstanceType<Model>) => instance[this.accessKey]

    this.accessKey = attrs.accessKey
    this.type = attrs.type
    this.initialValue = attrs.initialValue
    this.props = props
    this.valueAccessor = attrs.valueAccessor ?? defaultValueAccessor
  }
}

export class TextField<
  Model extends BaseModel,
  Key extends keyof ModelDto<Model, ExtraFields>,
  ExtraFields extends object,
> extends FormField<Model, Key, ExtraFields> {
  constructor(attrs: FieldAttrs<Model, Key, ExtraFields>, props: Omit<TextInputProps, 'type'>) {
    const initialValue = attrs.initialValue ?? ('' as ModelDto<Model, ExtraFields>[Key])
    super({ type: 'text', initialValue: initialValue, ...attrs }, props)
  }
}
export class NumberField<
  Model extends BaseModel,
  Key extends keyof ModelDto<Model, ExtraFields>,
  ExtraFields extends object,
> extends FormField<Model, Key, ExtraFields> {
  constructor(attrs: FieldAttrs<Model, Key, ExtraFields>, props: Omit<NumberInputProps, 'type'>) {
    const initialValue = attrs.initialValue ?? (0 as ModelDto<Model, ExtraFields>[Key])
    super({ type: 'number', initialValue: initialValue, ...attrs }, props)
  }
}

export class MailField<
  Model extends BaseModel,
  Key extends keyof ModelDto<Model, ExtraFields>,
  ExtraFields extends object,
> extends FormField<Model, Key, ExtraFields> {
  constructor(attrs: FieldAttrs<Model, Key, ExtraFields>, props: Omit<TextInputProps, 'type'>) {
    const initialValue = attrs.initialValue ?? ('' as ModelDto<Model, ExtraFields>[Key])
    super({ type: 'email', initialValue: initialValue, ...attrs }, props)
  }
}

export class PasswordField<
  Model extends BaseModel,
  Key extends keyof ModelDto<Model, ExtraFields>,
  ExtraFields extends object,
> extends FormField<Model, Key, ExtraFields> {
  constructor(attrs: FieldAttrs<Model, Key, ExtraFields>, props: Omit<PasswordInputProps, 'type'>) {
    const initialValue = attrs.initialValue ?? ('' as ModelDto<Model, ExtraFields>[Key])
    super({ type: 'password', initialValue: initialValue, ...attrs }, props)
  }
}

export type SelectOption = {
  value: string
  label: string
}

export type SelectOptions = SelectOption[]

type SelectFieldExtraProps = { options: () => Promise<SelectOptions> | SelectOptions }

export class SelectField<
  Model extends BaseModel,
  Key extends keyof ModelDto<Model, ExtraFields>,
  ExtraFields extends object,
> extends FormField<Model, Key, ExtraFields> {
  options: () => Promise<SelectOptions> | SelectOptions

  constructor(
    attrs: FieldAttrs<Model, Key, ExtraFields> & SelectFieldExtraProps,
    props: Omit<PasswordInputProps, 'type'>
  ) {
    const initialValue = attrs.initialValue ?? ('' as ModelDto<Model, ExtraFields>[Key])
    super({ type: 'select', initialValue: initialValue, ...attrs }, props)
    this.options = attrs.options
    this.__toResolve.push('options' as keyof FormField<Model, Key, ExtraFields>)
  }
}

export class DateTimeField<
  Model extends BaseModel,
  Key extends keyof ModelDto<Model, ExtraFields>,
  ExtraFields extends object,
> extends FormField<Model, Key, ExtraFields> {
  constructor(
    attrs: FieldAttrs<Model, Key, ExtraFields>,
    props: Omit<DatePickerInputProps, 'type'>
  ) {
    const initialValue = attrs.initialValue ?? (DateTime.now() as ModelDto<Model, ExtraFields>[Key])
    super({ type: 'datetime', initialValue: initialValue, ...attrs }, props)
  }
}

// export interface PhoneField<Model extends BaseModel, Key extends keyof ModelDto<Model>>
//   extends FormField<Model, Key> {
//   readonly type: 'tel'
// }

// export interface TextareaField<Model extends BaseModel, Key extends keyof ModelDto<Model>>
//   extends FormField<Model, Key> {
//   readonly type: 'textarea'
// }

// export interface NumberField<Model extends BaseModel, Key extends keyof ModelDto<Model>>
//   extends FormField<Model, Key> {
//   readonly type: 'number'
// }

// TODO : Ajouter MultiSelect, Checkbox, Radio, Time, DateTime, DateTimeLocal, File, Color, ....
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
