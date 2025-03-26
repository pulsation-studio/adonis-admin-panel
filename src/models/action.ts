import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext, Request } from '@adonisjs/core/http'
import { ConfirmationModal } from './confirmation_modal_props.js'
import { BaseModel, ButtonIcon, HttpMethod, Resource } from './index.js'
import { Database } from '@adonisjs/lucid/database'

type ActionHandlingProps<Model extends BaseModel, P = {}> = P & {
  readonly model: Model
  readonly request: Request
  readonly db: Database
  // potientiellement récupérer tout le HttpContext
}

abstract class Action<Model extends BaseModel> {
  abstract handle: <P = {}>(props: ActionHandlingProps<Model, P & any>) => void
  constructor(
    readonly actionKey: string,
    readonly label: string,
    readonly behavior: BaseActionBehavior,
    readonly method: HttpMethod,
    readonly buttonIcon?: ButtonIcon,
    readonly onError?: (e: Exception, ctx: HttpContext) => unknown
    // readonly onSuccess
  ) {}

  isHeadless(): this is Action<Model> & { behavior: HeadlessAction } {
    return this.behavior.type === ActionBehavior.Headless
  }

  isRegular(): this is Action<Model> & { behavior: RegularAction<Model> } {
    return this.behavior.type === ActionBehavior.Regular
  }
}

class NoInstanceAction<Model extends BaseModel> extends Action<Model> {
  handle: <P = {}>(props: ActionHandlingProps<Model, P>) => void
  constructor(
    actionKey: string,
    label: string,
    behavior: BaseActionBehavior,
    method: HttpMethod,
    handle: <P = {}>(props: ActionHandlingProps<Model, P>) => void,
    buttonIcon?: ButtonIcon,
    onError?: (e: Exception, ctx: HttpContext) => unknown
  ) {
    super(actionKey, label, behavior, method, buttonIcon, onError)
    this.handle = handle
  }
}

class SingleInstanceAction<Model extends BaseModel> extends Action<Model> {
  handle: <P = {}>(props: ActionHandlingProps<Model, P & { instance: InstanceType<Model> }>) => void
  constructor(
    actionKey: string,
    label: string,
    behavior: BaseActionBehavior,
    method: HttpMethod,
    handle: <P = {}>(
      props: ActionHandlingProps<Model, P & { instance: InstanceType<Model> }>
    ) => void,
    buttonIcon?: ButtonIcon,
    onError?: (e: Exception, ctx: HttpContext) => unknown
  ) {
    super(actionKey, label, behavior, method, buttonIcon, onError)
    this.handle = handle
  }
}

class MultipleInstanceAction<Model extends BaseModel> extends Action<Model> {
  handle: <P = {}>(
    props: ActionHandlingProps<Model, P & { instances: InstanceType<Model>[] }>
  ) => void
  constructor(
    actionKey: string,
    label: string,
    behavior: BaseActionBehavior,
    method: HttpMethod,
    handle: <P = {}>(
      props: ActionHandlingProps<Model, P & { instances: InstanceType<Model>[] }>
    ) => void,
    buttonIcon?: ButtonIcon,
    onError?: (e: Exception, ctx: HttpContext) => unknown
  ) {
    super(actionKey, label, behavior, method, buttonIcon, onError)
    this.handle = handle
  }
}

type HeadlessActionProps = Pick<HeadlessAction, 'confirmationModal'>
type RegularActionProps = {}

type ActionButton<Model extends BaseModel, Behavior extends ActionBehavior = ActionBehavior> = Pick<
  Action<Model>,
  'label' | 'actionKey' | 'method' | 'buttonIcon'
> & {
  behavior: Behavior
} & (Behavior extends ActionBehavior.Headless ? HeadlessActionProps : {}) &
  (Behavior extends ActionBehavior.Regular ? RegularActionProps : {})

enum ActionBehavior {
  Regular = 'Regular',
  Headless = 'Headless',
}

interface BaseActionBehavior {
  readonly type: ActionBehavior
}

interface RegularAction<Model extends BaseModel> extends BaseActionBehavior {
  readonly componentTitle: string
  readonly componentPath: string
  readonly redirectOnCompletion: boolean
  readonly propsComputing: (
    resource: Resource<Model>,
    action: Action<Model>,
    instance?: InstanceType<Model>
  ) => Promise<unknown>
}

interface HeadlessAction extends BaseActionBehavior {
  readonly confirmationModal?: ConfirmationModal
}

export {
  Action,
  ActionBehavior,
  MultipleInstanceAction,
  NoInstanceAction,
  SingleInstanceAction,
  type ActionButton,
  type HeadlessAction,
  type RegularAction,
}
