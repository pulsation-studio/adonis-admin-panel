import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { ModelObject, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { StrictValues } from '@adonisjs/lucid/types/querybuilder'
import { computeFormInitialValues, resolveFormFieldFunction } from '../helpers/index.js'
import { ConfirmationModal } from '../models/confirmation_modal_props.js'
import {
  Action,
  AdminFormProps,
  BaseModel,
  ExtraResourceFilter,
  Form,
  HttpMethod,
  MultipleInstanceAction,
  NoInstanceAction,
  Resource,
  ResourceField,
  ResourceMeta,
  SingleInstanceAction,
} from '../models/index.js'
import { ActionBuilder } from './index.js'

export class ResourceBuilder<Model extends BaseModel> {
  private _extraFilters: ExtraResourceFilter<Model>[] = []
  private _actions: Action<Model>[] = []
  private _resourceFields: ResourceField<Model>[] = []
  private _getQuerySet: () => ModelQueryBuilderContract<Model> = () => this._model.query()
  private _instancesSerializer: (instances: InstanceType<Model>[]) => Promise<ModelObject[]> =
    async (instances) =>
      instances.map((i) => ({ primaryKeyValue: i.$primaryKeyValue, ...i.serialize() }))

  constructor(
    private readonly _model: Model,
    private readonly _meta: ResourceMeta
  ) {}

  addExtraFilter(extraFilter: ExtraResourceFilter<Model>) {
    this._extraFilters.push(extraFilter)
    return this
  }

  addField(field: ResourceField<Model>) {
    this._resourceFields.push(field)
    return this
  }

  addFields(fields: ResourceField<Model>[]) {
    this._resourceFields = this._resourceFields.concat(fields)
    return this
  }

  addAction(action: Action<Model>) {
    this._actions.push(action)
    return this
  }

  addActions(actions: Action<Model>[]) {
    this._actions = this._actions.concat(actions)
    return this
  }

  setQuerySetResolver(callback: () => ModelQueryBuilderContract<Model>) {
    this._getQuerySet = callback
    return this
  }

  setInstancesSerializer(serializer: (instances: InstanceType<Model>[]) => Promise<ModelObject[]>) {
    this._instancesSerializer = serializer
    return this
  }

  build(): Resource<Model> {
    return new Resource(
      this._model,
      this._actions,
      this._resourceFields,
      this._meta,
      this._getQuerySet,
      this._instancesSerializer
    )
  }

  addDeleteAction(confirmationModalProps?: ConfirmationModal) {
    const deleteCallBack: SingleInstanceAction<Model>['handle'] = async ({ instance }) => {
      await instance.delete()
    }
    const deleteAction = new ActionBuilder<Model, typeof SingleInstanceAction<Model>>(
      'delete',
      'Supprimer',
      SingleInstanceAction<Model>,
      HttpMethod.DELETE,
      deleteCallBack,
      { iconLibrary: 'md', iconName: 'MdDelete' }
    ).buildHeadless(confirmationModalProps)

    return this.addAction(deleteAction)
  }

  addBulkDeleteAction() {
    const bulkDeleteCallBack: MultipleInstanceAction<Model>['handle'] = async ({
      instances,
      model,
    }) => {
      const instancesPks = instances.map(
        (instance) => instance[model.primaryKey as keyof InstanceType<Model>]
      ) as StrictValues[]
      await model.query().whereIn(model.primaryKey, instancesPks).delete()
    }
    const bulkDeleteAction = new ActionBuilder<Model, typeof MultipleInstanceAction<Model>>(
      'bulkDelete',
      'Supprimer tout',
      MultipleInstanceAction<Model>,
      HttpMethod.DELETE,
      bulkDeleteCallBack
    ).buildHeadless()

    return this.addAction(bulkDeleteAction)
  }

  addCreateAction<ExtraFields extends object = {}>(
    title: string,
    form: Form<Model, ExtraFields>,
    createCallBack: NoInstanceAction<Model>['handle'],
    options?: {
      onError?: (e: Exception, ctx: HttpContext) => void
    }
  ) {
    const computingFormProps = async (
      resource: Resource<Model>,
      action: NoInstanceAction<Model>
    ) => {
      const adminFormProps: AdminFormProps<Model, ExtraFields> = {
        submitPath: `/admin/${resource.meta.path}/${action.actionKey}`,
        submitButtonLabel: 'Créer',
        form: await resolveFormFieldFunction(form),
        initialValues: await computeFormInitialValues(form),
        httpMethod: HttpMethod.POST,
      }
      return adminFormProps
    }
    const createAction = new ActionBuilder<Model, typeof NoInstanceAction<Model>>(
      'create',
      'Nouveau',
      NoInstanceAction<Model>,
      HttpMethod.POST,
      createCallBack
    )
      .addErrorHandler(options?.onError)
      .buildRegular(title, 'admin/resource_form', computingFormProps)

    return this.addAction(createAction)
  }

  addUpdateAction<ExtraFields extends object = {}>(
    title: string,
    form: Form<Model, ExtraFields>,
    updateCallBack: SingleInstanceAction<Model>['handle'],
    options?: {
      onError?: (e: Exception, ctx: HttpContext) => void
    }
  ) {
    const computingFormProps = async (
      resource: Resource<Model>,
      action: NoInstanceAction<Model>,
      instance?: InstanceType<Model>
    ) => {
      const adminFormProps: AdminFormProps<Model, ExtraFields> = {
        submitPath: `/admin/${resource.meta.path}/${instance!.$primaryKeyValue}/${action.actionKey}`,
        submitButtonLabel: 'Modifier',
        form: await resolveFormFieldFunction(form),
        initialValues: await computeFormInitialValues(form, instance),
        httpMethod: HttpMethod.PATCH,
      }
      return adminFormProps
    }

    const updateAction = new ActionBuilder<Model, typeof SingleInstanceAction<Model>>(
      'update',
      'Modifier',
      SingleInstanceAction<Model>,
      HttpMethod.PATCH,
      updateCallBack,
      { iconLibrary: 'md', iconName: 'MdEdit' }
    )
      .addErrorHandler(options?.onError)
      .buildRegular(title, 'admin/resource_form', computingFormProps)

    return this.addAction(updateAction)
  }
}
