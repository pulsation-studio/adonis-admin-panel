import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { ConfirmationModal } from '../models/confirmation_modal_props.js'
import {
  Action,
  ActionBehavior,
  ActionButton,
  BaseModel,
  ButtonIcon,
  HeadlessAction,
  HttpMethod,
  RegularAction,
  Resource,
} from '../models/index.js'

export class ActionBuilder<
  Model extends BaseModel,
  A extends new (...args: any[]) => Action<Model>,
> {
  private errorHandler?: (e: Exception, ctx: HttpContext) => unknown = undefined

  constructor(
    private readonly actionKey: string,
    private readonly label: string,
    private readonly actionType: A,
    private readonly method: HttpMethod,
    private readonly handle: InstanceType<A>['handle'],
    private readonly buttonIcon?: ButtonIcon
  ) {}

  buildRegular(
    componentTitle: string,
    componentPath: string,
    propsComputing: (
      resource: Resource<Model>,
      action: Action<Model>,
      instance?: InstanceType<Model>
    ) => Promise<unknown>,
    redirectOnCompletion = true
  ): Action<Model> {
    const regularAction: RegularAction<Model> = {
      componentTitle: componentTitle,
      type: ActionBehavior.Regular,
      componentPath: componentPath,
      redirectOnCompletion: redirectOnCompletion,
      propsComputing: propsComputing,
    }
    return new this.actionType(
      this.actionKey,
      this.label,
      regularAction,
      this.method,
      this.handle,
      this.buttonIcon,
      this.errorHandler
    )
  }

  buildHeadless(confirmationModal?: ConfirmationModal): Action<Model> {
    const headlessAction: HeadlessAction = {
      type: ActionBehavior.Headless,
      confirmationModal: confirmationModal,
    }
    return new this.actionType(
      this.actionKey,
      this.label,
      headlessAction,
      this.method,
      this.handle,
      this.buttonIcon,
      this.errorHandler
    )
  }

  addErrorHandler(errorHandler?: (e: Exception, ctx: HttpContext) => unknown) {
    this.errorHandler = errorHandler
    return this
  }

  static convertToActionButtons<Model extends BaseModel>(
    actions: Action<Model>[]
  ): ActionButton<Model>[] {
    return actions.map((action) => ({
      label: action.label,
      actionKey: action.actionKey,
      method: action.method,
      behavior: action.behavior.type,
      buttonIcon: action.buttonIcon,
      confirmationModal: action.isHeadless() ? action.behavior.confirmationModal : undefined,
    }))
  }
}
