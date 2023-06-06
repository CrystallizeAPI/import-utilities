import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
  DateTime: any
  EmailAddress: any
  JSON: any
  NonNegativeFloat: any
  NonNegativeInt: any
  PhoneNumber: any
  PositiveInt: any
}

export type AcceptedContentType = {
  __typename?: 'AcceptedContentType'
  contentType: Scalars['String']
  extensionLabel?: Maybe<Scalars['String']>
}

export type AcceptedContentTypeInput = {
  contentType: Scalars['String']
  extensionLabel?: InputMaybe<Scalars['String']>
}

export type AccessToken = {
  __typename?: 'AccessToken'
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  lastUsed?: Maybe<Scalars['DateTime']>
  name?: Maybe<Scalars['String']>
  secret?: Maybe<Scalars['String']>
  userId: Scalars['ID']
}

export type AccessTokenMutations = {
  __typename?: 'AccessTokenMutations'
  create: AccessToken
  delete: Scalars['Int']
}

export type AccessTokenMutationsCreateArgs = {
  input: CreateAccessTokenInput
  userId: Scalars['ID']
}

export type AccessTokenMutationsDeleteArgs = {
  id: Scalars['String']
}

export type AddLanguageInput = {
  code: Scalars['String']
  name: Scalars['String']
}

export type Address = {
  __typename?: 'Address'
  city?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['EmailAddress']>
  firstName?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
  middleName?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  street2?: Maybe<Scalars['String']>
  streetNumber?: Maybe<Scalars['String']>
  type: AddressType
}

export type AddressMetaPropertyArgs = {
  key: Scalars['String']
}

export type AddressInput = {
  city?: InputMaybe<Scalars['String']>
  country?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['EmailAddress']>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  middleName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  postalCode?: InputMaybe<Scalars['String']>
  state?: InputMaybe<Scalars['String']>
  street?: InputMaybe<Scalars['String']>
  street2?: InputMaybe<Scalars['String']>
  streetNumber?: InputMaybe<Scalars['String']>
  type: AddressType
}

export enum AddressType {
  Billing = 'billing',
  Delivery = 'delivery',
  Other = 'other',
}

export type ApiCallMetrics = IObjectMetrics & {
  __typename?: 'ApiCallMetrics'
  count: Scalars['Int']
}

export type ApiCallMetricsCountArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type App = {
  __typename?: 'App'
  baseUrl: Scalars['String']
  createdAt: Scalars['DateTime']
  identifier: Scalars['String']
  name: Scalars['String']
  sessionUrl: Scalars['String']
  tenant?: Maybe<Tenant>
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type AppConnection = {
  __typename?: 'AppConnection'
  edges?: Maybe<Array<AppConnectionEdge>>
  pageInfo: PageInfo
}

export type AppConnectionEdge = {
  __typename?: 'AppConnectionEdge'
  cursor: Scalars['String']
  node: App
}

export type AppListFilter = {
  tenantId: Scalars['ID']
}

export type AppListSortOptions = {
  direction?: InputMaybe<SortDirection>
  field?: InputMaybe<ImageSortField>
}

export type AppMutations = {
  __typename?: 'AppMutations'
  create: App
  delete: Scalars['Int']
  update: App
}

export type AppMutationsCreateArgs = {
  input: CreateAppInput
}

export type AppMutationsDeleteArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type AppMutationsUpdateArgs = {
  identifier: Scalars['String']
  input: UpdateAppInput
  tenantId: Scalars['ID']
}

export type AppQueries = {
  __typename?: 'AppQueries'
  get?: Maybe<App>
  getMany: AppConnection
}

export type AppQueriesGetArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type AppQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  filter: AppListFilter
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<AppListSortOptions>
}

export enum AuthenticationMethod {
  AccessTokenPair = 'accessTokenPair',
  None = 'none',
  StaticToken = 'staticToken',
}

export enum BandwidthUnit {
  Bytes = 'Bytes',
  GiB = 'GiB',
  KiB = 'KiB',
  MiB = 'MiB',
}

export type BandwidthUsageMetrics = {
  __typename?: 'BandwidthUsageMetrics'
  total: Scalars['Float']
}

export type BandwidthUsageMetricsTotalArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
  type?: InputMaybe<BandwidthUsageType>
  unit?: BandwidthUnit
}

export enum BandwidthUsageType {
  ApiCall = 'ApiCall',
  Media = 'Media',
}

export type BooleanContent = {
  __typename?: 'BooleanContent'
  value?: Maybe<Scalars['Boolean']>
}

export type BooleanContentInput = {
  value: Scalars['Boolean']
}

export type BulkCreateDocumentInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  topicIds?: InputMaybe<Array<Scalars['ID']>>
  tree?: InputMaybe<TreeNodeInput>
}

export type BulkCreateFolderInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  topicIds?: InputMaybe<Array<Scalars['ID']>>
  tree?: InputMaybe<TreeNodeInput>
}

export type BulkCreateProductInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  topicIds?: InputMaybe<Array<Scalars['ID']>>
  tree?: InputMaybe<TreeNodeInput>
  variants: Array<CreateProductVariantInput>
  vatTypeId: Scalars['ID']
}

export type BulkCreateShapeInput = {
  components?: InputMaybe<Array<ShapeComponentInput>>
  identifier?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name: Scalars['String']
  type: ShapeType
  variantComponents?: InputMaybe<Array<ShapeComponentInput>>
}

export type BulkCreateTenantInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  defaults?: InputMaybe<TenantDefaultsInput>
  identifier: Scalars['String']
  isActive?: InputMaybe<Scalars['Boolean']>
  isTrial?: InputMaybe<Scalars['Boolean']>
  logo?: InputMaybe<ImageInput>
  name: Scalars['String']
  shapes?: InputMaybe<Array<BulkCreateShapeInput>>
  vatTypes?: InputMaybe<Array<BulkCreateVatTypeInput>>
}

export type BulkCreateTopicInput = {
  children?: InputMaybe<Array<CreateChildTopicInput>>
  name: Scalars['String']
  parentId?: InputMaybe<Scalars['ID']>
  pathIdentifier?: InputMaybe<Scalars['String']>
}

export type BulkCreateUserInput = {
  companyName?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  isAdmin?: InputMaybe<Scalars['Boolean']>
  lastName?: InputMaybe<Scalars['String']>
  marketingEmailConsentedAt?: InputMaybe<Scalars['DateTime']>
  sub?: InputMaybe<Scalars['String']>
  tocReadAt?: InputMaybe<Scalars['DateTime']>
}

export type BulkCreateVatTypeInput = {
  name: Scalars['String']
  percent: Scalars['Float']
  tenantId: Scalars['ID']
}

export type BulkTaskTenantCopyInfo = {
  __typename?: 'BulkTaskTenantCopyInfo'
  id: Scalars['ID']
}

export type CashPayment = PaymentType & {
  __typename?: 'CashPayment'
  cash?: Maybe<Scalars['String']>
  provider: PaymentProvider
}

export type CashPaymentInput = {
  cash?: InputMaybe<Scalars['String']>
}

export type Component = {
  __typename?: 'Component'
  componentId: Scalars['String']
  content?: Maybe<ComponentContent>
  name: Scalars['String']
  type: ComponentType
}

export type ComponentChoiceComponentConfig = {
  __typename?: 'ComponentChoiceComponentConfig'
  choices: Array<ShapeComponent>
}

export type ComponentChoiceComponentConfigInput = {
  choices: Array<ShapeComponentInput>
}

export type ComponentChoiceContent = {
  __typename?: 'ComponentChoiceContent'
  selectedComponent: Component
}

export type ComponentConfig =
  | ComponentChoiceComponentConfig
  | ContentChunkComponentConfig
  | FilesComponentConfig
  | ItemRelationsComponentConfig
  | NumericComponentConfig
  | PropertiesTableComponentConfig
  | SelectionComponentConfig

export type ComponentConfigInput = {
  componentChoice?: InputMaybe<ComponentChoiceComponentConfigInput>
  contentChunk?: InputMaybe<ContentChunkComponentConfigInput>
  files?: InputMaybe<FilesComponentConfigInput>
  itemRelations?: InputMaybe<ItemRelationsComponentConfigInput>
  numeric?: InputMaybe<NumericComponentConfigInput>
  propertiesTable?: InputMaybe<PropertiesTableComponentConfigInput>
  selection?: InputMaybe<SelectionComponentConfigInput>
}

export type ComponentContent =
  | BooleanContent
  | ComponentChoiceContent
  | ContentChunkContent
  | DatetimeContent
  | FileContent
  | GridRelationsContent
  | ImageContent
  | ItemRelationsContent
  | LocationContent
  | NumericContent
  | ParagraphCollectionContent
  | PropertiesTableContent
  | RichTextContent
  | SelectionContent
  | SingleLineContent
  | VideoContent

export type ComponentInput = {
  boolean?: InputMaybe<BooleanContentInput>
  componentChoice?: InputMaybe<ComponentInput>
  componentId: Scalars['String']
  contentChunk?: InputMaybe<ContentChunkContentInput>
  datetime?: InputMaybe<DatetimeContentInput>
  files?: InputMaybe<Array<FileInput>>
  gridRelations?: InputMaybe<GridRelationsContentInput>
  images?: InputMaybe<Array<ImageInput>>
  itemRelations?: InputMaybe<ItemRelationsContentInput>
  location?: InputMaybe<LocationContentInput>
  numeric?: InputMaybe<NumericComponentContentInput>
  paragraphCollection?: InputMaybe<ParagraphCollectionContentInput>
  propertiesTable?: InputMaybe<PropertiesTableContentInput>
  richText?: InputMaybe<RichTextContentInput>
  selection?: InputMaybe<SelectionComponentContentInput>
  singleLine?: InputMaybe<SingleLineContentInput>
  videos?: InputMaybe<Array<VideoInput>>
}

export enum ComponentType {
  Boolean = 'boolean',
  ComponentChoice = 'componentChoice',
  ContentChunk = 'contentChunk',
  Datetime = 'datetime',
  Files = 'files',
  GridRelations = 'gridRelations',
  Images = 'images',
  ItemRelations = 'itemRelations',
  Location = 'location',
  Numeric = 'numeric',
  ParagraphCollection = 'paragraphCollection',
  PropertiesTable = 'propertiesTable',
  RichText = 'richText',
  Selection = 'selection',
  SingleLine = 'singleLine',
  Videos = 'videos',
}

export type ContentChunkComponentConfig = {
  __typename?: 'ContentChunkComponentConfig'
  components: Array<ShapeComponent>
  repeatable: Scalars['Boolean']
}

export type ContentChunkComponentConfigInput = {
  components: Array<ShapeComponentInput>
  repeatable?: InputMaybe<Scalars['Boolean']>
}

export type ContentChunkContent = {
  __typename?: 'ContentChunkContent'
  chunks: Array<Array<Component>>
}

export type ContentChunkContentInput = {
  chunks: Array<Array<ComponentInput>>
}

export type ContractSubscriptionPlanReferenceInput = {
  identifier: Scalars['String']
  periodId: Scalars['ID']
}

export type CreateAccessTokenInput = {
  name?: InputMaybe<Scalars['String']>
}

export type CreateAppInput = {
  baseUrl: Scalars['String']
  identifier?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  tenantId: Scalars['ID']
}

export type CreateChildTopicInput = {
  children?: InputMaybe<Array<CreateChildTopicInput>>
  name: Scalars['String']
  pathIdentifier?: InputMaybe<Scalars['String']>
}

export type CreateCustomerAddressInput = {
  city?: InputMaybe<Scalars['String']>
  country?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['EmailAddress']>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  middleName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  postalCode?: InputMaybe<Scalars['String']>
  state?: InputMaybe<Scalars['String']>
  street?: InputMaybe<Scalars['String']>
  street2?: InputMaybe<Scalars['String']>
  streetNumber?: InputMaybe<Scalars['String']>
  type: AddressType
}

export type CreateCustomerInput = {
  addresses?: InputMaybe<Array<CreateCustomerAddressInput>>
  companyName?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  externalReferences?: InputMaybe<Array<KeyValuePairInput>>
  firstName: Scalars['String']
  identifier?: InputMaybe<Scalars['String']>
  lastName: Scalars['String']
  meta?: InputMaybe<Array<KeyValuePairInput>>
  middleName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  taxNumber?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
}

/** Creates a new document. Note that the shapeId input has been deprecated and will be removed in a future release. */
export type CreateDocumentInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  shapeId?: InputMaybe<Scalars['ID']>
  shapeIdentifier?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
  topicIds?: InputMaybe<Array<Scalars['ID']>>
  tree?: InputMaybe<TreeNodeInput>
}

export type CreateFolderInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  shapeIdentifier?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
  topicIds?: InputMaybe<Array<Scalars['ID']>>
  tree?: InputMaybe<TreeNodeInput>
}

export type CreateGridInput = {
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name: Scalars['String']
  rows?: InputMaybe<Array<GridRowInput>>
  tenantId: Scalars['ID']
}

export type CreateMarketInput = {
  customerIdentifiers?: InputMaybe<Array<Scalars['String']>>
  identifier: Scalars['String']
  name: Scalars['String']
  tenantId: Scalars['ID']
}

export type CreatePipelineInput = {
  name: Scalars['String']
  stages?: InputMaybe<Array<CreatePipelineStageInput>>
  tenantId: Scalars['ID']
}

export type CreatePipelineStageInput = {
  name: Scalars['String']
  placeNewOrders?: InputMaybe<Scalars['Boolean']>
}

export type CreatePriceListInput = {
  endDate?: InputMaybe<Scalars['DateTime']>
  identifier: Scalars['String']
  modifierType: PriceListModifierType
  name: Scalars['String']
  priceVariants?: InputMaybe<Array<PriceListPriceVariantReferenceInput>>
  selectedProductVariants: CreatePriceListSelectedProductVariantsInput
  startDate?: InputMaybe<Scalars['DateTime']>
  targetAudience: CreatePriceListTargetAudienceInput
  tenantId: Scalars['ID']
}

export type CreatePriceListProductVariant = {
  priceVariants?: InputMaybe<Array<PriceListProductPriceVariantReference>>
  sku: Scalars['String']
}

export type CreatePriceListSelectedProductVariantsInput = {
  type: PriceListProductSelectionType
  variants?: InputMaybe<Array<CreatePriceListProductVariant>>
}

export type CreatePriceListTargetAudienceInput = {
  marketIdentifiers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  type: PriceListTargetAudienceType
}

export type CreatePriceVariantInput = {
  currency?: InputMaybe<Scalars['String']>
  identifier: Scalars['String']
  name?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
}

export type CreateProductInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  shapeIdentifier?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
  topicIds?: InputMaybe<Array<Scalars['ID']>>
  tree?: InputMaybe<TreeNodeInput>
  variants: Array<CreateProductVariantInput>
  vatTypeId: Scalars['ID']
}

export type CreateProductSubscriptionAddressInput = {
  city?: InputMaybe<Scalars['String']>
  country?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['EmailAddress']>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  middleName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  postalCode?: InputMaybe<Scalars['String']>
  state?: InputMaybe<Scalars['String']>
  street?: InputMaybe<Scalars['String']>
  street2?: InputMaybe<Scalars['String']>
  streetNumber?: InputMaybe<Scalars['String']>
  type: AddressType
}

export type CreateProductSubscriptionInput = {
  addresses?: InputMaybe<Array<CreateProductSubscriptionAddressInput>>
  customerIdentifier: Scalars['String']
  initial?: InputMaybe<CreateProductSubscriptionPhaseInput>
  item: CreateProductSubscriptionItemInput
  meteredVariables?: InputMaybe<
    Array<CreateProductSubscriptionMeteredVariableInput>
  >
  payment?: InputMaybe<PaymentInput>
  recurring: CreateProductSubscriptionPhaseInput
  status: CreateProductSubscriptionStatusInput
  subscriptionPlan: ProductSubscriptionPlanReferenceInput
  tenantId: Scalars['ID']
}

export type CreateProductSubscriptionItemInput = {
  imageUrl?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name: Scalars['String']
  sku: Scalars['String']
}

export type CreateProductSubscriptionMeteredVariableInput = {
  id: Scalars['ID']
  tierType: TierType
  tiers: Array<CreateProductSubscriptionMeteredVariableTierInput>
}

export type CreateProductSubscriptionMeteredVariableTierInput = {
  currency: Scalars['String']
  price: Scalars['Float']
  threshold: Scalars['Int']
}

export type CreateProductSubscriptionPhaseInput = {
  currency: Scalars['String']
  price: Scalars['Float']
}

export type CreateProductSubscriptionStatusInput = {
  activeUntil?: InputMaybe<Scalars['DateTime']>
  currency: Scalars['String']
  price: Scalars['Float']
  renewAt?: InputMaybe<Scalars['DateTime']>
}

export type CreateProductVariantInput = {
  attributes?: InputMaybe<Array<ProductVariantAttributeInput>>
  components?: InputMaybe<Array<ComponentInput>>
  externalReference?: InputMaybe<Scalars['String']>
  images?: InputMaybe<Array<ImageInput>>
  isDefault: Scalars['Boolean']
  name?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Float']>
  priceVariants?: InputMaybe<Array<PriceVariantReferenceInput>>
  sku: Scalars['String']
  stock?: InputMaybe<Scalars['Int']>
  stockLocations?: InputMaybe<Array<StockLocationReferenceInput>>
  subscriptionPlans?: InputMaybe<Array<SubscriptionPlanReferenceInput>>
  videos?: InputMaybe<Array<VideoInput>>
}

export type CreateShapeInput = {
  components?: InputMaybe<Array<ShapeComponentInput>>
  identifier?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name: Scalars['String']
  tenantId: Scalars['ID']
  type: ShapeType
  variantComponents?: InputMaybe<Array<ShapeComponentInput>>
}

export type CreateStockLocationInput = {
  identifier: Scalars['String']
  name: Scalars['String']
  settings?: InputMaybe<StockLocationSettingsInput>
  tenantId: Scalars['ID']
}

export type CreateSubscriptionContractAddressInput = {
  city?: InputMaybe<Scalars['String']>
  country?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['EmailAddress']>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  middleName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  postalCode?: InputMaybe<Scalars['String']>
  state?: InputMaybe<Scalars['String']>
  street?: InputMaybe<Scalars['String']>
  street2?: InputMaybe<Scalars['String']>
  streetNumber?: InputMaybe<Scalars['String']>
  type: AddressType
}

export type CreateSubscriptionContractInput = {
  addresses?: InputMaybe<Array<CreateSubscriptionContractAddressInput>>
  customerIdentifier: Scalars['String']
  initial?: InputMaybe<CreateSubscriptionContractPhaseInput>
  item: CreateSubscriptionContractItemInput
  payment?: InputMaybe<PaymentInput>
  recurring: CreateSubscriptionContractPhaseInput
  status: CreateSubscriptionContractStatusInput
  subscriptionPlan: ContractSubscriptionPlanReferenceInput
  tenantId: Scalars['ID']
}

export type CreateSubscriptionContractItemInput = {
  imageUrl?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name: Scalars['String']
  sku: Scalars['String']
}

export type CreateSubscriptionContractMeteredVariableReferenceInput = {
  id: Scalars['ID']
  tierType: TierType
  tiers: Array<CreateSubscriptionContractMeteredVariableTierInput>
}

export type CreateSubscriptionContractMeteredVariableTierInput = {
  currency: Scalars['String']
  price: Scalars['Float']
  threshold: Scalars['Int']
}

export type CreateSubscriptionContractPhaseInput = {
  currency: Scalars['String']
  meteredVariables?: InputMaybe<
    Array<CreateSubscriptionContractMeteredVariableReferenceInput>
  >
  price: Scalars['Float']
}

export type CreateSubscriptionContractStatusInput = {
  activeUntil?: InputMaybe<Scalars['DateTime']>
  currency: Scalars['String']
  price: Scalars['Float']
  renewAt?: InputMaybe<Scalars['DateTime']>
}

export type CreateSubscriptionPlanInput = {
  identifier: Scalars['String']
  meteredVariables?: InputMaybe<Array<SubscriptionPlanMeteredVariableInput>>
  name?: InputMaybe<Scalars['String']>
  periods: Array<SubscriptionPlanPeriodInput>
  tenantId: Scalars['ID']
}

export type CreateTenantInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  defaults?: InputMaybe<TenantDefaultsInput>
  identifier: Scalars['String']
  isActive?: InputMaybe<Scalars['Boolean']>
  isTrial?: InputMaybe<Scalars['Boolean']>
  logo?: InputMaybe<ImageInput>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name: Scalars['String']
  shapes?: InputMaybe<Array<BulkCreateShapeInput>>
  vatTypes?: InputMaybe<Array<BulkCreateVatTypeInput>>
}

export type CreateTopicInput = {
  children?: InputMaybe<Array<CreateChildTopicInput>>
  name: Scalars['String']
  parentId?: InputMaybe<Scalars['ID']>
  pathIdentifier?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
}

export type CreateUserInput = {
  companyName?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  isAdmin?: InputMaybe<Scalars['Boolean']>
  lastName?: InputMaybe<Scalars['String']>
  marketingEmailConsentedAt?: InputMaybe<Scalars['DateTime']>
  sub: Array<Scalars['String']>
  tocReadAt?: InputMaybe<Scalars['DateTime']>
}

export type CreateVatTypeInput = {
  name: Scalars['String']
  percent: Scalars['Float']
  tenantId: Scalars['ID']
}

export type CreateWebhookInput = {
  concern: Scalars['String']
  event: Scalars['String']
  graphqlQuery?: InputMaybe<Scalars['String']>
  headers?: InputMaybe<Array<WebhookHeaderInput>>
  method: HttpMethod
  name: Scalars['String']
  tenantId: Scalars['ID']
  url: Scalars['String']
}

export type CreateWebhookInvocationInput = {
  end?: InputMaybe<Scalars['DateTime']>
  payload?: InputMaybe<Scalars['JSON']>
  responseBody?: InputMaybe<Scalars['JSON']>
  responseStatus?: InputMaybe<Scalars['Int']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type CurrencySummary = {
  __typename?: 'CurrencySummary'
  currency?: Maybe<Scalars['String']>
  value?: Maybe<Scalars['Float']>
}

export type CurrencySummaryReport = {
  __typename?: 'CurrencySummaryReport'
  orders: Array<Maybe<CurrencySummary>>
  sales: Array<Maybe<CurrencySummary>>
}

export type CurrencySummaryReportOrdersArgs = {
  direction?: InputMaybe<SortDirection>
  end?: InputMaybe<Scalars['DateTime']>
  orderBy?: InputMaybe<Parameter>
  start?: InputMaybe<Scalars['DateTime']>
  tenantId: Scalars['ID']
}

export type CurrencySummaryReportSalesArgs = {
  direction?: InputMaybe<SortDirection>
  end?: InputMaybe<Scalars['DateTime']>
  orderBy?: InputMaybe<Parameter>
  start?: InputMaybe<Scalars['DateTime']>
  tenantId: Scalars['ID']
}

export type CustomPayment = PaymentType & {
  __typename?: 'CustomPayment'
  properties?: Maybe<Array<CustomProperties>>
  provider: PaymentProvider
}

export type CustomPaymentInput = {
  properties?: InputMaybe<Array<CustomPropertiesInput>>
}

export type CustomProperties = {
  __typename?: 'CustomProperties'
  property: Scalars['String']
  value?: Maybe<Scalars['String']>
}

export type CustomPropertiesInput = {
  property: Scalars['String']
  value?: InputMaybe<Scalars['String']>
}

export type Customer = {
  __typename?: 'Customer'
  addresses?: Maybe<Array<Address>>
  birthDate?: Maybe<Scalars['Date']>
  companyName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  externalReference?: Maybe<Scalars['String']>
  externalReferences?: Maybe<Array<KeyValuePair>>
  firstName?: Maybe<Scalars['String']>
  identifier?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
  middleName?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  taxNumber?: Maybe<Scalars['String']>
  tenantId?: Maybe<Scalars['ID']>
}

export type CustomerExternalReferenceArgs = {
  key: Scalars['String']
}

export type CustomerMetaPropertyArgs = {
  key: Scalars['String']
}

export type CustomerConnection = {
  __typename?: 'CustomerConnection'
  edges?: Maybe<Array<CustomerConnectionEdge>>
  pageInfo: PageInfo
}

export type CustomerConnectionEdge = {
  __typename?: 'CustomerConnectionEdge'
  cursor: Scalars['String']
  node: Customer
}

export type CustomerExternalReferenceInput = {
  key: Scalars['String']
  value: Scalars['String']
}

export type CustomerInput = {
  addresses?: InputMaybe<Array<AddressInput>>
  birthDate?: InputMaybe<Scalars['DateTime']>
  companyName?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  identifier?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  middleName?: InputMaybe<Scalars['String']>
  taxNumber?: InputMaybe<Scalars['String']>
}

export type CustomerMutations = {
  __typename?: 'CustomerMutations'
  create: Customer
  createAddress: Customer
  delete: Scalars['Int']
  deleteAddress: Scalars['Int']
  setMetadata: Customer
  update: Customer
  updateAddress: Customer
}

export type CustomerMutationsCreateArgs = {
  input: CreateCustomerInput
}

export type CustomerMutationsCreateAddressArgs = {
  identifier: Scalars['String']
  input: CreateCustomerAddressInput
  tenantId: Scalars['ID']
}

export type CustomerMutationsDeleteArgs = {
  deleteSubscriptionContracts?: InputMaybe<Scalars['Boolean']>
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type CustomerMutationsDeleteAddressArgs = {
  addressId: Scalars['String']
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type CustomerMutationsSetMetadataArgs = {
  identifier: Scalars['String']
  key: Scalars['String']
  tenantId: Scalars['ID']
  value: Scalars['String']
}

export type CustomerMutationsUpdateArgs = {
  identifier: Scalars['String']
  input: UpdateCustomerInput
  tenantId: Scalars['ID']
}

export type CustomerMutationsUpdateAddressArgs = {
  addressId: Scalars['String']
  identifier: Scalars['String']
  input: UpdateCustomerAddressInput
  tenantId: Scalars['ID']
}

export type CustomerQueries = {
  __typename?: 'CustomerQueries'
  get?: Maybe<Customer>
  getMany?: Maybe<CustomerConnection>
}

export type CustomerQueriesGetArgs = {
  externalReference?: InputMaybe<CustomerExternalReferenceInput>
  identifier?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
}

export type CustomerQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  identifier?: InputMaybe<Scalars['ID']>
  last?: InputMaybe<Scalars['Int']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  tenantId: Scalars['ID']
}

export type DatetimeContent = {
  __typename?: 'DatetimeContent'
  datetime?: Maybe<Scalars['DateTime']>
}

export type DatetimeContentInput = {
  datetime?: InputMaybe<Scalars['DateTime']>
}

export type DigitalAssetManagementPreferencesInput = {
  enabled?: InputMaybe<Scalars['Boolean']>
}

export type DigitalAssetPreferences = {
  __typename?: 'DigitalAssetPreferences'
  enabled?: Maybe<Scalars['Boolean']>
}

export type Discount = {
  __typename?: 'Discount'
  percent?: Maybe<Scalars['Float']>
}

export type DiscountInput = {
  percent?: InputMaybe<Scalars['Float']>
}

export type Document = Item & {
  __typename?: 'Document'
  components?: Maybe<Array<Component>>
  createdAt?: Maybe<Scalars['DateTime']>
  externalReference?: Maybe<Scalars['String']>
  hasVersion?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  language: Scalars['String']
  name?: Maybe<Scalars['String']>
  relatingItems?: Maybe<Array<Item>>
  shape?: Maybe<Shape>
  tenantId: Scalars['ID']
  topics?: Maybe<Array<Topic>>
  tree?: Maybe<TreeNode>
  type: ItemType
  updatedAt?: Maybe<Scalars['DateTime']>
  version?: Maybe<VersionedRecordInfo>
}

export type DocumentHasVersionArgs = {
  versionLabel?: InputMaybe<VersionLabel>
}

export type DocumentMutations = {
  __typename?: 'DocumentMutations'
  create: Document
  delete: Scalars['Int']
  publish: PublishInfo
  unpublish?: Maybe<PublishInfo>
  update: Document
}

export type DocumentMutationsCreateArgs = {
  input: CreateDocumentInput
  language: Scalars['String']
}

export type DocumentMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type DocumentMutationsPublishArgs = {
  id: Scalars['ID']
  includeDescendants?: InputMaybe<Scalars['Boolean']>
  language: Scalars['String']
}

export type DocumentMutationsUnpublishArgs = {
  id: Scalars['ID']
  includeDescendants?: InputMaybe<Scalars['Boolean']>
  language: Scalars['String']
}

export type DocumentMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateDocumentInput
  language: Scalars['String']
}

export type DocumentQueries = {
  __typename?: 'DocumentQueries'
  get?: Maybe<Document>
}

export type DocumentQueriesGetArgs = {
  id: Scalars['ID']
  language: Scalars['String']
  versionLabel?: VersionLabel
}

export type ExperimentalPreferenceEnabled = {
  __typename?: 'ExperimentalPreferenceEnabled'
  enabled?: Maybe<Scalars['Boolean']>
}

export type ExperimentalPreferenceEnabledInput = {
  enabled?: InputMaybe<Scalars['Boolean']>
}

export type ExperimentalPreferences = {
  __typename?: 'ExperimentalPreferences'
  /** @deprecated Replaced by get with componentsOnVariants */
  componentsOnVariants?: Maybe<ExperimentalPreferenceEnabled>
  /** @deprecated Replaced by get with dam */
  dam?: Maybe<DigitalAssetPreferences>
  get?: Maybe<Preference>
  /** @deprecated Replaced by get with nerdyView */
  nerdyView?: Maybe<NerdyViewPreferences>
}

export type ExperimentalPreferencesGetArgs = {
  name: Scalars['String']
}

export type ExperimentalPreferencesInput = {
  componentsOnVariants?: InputMaybe<ExperimentalPreferenceEnabledInput>
  dam?: InputMaybe<DigitalAssetManagementPreferencesInput>
  nerdyView?: InputMaybe<NerdyViewPreferencesInput>
}

export type File = {
  __typename?: 'File'
  contentType?: Maybe<Scalars['String']>
  key: Scalars['String']
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Float']>
  title?: Maybe<Scalars['String']>
  url: Scalars['String']
}

export type FileMetaPropertyArgs = {
  key: Scalars['String']
}

export type FileContent = {
  __typename?: 'FileContent'
  files?: Maybe<Array<File>>
}

export type FileContentInput = {
  files?: InputMaybe<Array<FileInput>>
}

export type FileInput = {
  key: Scalars['String']
  meta?: InputMaybe<Array<KeyValuePairInput>>
  title?: InputMaybe<Scalars['String']>
}

export type FileQueries = {
  __typename?: 'FileQueries'
  get?: Maybe<File>
}

export type FileQueriesGetArgs = {
  key: Scalars['String']
  language: Scalars['String']
}

export type FileSize = {
  __typename?: 'FileSize'
  size: Scalars['Float']
  unit: FileSizeUnit
}

export enum FileSizeUnit {
  Bytes = 'Bytes',
  GiB = 'GiB',
  KiB = 'KiB',
  MiB = 'MiB',
}

export type FileUploadMutations = {
  __typename?: 'FileUploadMutations'
  generatePresignedRequest: PresignedUploadRequest
}

export type FileUploadMutationsGeneratePresignedRequestArgs = {
  contentType: Scalars['String']
  filename: Scalars['String']
  tenantId: Scalars['ID']
  type?: FileUploadType
}

export enum FileUploadType {
  Media = 'MEDIA',
  Static = 'STATIC',
}

export type FilesComponentConfig = {
  __typename?: 'FilesComponentConfig'
  acceptedContentTypes?: Maybe<Array<AcceptedContentType>>
  max?: Maybe<Scalars['Int']>
  maxFileSize?: Maybe<FileSize>
  min?: Maybe<Scalars['Int']>
}

export type FilesComponentConfigInput = {
  acceptedContentTypes?: InputMaybe<Array<AcceptedContentTypeInput>>
  max?: InputMaybe<Scalars['Int']>
  maxFileSize?: InputMaybe<MaxFileSizeInput>
  min?: InputMaybe<Scalars['Int']>
}

export type FocalPoint = {
  __typename?: 'FocalPoint'
  x: Scalars['Float']
  y: Scalars['Float']
}

export type FocalPointInput = {
  x: Scalars['Float']
  y: Scalars['Float']
}

export type Folder = Item & {
  __typename?: 'Folder'
  components?: Maybe<Array<Component>>
  createdAt?: Maybe<Scalars['DateTime']>
  externalReference?: Maybe<Scalars['String']>
  hasVersion?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  language: Scalars['String']
  name?: Maybe<Scalars['String']>
  relatingItems?: Maybe<Array<Item>>
  shape?: Maybe<Shape>
  tenantId: Scalars['ID']
  topics?: Maybe<Array<Topic>>
  tree?: Maybe<TreeNode>
  type: ItemType
  updatedAt?: Maybe<Scalars['DateTime']>
  version?: Maybe<VersionedRecordInfo>
}

export type FolderHasVersionArgs = {
  versionLabel?: InputMaybe<VersionLabel>
}

export type FolderMutations = {
  __typename?: 'FolderMutations'
  create: Folder
  delete: Scalars['Int']
  publish: PublishInfo
  unpublish?: Maybe<PublishInfo>
  update: Folder
}

export type FolderMutationsCreateArgs = {
  input: CreateFolderInput
  language: Scalars['String']
}

export type FolderMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type FolderMutationsPublishArgs = {
  id: Scalars['ID']
  includeDescendants?: InputMaybe<Scalars['Boolean']>
  language: Scalars['String']
}

export type FolderMutationsUnpublishArgs = {
  id: Scalars['ID']
  includeDescendants?: InputMaybe<Scalars['Boolean']>
  language: Scalars['String']
}

export type FolderMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateFolderInput
  language: Scalars['String']
}

export type FolderQueries = {
  __typename?: 'FolderQueries'
  get?: Maybe<Folder>
}

export type FolderQueriesGetArgs = {
  id: Scalars['ID']
  language: Scalars['String']
  versionLabel?: VersionLabel
}

export type FullTreeNodeInput = {
  itemId: Scalars['ID']
  parentId: Scalars['ID']
  position?: InputMaybe<Scalars['PositiveInt']>
}

export type GenericPublishInput = {
  id: Scalars['ID']
  type: ShapeType
}

export type GenericSuggestSearchResult = SuggestSearchResult & {
  __typename?: 'GenericSuggestSearchResult'
  id: Scalars['ID']
  name: Scalars['String']
  path: Scalars['String']
  tenantId: Scalars['ID']
  type: Scalars['String']
}

export type GetTopicByPathArguments = {
  path: Scalars['String']
  tenantId: Scalars['ID']
}

export type Grid = {
  __typename?: 'Grid'
  createdAt: Scalars['DateTime']
  hasVersion: Scalars['Boolean']
  id: Scalars['ID']
  language: Scalars['String']
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  rows: Array<GridRow>
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
  version?: Maybe<VersionedRecordInfo>
}

export type GridHasVersionArgs = {
  versionLabel?: InputMaybe<VersionLabel>
}

export type GridMetaPropertyArgs = {
  key: Scalars['String']
}

export type GridColumn = {
  __typename?: 'GridColumn'
  item?: Maybe<Item>
  itemId?: Maybe<Scalars['ID']>
  itemType?: Maybe<Scalars['String']>
  layout?: Maybe<GridColumnLayout>
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
}

export type GridColumnMetaPropertyArgs = {
  key: Scalars['String']
}

export type GridColumnInput = {
  itemId?: InputMaybe<Scalars['ID']>
  layout?: InputMaybe<GridLayoutInput>
  meta?: InputMaybe<Array<KeyValuePairInput>>
}

export type GridColumnLayout = {
  __typename?: 'GridColumnLayout'
  colspan?: Maybe<Scalars['Int']>
  rowspan?: Maybe<Scalars['Int']>
}

export type GridLayoutInput = {
  colspan?: InputMaybe<Scalars['Int']>
  rowspan?: InputMaybe<Scalars['Int']>
}

export type GridMutations = {
  __typename?: 'GridMutations'
  create: Grid
  delete: Scalars['Int']
  publish: GridPublishInfo
  unpublish?: Maybe<GridPublishInfo>
  update: Grid
}

export type GridMutationsCreateArgs = {
  input: CreateGridInput
  language: Scalars['String']
}

export type GridMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type GridMutationsPublishArgs = {
  id: Scalars['ID']
  language: Scalars['String']
}

export type GridMutationsUnpublishArgs = {
  id: Scalars['ID']
  language: Scalars['String']
}

export type GridMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateGridInput
  language: Scalars['String']
}

export type GridPublishInfo = {
  __typename?: 'GridPublishInfo'
  id: Scalars['ID']
  versionId: Scalars['ID']
}

export type GridQueries = {
  __typename?: 'GridQueries'
  get?: Maybe<Grid>
  getMany?: Maybe<Array<Grid>>
}

export type GridQueriesGetArgs = {
  id: Scalars['ID']
  language: Scalars['String']
  versionLabel?: VersionLabel
}

export type GridQueriesGetManyArgs = {
  language: Scalars['String']
  tenantId?: InputMaybe<Scalars['ID']>
  versionLabel?: VersionLabel
}

export type GridRelationsContent = {
  __typename?: 'GridRelationsContent'
  grids?: Maybe<Array<Grid>>
}

export type GridRelationsContentInput = {
  gridIds?: InputMaybe<Array<Scalars['ID']>>
}

export type GridRow = {
  __typename?: 'GridRow'
  columns: Array<GridColumn>
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
}

export type GridRowMetaPropertyArgs = {
  key: Scalars['String']
}

export type GridRowInput = {
  columns?: InputMaybe<Array<GridColumnInput>>
  meta?: InputMaybe<Array<KeyValuePairInput>>
}

export enum HttpMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

export type IObjectMetrics = {
  count: Scalars['Int']
}

export type IObjectMetricsCountArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type IObjectReports = {
  avg: Array<Maybe<ReportMetric>>
  sum: Array<Maybe<ReportMetric>>
  total: Scalars['Float']
}

export type IObjectReportsAvgArgs = {
  direction?: InputMaybe<SortDirection>
  end?: InputMaybe<Scalars['DateTime']>
  limit?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Parameter>
  resolution?: InputMaybe<Interval>
  start?: InputMaybe<Scalars['DateTime']>
}

export type IObjectReportsSumArgs = {
  direction?: InputMaybe<SortDirection>
  end?: InputMaybe<Scalars['DateTime']>
  limit?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Parameter>
  resolution?: InputMaybe<Interval>
  start?: InputMaybe<Scalars['DateTime']>
}

export type IObjectReportsTotalArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type IdentifierSuggestion = {
  __typename?: 'IdentifierSuggestion'
  isAvailable: Scalars['Boolean']
  suggestion: Scalars['String']
}

export type Image = {
  __typename?: 'Image'
  altText?: Maybe<Scalars['String']>
  caption?: Maybe<RichTextContent>
  focalPoint?: Maybe<FocalPoint>
  height?: Maybe<Scalars['Int']>
  key: Scalars['String']
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
  mimeType?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
  variants?: Maybe<Array<ImageVariant>>
  width?: Maybe<Scalars['Int']>
}

export type ImageMetaPropertyArgs = {
  key: Scalars['String']
}

export type ImageConnection = {
  __typename?: 'ImageConnection'
  edges?: Maybe<Array<ImageConnectionEdge>>
  pageInfo: PageInfo
}

export type ImageConnectionEdge = {
  __typename?: 'ImageConnectionEdge'
  cursor: Scalars['String']
  node: Image
}

export type ImageContent = {
  __typename?: 'ImageContent'
  images?: Maybe<Array<Image>>
}

export type ImageFilterInput = {
  topicIds?: InputMaybe<Array<Scalars['ID']>>
}

export type ImageInput = {
  altText?: InputMaybe<Scalars['String']>
  caption?: InputMaybe<RichTextContentInput>
  focalPoint?: InputMaybe<FocalPointInput>
  key: Scalars['String']
  meta?: InputMaybe<Array<KeyValuePairInput>>
  mimeType?: InputMaybe<Scalars['String']>
}

export type ImageMutations = {
  __typename?: 'ImageMutations'
  delete: Scalars['Int']
  registerImage?: Maybe<Image>
  registerVariants?: Maybe<Image>
  update: Image
}

export type ImageMutationsDeleteArgs = {
  key: Scalars['String']
  tenantId: Scalars['ID']
}

export type ImageMutationsRegisterImageArgs = {
  key: Scalars['String']
  tenantId: Scalars['ID']
}

export type ImageMutationsRegisterVariantsArgs = {
  key: Scalars['String']
  upsert?: InputMaybe<Scalars['Boolean']>
  variants: Array<ImageVariantInput>
}

export type ImageMutationsUpdateArgs = {
  input: UpdateImageInput
  key: Scalars['String']
  language: Scalars['String']
}

export type ImageQueries = {
  __typename?: 'ImageQueries'
  get?: Maybe<Image>
  getItems?: Maybe<ItemConnection>
  getMany?: Maybe<ImageConnection>
  getTopics?: Maybe<TopicConnection>
}

export type ImageQueriesGetArgs = {
  key: Scalars['String']
  language?: InputMaybe<Scalars['String']>
}

export type ImageQueriesGetItemsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  key: Scalars['String']
  language: Scalars['String']
  last?: InputMaybe<Scalars['Int']>
  tenantId: Scalars['ID']
  versionLabel?: VersionLabel
}

export type ImageQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  filter?: InputMaybe<ImageFilterInput>
  first?: InputMaybe<Scalars['Int']>
  language: Scalars['String']
  last?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortDirection>
  sortField?: InputMaybe<ImageSortField>
  tenantId: Scalars['ID']
}

export type ImageQueriesGetTopicsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  key: Scalars['String']
  language: Scalars['String']
  last?: InputMaybe<Scalars['Int']>
  tenantId: Scalars['ID']
}

export enum ImageSortField {
  CreatedAt = 'createdAt',
}

export type ImageVariant = {
  __typename?: 'ImageVariant'
  height: Scalars['Int']
  key: Scalars['String']
  size?: Maybe<Scalars['Int']>
  url: Scalars['String']
  width: Scalars['Int']
}

export type ImageVariantInput = {
  height: Scalars['Int']
  key: Scalars['String']
  size?: InputMaybe<Scalars['Int']>
  width: Scalars['Int']
}

export enum Interval {
  Annually = 'ANNUALLY',
  Daily = 'DAILY',
  Hourly = 'HOURLY',
  Monthly = 'MONTHLY',
}

export type InviteToken = {
  __typename?: 'InviteToken'
  createdAt: Scalars['DateTime']
  createdBy?: Maybe<Scalars['ID']>
  createdByUser?: Maybe<User>
  expiresAt?: Maybe<Scalars['DateTime']>
  id: Scalars['ID']
  redeemedAt?: Maybe<Scalars['DateTime']>
  redeemedBy: Scalars['ID']
  redeemedByUser?: Maybe<User>
  tenant: Tenant
  tenantId: Scalars['ID']
  token: Scalars['ID']
}

export type InviteTokenMutations = {
  __typename?: 'InviteTokenMutations'
  create: InviteToken
  redeem: InviteToken
}

export type InviteTokenMutationsCreateArgs = {
  expiresAt?: InputMaybe<Scalars['DateTime']>
  tenantId: Scalars['ID']
}

export type InviteTokenMutationsRedeemArgs = {
  token: Scalars['ID']
}

export type Item = {
  components?: Maybe<Array<Component>>
  createdAt?: Maybe<Scalars['DateTime']>
  externalReference?: Maybe<Scalars['String']>
  hasVersion?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  language: Scalars['String']
  name?: Maybe<Scalars['String']>
  relatingItems?: Maybe<Array<Item>>
  shape?: Maybe<Shape>
  tenantId: Scalars['ID']
  topics?: Maybe<Array<Topic>>
  tree?: Maybe<TreeNode>
  type: ItemType
  updatedAt?: Maybe<Scalars['DateTime']>
  version?: Maybe<VersionedRecordInfo>
}

export type ItemHasVersionArgs = {
  versionLabel?: InputMaybe<VersionLabel>
}

export type ItemConnection = {
  __typename?: 'ItemConnection'
  edges?: Maybe<Array<ItemConnectionEdge>>
  pageInfo: PageInfo
}

export type ItemConnectionEdge = {
  __typename?: 'ItemConnectionEdge'
  cursor: Scalars['String']
  node: Item
}

export type ItemMetrics = IObjectMetrics & {
  __typename?: 'ItemMetrics'
  count: Scalars['Int']
}

export type ItemMetricsCountArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
  type?: InputMaybe<ItemType>
}

export type ItemMutations = {
  __typename?: 'ItemMutations'
  bulkPublish?: Maybe<Array<PublishInfo>>
  bulkUnpublish?: Maybe<Array<PublishInfo>>
  delete: Scalars['Int']
  publish: PublishInfo
  unpublish?: Maybe<PublishInfo>
  updateComponent: Item
}

export type ItemMutationsBulkPublishArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>
  language: Scalars['String']
}

export type ItemMutationsBulkUnpublishArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>
  language: Scalars['String']
}

export type ItemMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type ItemMutationsPublishArgs = {
  id: Scalars['ID']
  includeDescendants?: InputMaybe<Scalars['Boolean']>
  language: Scalars['String']
}

export type ItemMutationsUnpublishArgs = {
  id: Scalars['ID']
  includeDescendants?: InputMaybe<Scalars['Boolean']>
  language: Scalars['String']
}

export type ItemMutationsUpdateComponentArgs = {
  input: ComponentInput
  itemId: Scalars['ID']
  language: Scalars['String']
}

export type ItemQueries = {
  __typename?: 'ItemQueries'
  get?: Maybe<Item>
  getMany?: Maybe<Array<Item>>
}

export type ItemQueriesGetArgs = {
  id: Scalars['ID']
  language: Scalars['String']
  versionLabel?: VersionLabel
}

export type ItemQueriesGetManyArgs = {
  externalReferences?: InputMaybe<Array<Scalars['String']>>
  language: Scalars['String']
  tenantId?: InputMaybe<Scalars['ID']>
  versionLabel?: VersionLabel
}

export type ItemRelationsComponentConfig = {
  __typename?: 'ItemRelationsComponentConfig'
  acceptedShapeIdentifiers?: Maybe<Array<Scalars['String']>>
  /** @deprecated max has been deprecated in favor of maxItems */
  max?: Maybe<Scalars['Int']>
  maxItems?: Maybe<Scalars['Int']>
  maxSkus?: Maybe<Scalars['Int']>
  /** @deprecated min has been deprecated in favor of minItems */
  min?: Maybe<Scalars['Int']>
  minItems?: Maybe<Scalars['Int']>
  minSkus?: Maybe<Scalars['Int']>
  quickSelect?: Maybe<ItemRelationsComponentQuickSelectConfig>
}

export type ItemRelationsComponentConfigInput = {
  acceptedShapeIdentifiers?: InputMaybe<Array<Scalars['String']>>
  max?: InputMaybe<Scalars['Int']>
  maxItems?: InputMaybe<Scalars['Int']>
  maxSkus?: InputMaybe<Scalars['Int']>
  min?: InputMaybe<Scalars['Int']>
  minItems?: InputMaybe<Scalars['Int']>
  minSkus?: InputMaybe<Scalars['Int']>
  quickSelect?: InputMaybe<ItemRelationsComponentQuickSelectConfigInput>
}

export type ItemRelationsComponentQuickSelectConfig = {
  __typename?: 'ItemRelationsComponentQuickSelectConfig'
  folders?: Maybe<Array<ItemRelationsComponentQuickSelectFolderConfig>>
}

export type ItemRelationsComponentQuickSelectConfigInput = {
  folders?: InputMaybe<
    Array<ItemRelationsComponentQuickSelectFolderConfigInput>
  >
}

export type ItemRelationsComponentQuickSelectFolderConfig = {
  __typename?: 'ItemRelationsComponentQuickSelectFolderConfig'
  folderId: Scalars['ID']
}

export type ItemRelationsComponentQuickSelectFolderConfigInput = {
  folderId: Scalars['ID']
}

export type ItemRelationsContent = {
  __typename?: 'ItemRelationsContent'
  items?: Maybe<Array<Item>>
  productVariants?: Maybe<Array<ProductVariant>>
}

export type ItemRelationsContentInput = {
  itemIds?: InputMaybe<Array<Scalars['ID']>>
  skus?: InputMaybe<Array<Scalars['String']>>
}

export enum ItemSortField {
  CreatedAt = 'createdAt',
}

export type ItemSuggestSearchResult = SuggestSearchResult & {
  __typename?: 'ItemSuggestSearchResult'
  id: Scalars['ID']
  name: Scalars['String']
  path: Scalars['String']
  shapeIdentifier: Scalars['String']
  tenantId: Scalars['ID']
  type: Scalars['String']
}

export enum ItemType {
  Document = 'document',
  Folder = 'folder',
  Product = 'product',
}

export type KeyValuePair = {
  __typename?: 'KeyValuePair'
  key: Scalars['String']
  value?: Maybe<Scalars['String']>
}

export type KeyValuePairInput = {
  key: Scalars['String']
  value?: InputMaybe<Scalars['String']>
}

export type KlarnaPayment = PaymentType & {
  __typename?: 'KlarnaPayment'
  id?: Maybe<Scalars['String']>
  merchantReference1?: Maybe<Scalars['String']>
  merchantReference2?: Maybe<Scalars['String']>
  metadata?: Maybe<Scalars['String']>
  orderId?: Maybe<Scalars['String']>
  provider: PaymentProvider
  recurringToken?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type KlarnaPaymentInput = {
  klarna?: InputMaybe<Scalars['String']>
  merchantReference1?: InputMaybe<Scalars['String']>
  merchantReference2?: InputMaybe<Scalars['String']>
  metadata?: InputMaybe<Scalars['String']>
  orderId?: InputMaybe<Scalars['String']>
  recurringToken?: InputMaybe<Scalars['String']>
  status?: InputMaybe<Scalars['String']>
}

export type Language = {
  __typename?: 'Language'
  code: Scalars['String']
  name: Scalars['String']
  system: Scalars['Boolean']
}

export type LanguageMutations = {
  __typename?: 'LanguageMutations'
  add?: Maybe<Array<Language>>
  remove?: Maybe<Array<Language>>
  update?: Maybe<Array<Language>>
}

export type LanguageMutationsAddArgs = {
  input: AddLanguageInput
  tenantId: Scalars['ID']
}

export type LanguageMutationsRemoveArgs = {
  code: Scalars['String']
  tenantId: Scalars['ID']
}

export type LanguageMutationsUpdateArgs = {
  code: Scalars['String']
  input: UpdateLanguageInput
  tenantId: Scalars['ID']
}

export type LocationContent = {
  __typename?: 'LocationContent'
  lat?: Maybe<Scalars['Float']>
  long?: Maybe<Scalars['Float']>
}

export type LocationContentInput = {
  lat?: InputMaybe<Scalars['Float']>
  long?: InputMaybe<Scalars['Float']>
}

export type Market = {
  __typename?: 'Market'
  createdAt: Scalars['DateTime']
  customerIdentifiers?: Maybe<Array<Scalars['String']>>
  identifier: Scalars['String']
  name: Scalars['String']
  tenant: Tenant
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type MarketConnection = {
  __typename?: 'MarketConnection'
  edges?: Maybe<Array<MarketConnectionEdge>>
  pageInfo: PageInfo
}

export type MarketConnectionEdge = {
  __typename?: 'MarketConnectionEdge'
  cursor: Scalars['String']
  node: Market
}

export type MarketMutations = {
  __typename?: 'MarketMutations'
  create: Market
  delete: Scalars['Int']
  update: Market
}

export type MarketMutationsCreateArgs = {
  input: CreateMarketInput
}

export type MarketMutationsDeleteArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type MarketMutationsUpdateArgs = {
  identifier: Scalars['String']
  input: UpdateMarketInput
  tenantId: Scalars['ID']
}

export type MarketQueries = {
  __typename?: 'MarketQueries'
  get?: Maybe<Market>
  getMany: MarketConnection
}

export type MarketQueriesGetArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type MarketQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  tenantId: Scalars['ID']
}

export type MaxFileSizeInput = {
  size: Scalars['Float']
  unit: FileSizeUnit
}

export type MeMutations = {
  __typename?: 'MeMutations'
  generateAccessToken?: Maybe<AccessToken>
  setPreference?: Maybe<Preference>
  /** @deprecated replaced by setPreference */
  setPreferences?: Maybe<Preferences>
  update?: Maybe<User>
}

export type MeMutationsGenerateAccessTokenArgs = {
  input: CreateAccessTokenInput
}

export type MeMutationsSetPreferenceArgs = {
  input: PreferenceInput
  tenantId?: InputMaybe<Scalars['ID']>
}

export type MeMutationsSetPreferencesArgs = {
  input: PreferencesInput
  tenantId?: InputMaybe<Scalars['ID']>
}

export type MeMutationsUpdateArgs = {
  input?: InputMaybe<UpdateUserInput>
}

export type Mutation = {
  __typename?: 'Mutation'
  accessToken?: Maybe<AccessTokenMutations>
  app?: Maybe<AppMutations>
  customer?: Maybe<CustomerMutations>
  document?: Maybe<DocumentMutations>
  fileUpload?: Maybe<FileUploadMutations>
  folder?: Maybe<FolderMutations>
  grid?: Maybe<GridMutations>
  image?: Maybe<ImageMutations>
  inviteToken?: Maybe<InviteTokenMutations>
  item?: Maybe<ItemMutations>
  language?: Maybe<LanguageMutations>
  /** **EXPERIMENTAL:** Watch out! This feature is still in testing process. */
  market: MarketMutations
  me?: Maybe<MeMutations>
  order?: Maybe<OrderMutations>
  pipeline?: Maybe<PipelineMutations>
  /** **EXPERIMENTAL:** Watch out! This feature is still in testing process. */
  priceList: PriceListMutations
  priceVariant: PriceVariantMutations
  product?: Maybe<ProductMutations>
  /** @deprecated productSubscription has been deprecated in favor of subscriptionContract */
  productSubscription: ProductSubscriptionMutations
  shape?: Maybe<ShapeMutations>
  stockLocation: StockLocationMutations
  subscriptionContract: SubscriptionContractMutations
  subscriptionPlan: SubscriptionPlanMutations
  tenant?: Maybe<TenantMutations>
  topic?: Maybe<TopicMutations>
  tree?: Maybe<TreeMutations>
  user?: Maybe<UserMutations>
  vatType?: Maybe<VatTypeMutations>
  video?: Maybe<VideoMutations>
  webhook?: Maybe<WebhookMutations>
}

export type NerdyViewPreferences = {
  __typename?: 'NerdyViewPreferences'
  enabled?: Maybe<Scalars['Boolean']>
}

export type NerdyViewPreferencesInput = {
  enabled?: InputMaybe<Scalars['Boolean']>
}

export type NumericComponentConfig = {
  __typename?: 'NumericComponentConfig'
  decimalPlaces?: Maybe<Scalars['Int']>
  units?: Maybe<Array<Scalars['String']>>
}

export type NumericComponentConfigInput = {
  decimalPlaces?: InputMaybe<Scalars['Int']>
  units?: InputMaybe<Array<Scalars['String']>>
}

export type NumericComponentContentInput = {
  number: Scalars['Float']
  unit?: InputMaybe<Scalars['String']>
}

export type NumericContent = {
  __typename?: 'NumericContent'
  number: Scalars['Float']
  unit?: Maybe<Scalars['String']>
}

export enum Operation {
  Avg = 'AVG',
  Sum = 'SUM',
}

export type Order = {
  __typename?: 'Order'
  additionalInformation?: Maybe<Scalars['String']>
  cart: Array<OrderItem>
  createdAt: Scalars['DateTime']
  customer?: Maybe<Customer>
  id: Scalars['ID']
  meta?: Maybe<Array<KeyValuePair>>
  payment?: Maybe<Array<Payment>>
  pipelines?: Maybe<Array<OrderPipeline>>
  tenant: Tenant
  tenantId: Scalars['ID']
  total?: Maybe<Price>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type OrderConnection = {
  __typename?: 'OrderConnection'
  edges?: Maybe<Array<OrderConnectionEdge>>
  pageInfo: PageInfo
}

export type OrderConnectionEdge = {
  __typename?: 'OrderConnectionEdge'
  cursor: Scalars['String']
  node: Order
}

export type OrderItem = {
  __typename?: 'OrderItem'
  imageUrl?: Maybe<Scalars['String']>
  meta?: Maybe<Array<KeyValuePair>>
  name: Scalars['String']
  orderId: Scalars['ID']
  price?: Maybe<Price>
  productId?: Maybe<Scalars['ID']>
  /** @deprecated Product Subscription IDs have been deprecated in favor of Subscription Contract IDs. Querying for them will be removed in a future release. */
  productSubscriptionId?: Maybe<Scalars['ID']>
  /** @deprecated Product variant IDs have been deprecated and replaced by SKUs. */
  productVariantId?: Maybe<Scalars['ID']>
  quantity: Scalars['NonNegativeInt']
  sku?: Maybe<Scalars['String']>
  subTotal?: Maybe<Price>
  subscription?: Maybe<OrderItemSubscription>
  subscriptionContractId?: Maybe<Scalars['ID']>
}

export type OrderItemInput = {
  imageUrl?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name: Scalars['String']
  price?: InputMaybe<PriceInput>
  productId?: InputMaybe<Scalars['ID']>
  productSubscriptionId?: InputMaybe<Scalars['ID']>
  quantity: Scalars['NonNegativeInt']
  sku?: InputMaybe<Scalars['String']>
  subTotal?: InputMaybe<PriceInput>
  subscriptionContractId?: InputMaybe<Scalars['ID']>
}

export type OrderItemMeteredVariable = {
  __typename?: 'OrderItemMeteredVariable'
  id: Scalars['ID']
  price: Scalars['Float']
  usage: Scalars['Float']
}

export type OrderItemSubscription = {
  __typename?: 'OrderItemSubscription'
  end?: Maybe<Scalars['DateTime']>
  meteredVariables?: Maybe<Array<OrderItemMeteredVariable>>
  name?: Maybe<Scalars['String']>
  period: Scalars['PositiveInt']
  start?: Maybe<Scalars['DateTime']>
  unit: OrderItemSubscriptionPeriodUnit
}

export enum OrderItemSubscriptionPeriodUnit {
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
  Month = 'month',
  Week = 'week',
  Year = 'year',
}

export type OrderMetrics = IObjectMetrics & {
  __typename?: 'OrderMetrics'
  count: Scalars['Int']
}

export type OrderMetricsCountArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type OrderMutations = {
  __typename?: 'OrderMutations'
  delete: Scalars['Int']
  removePipeline: Order
  setPipelineStage: Order
  update: Order
}

export type OrderMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type OrderMutationsRemovePipelineArgs = {
  orderId: Scalars['ID']
  pipelineId: Scalars['ID']
}

export type OrderMutationsSetPipelineStageArgs = {
  orderId: Scalars['ID']
  pipelineId: Scalars['ID']
  stageId: Scalars['ID']
}

export type OrderMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateOrderInput
}

export type OrderPipeline = {
  __typename?: 'OrderPipeline'
  pipeline: Pipeline
  pipelineId: Scalars['ID']
  stageId: Scalars['ID']
}

export type OrderQueries = {
  __typename?: 'OrderQueries'
  get?: Maybe<Order>
  getMany?: Maybe<OrderConnection>
}

export type OrderQueriesGetArgs = {
  id: Scalars['ID']
}

export type OrderQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  customerIdentifier?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  pipelineId?: InputMaybe<Scalars['ID']>
  pipelineStageId?: InputMaybe<Scalars['ID']>
  sort?: InputMaybe<SortDirection>
  sortField?: InputMaybe<OrderSortField>
  tenantId?: InputMaybe<Scalars['ID']>
}

export enum OrderSortField {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export type OrdersReport = {
  __typename?: 'OrdersReport'
  avg: Array<Maybe<ReportMetric>>
  sum: Array<Maybe<ReportMetric>>
  total: Scalars['Int']
}

export type OrdersReportAvgArgs = {
  direction?: InputMaybe<SortDirection>
  end?: InputMaybe<Scalars['DateTime']>
  filterBySKUs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  groupBy?: InputMaybe<Parameter>
  limit?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Parameter>
  resolution?: InputMaybe<Interval>
  start?: InputMaybe<Scalars['DateTime']>
}

export type OrdersReportSumArgs = {
  direction?: InputMaybe<SortDirection>
  end?: InputMaybe<Scalars['DateTime']>
  filterBySKUs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  groupBy?: InputMaybe<Parameter>
  limit?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Parameter>
  resolution?: InputMaybe<Interval>
  start?: InputMaybe<Scalars['DateTime']>
}

export type OrdersReportTotalArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor: Scalars['String']
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor: Scalars['String']
  totalNodes: Scalars['Int']
}

export type ParagraphCollectionContent = {
  __typename?: 'ParagraphCollectionContent'
  paragraphs?: Maybe<Array<ParagraphContent>>
}

export type ParagraphCollectionContentInput = {
  paragraphs: Array<ParagraphContentInput>
}

export type ParagraphContent = {
  __typename?: 'ParagraphContent'
  body?: Maybe<RichTextContent>
  images?: Maybe<Array<Image>>
  title?: Maybe<SingleLineContent>
  videos?: Maybe<Array<Video>>
}

export type ParagraphContentInput = {
  body?: InputMaybe<RichTextContentInput>
  images?: InputMaybe<Array<ImageInput>>
  title?: InputMaybe<SingleLineContentInput>
  videos?: InputMaybe<Array<VideoInput>>
}

export enum Parameter {
  Currency = 'CURRENCY',
  Date = 'DATE',
  Product = 'PRODUCT',
  Value = 'VALUE',
}

export type Payment =
  | CashPayment
  | CustomPayment
  | KlarnaPayment
  | PaypalPayment
  | StripePayment

export type PaymentInput = {
  cash?: InputMaybe<CashPaymentInput>
  custom?: InputMaybe<CustomPaymentInput>
  klarna?: InputMaybe<KlarnaPaymentInput>
  paypal?: InputMaybe<PaypalPaymentInput>
  provider: PaymentProvider
  stripe?: InputMaybe<StripePaymentInput>
}

export enum PaymentProvider {
  Cash = 'cash',
  Custom = 'custom',
  Klarna = 'klarna',
  Paypal = 'paypal',
  Stripe = 'stripe',
}

export type PaymentType = {
  provider: PaymentProvider
}

export type PaypalPayment = PaymentType & {
  __typename?: 'PaypalPayment'
  id?: Maybe<Scalars['String']>
  invoiceId?: Maybe<Scalars['String']>
  metadata?: Maybe<Scalars['String']>
  orderId?: Maybe<Scalars['String']>
  provider: PaymentProvider
  subscriptionId?: Maybe<Scalars['String']>
}

export type PaypalPaymentInput = {
  invoiceId?: InputMaybe<Scalars['String']>
  metadata?: InputMaybe<Scalars['String']>
  orderId?: InputMaybe<Scalars['String']>
  paypal?: InputMaybe<Scalars['String']>
  subscriptionId?: InputMaybe<Scalars['String']>
}

export type Pipeline = {
  __typename?: 'Pipeline'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  name: Scalars['String']
  orders: OrderConnection
  stages?: Maybe<Array<PipelineStage>>
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type PipelineOrdersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortDirection>
  sortField?: InputMaybe<OrderSortField>
}

export type PipelineConnection = {
  __typename?: 'PipelineConnection'
  edges?: Maybe<Array<PipelineConnectionEdge>>
  pageInfo: PageInfo
}

export type PipelineConnectionEdge = {
  __typename?: 'PipelineConnectionEdge'
  cursor: Scalars['String']
  node: Pipeline
}

export type PipelineMutations = {
  __typename?: 'PipelineMutations'
  addStage: Pipeline
  create: Pipeline
  delete?: Maybe<Scalars['Int']>
  moveStage: Pipeline
  removeStage: Pipeline
  update: Pipeline
  updateStage: Pipeline
}

export type PipelineMutationsAddStageArgs = {
  input: CreatePipelineStageInput
  pipelineId: Scalars['ID']
  position?: InputMaybe<Scalars['Int']>
}

export type PipelineMutationsCreateArgs = {
  input: CreatePipelineInput
}

export type PipelineMutationsDeleteArgs = {
  force?: InputMaybe<Scalars['Boolean']>
  id: Scalars['ID']
}

export type PipelineMutationsMoveStageArgs = {
  newPosition: Scalars['Int']
  pipelineId: Scalars['ID']
  stageId: Scalars['ID']
}

export type PipelineMutationsRemoveStageArgs = {
  force?: InputMaybe<Scalars['Boolean']>
  pipelineId: Scalars['ID']
  stageId: Scalars['ID']
}

export type PipelineMutationsUpdateArgs = {
  id: Scalars['ID']
  input?: InputMaybe<UpdatePipelineInput>
}

export type PipelineMutationsUpdateStageArgs = {
  input: UpdatePipelineStageInput
  pipelineId: Scalars['ID']
  stageId: Scalars['ID']
}

export type PipelineQueries = {
  __typename?: 'PipelineQueries'
  get?: Maybe<Pipeline>
  getMany: PipelineConnection
}

export type PipelineQueriesGetArgs = {
  id: Scalars['ID']
}

export type PipelineQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortDirection>
  sortField?: InputMaybe<PipelineSortField>
  tenantId: Scalars['ID']
}

export enum PipelineSortField {
  CreatedAt = 'createdAt',
}

export type PipelineStage = {
  __typename?: 'PipelineStage'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  name: Scalars['String']
  orders: OrderConnection
  placeNewOrders: Scalars['Boolean']
}

export type PipelineStageOrdersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortDirection>
  sortField?: InputMaybe<OrderSortField>
}

export type Preference = {
  __typename?: 'Preference'
  enabled: Scalars['Boolean']
  name: Scalars['String']
}

export type PreferenceInput = {
  enabled?: InputMaybe<Scalars['Boolean']>
  experimental?: InputMaybe<Scalars['Boolean']>
  name: Scalars['String']
}

export type Preferences = {
  __typename?: 'Preferences'
  experimental?: Maybe<ExperimentalPreferences>
}

export type PreferencesInput = {
  experimental?: InputMaybe<ExperimentalPreferencesInput>
}

export type PresignedUploadRequest = {
  __typename?: 'PresignedUploadRequest'
  fields: Array<UploadField>
  lifetime: Scalars['Int']
  maxSize: Scalars['Int']
  url?: Maybe<Scalars['String']>
}

export type Price = {
  __typename?: 'Price'
  currency: Scalars['String']
  discounts?: Maybe<Array<Discount>>
  gross?: Maybe<Scalars['Float']>
  net?: Maybe<Scalars['Float']>
  tax?: Maybe<Tax>
}

export type PriceInput = {
  currency: Scalars['String']
  discounts?: InputMaybe<Array<DiscountInput>>
  gross?: InputMaybe<Scalars['Float']>
  net?: InputMaybe<Scalars['Float']>
  tax?: InputMaybe<TaxInput>
}

export type PriceList = {
  __typename?: 'PriceList'
  createdAt: Scalars['DateTime']
  endDate?: Maybe<Scalars['DateTime']>
  identifier: Scalars['String']
  modifierType: PriceListModifierType
  name: Scalars['String']
  price?: Maybe<Scalars['Float']>
  priceVariants?: Maybe<Array<PriceListPriceVariant>>
  selectedProductVariants: PriceListSelectedProductVariants
  startDate?: Maybe<Scalars['DateTime']>
  targetAudience: PriceListTargetAudience
  tenant: Tenant
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type PriceListPriceArgs = {
  identifier?: Scalars['String']
}

export type PriceListConnection = {
  __typename?: 'PriceListConnection'
  edges?: Maybe<Array<PriceListConnectionEdge>>
  pageInfo: PageInfo
}

export type PriceListConnectionEdge = {
  __typename?: 'PriceListConnectionEdge'
  cursor: Scalars['String']
  node: PriceList
}

export enum PriceListModifierType {
  Absolute = 'ABSOLUTE',
  Percentage = 'PERCENTAGE',
  Relative = 'RELATIVE',
}

export type PriceListMutations = {
  __typename?: 'PriceListMutations'
  create: PriceList
  delete: Scalars['Int']
  removeSelectedProductVariants: PriceList
  update: PriceList
  upsertSelectedProductVariants: PriceList
}

export type PriceListMutationsCreateArgs = {
  input: CreatePriceListInput
}

export type PriceListMutationsDeleteArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type PriceListMutationsRemoveSelectedProductVariantsArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
  variants: Array<Scalars['String']>
}

export type PriceListMutationsUpdateArgs = {
  identifier: Scalars['String']
  input: UpdatePriceListInput
  tenantId: Scalars['ID']
}

export type PriceListMutationsUpsertSelectedProductVariantsArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
  variants: Array<CreatePriceListProductVariant>
}

export type PriceListPriceVariant = {
  __typename?: 'PriceListPriceVariant'
  decimalPlaces?: Maybe<Scalars['Int']>
  identifier: Scalars['String']
  modifier: Scalars['Float']
}

export type PriceListPriceVariantReferenceInput = {
  decimalPlaces?: InputMaybe<Scalars['Int']>
  identifier: Scalars['String']
  modifier: Scalars['Float']
}

export type PriceListProduct = {
  __typename?: 'PriceListProduct'
  priceVariants?: Maybe<Array<PriceListPriceVariant>>
  sku: Scalars['String']
}

export type PriceListProductPriceVariantReference = {
  identifier: Scalars['String']
  modifier?: InputMaybe<Scalars['Float']>
}

export enum PriceListProductSelectionType {
  AllSkus = 'ALL_SKUS',
  SomeSkus = 'SOME_SKUS',
}

export type PriceListQueries = {
  __typename?: 'PriceListQueries'
  get?: Maybe<PriceList>
  getMany?: Maybe<PriceListConnection>
  getProductVariants?: Maybe<ProductVariantConnection>
}

export type PriceListQueriesGetArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type PriceListQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  tenantId: Scalars['ID']
}

export type PriceListQueriesGetProductVariantsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  identifier: Scalars['String']
  language: Scalars['String']
  last?: InputMaybe<Scalars['Int']>
  tenantId: Scalars['ID']
  versionLabel?: VersionLabel
}

export type PriceListSelectedProductVariants = {
  __typename?: 'PriceListSelectedProductVariants'
  type?: Maybe<PriceListProductSelectionType>
}

export type PriceListTargetAudience = {
  __typename?: 'PriceListTargetAudience'
  marketIdentifiers?: Maybe<Array<Scalars['String']>>
  type: PriceListTargetAudienceType
}

export enum PriceListTargetAudienceType {
  Everyone = 'EVERYONE',
  Some = 'SOME',
}

export type PriceVariant = {
  __typename?: 'PriceVariant'
  createdAt: Scalars['DateTime']
  currency: Scalars['String']
  identifier: Scalars['String']
  name?: Maybe<Scalars['String']>
  tenant: Tenant
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type PriceVariantMutations = {
  __typename?: 'PriceVariantMutations'
  create: PriceVariant
  delete: Scalars['Int']
  update: PriceVariant
}

export type PriceVariantMutationsCreateArgs = {
  input: CreatePriceVariantInput
}

export type PriceVariantMutationsDeleteArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type PriceVariantMutationsUpdateArgs = {
  identifier: Scalars['String']
  input: UpdatePriceVariantInput
  tenantId: Scalars['ID']
}

export type PriceVariantQueries = {
  __typename?: 'PriceVariantQueries'
  get?: Maybe<PriceVariant>
  getMany?: Maybe<Array<PriceVariant>>
}

export type PriceVariantQueriesGetArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type PriceVariantQueriesGetManyArgs = {
  tenantId: Scalars['ID']
}

export type PriceVariantReferenceInput = {
  identifier: Scalars['String']
  price?: InputMaybe<Scalars['Float']>
}

export type Product = Item & {
  __typename?: 'Product'
  components?: Maybe<Array<Component>>
  createdAt?: Maybe<Scalars['DateTime']>
  defaultVariant: ProductVariant
  externalReference?: Maybe<Scalars['String']>
  hasVersion?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  /** @deprecated option removed */
  isSubscriptionOnly?: Maybe<Scalars['Boolean']>
  /** @deprecated option removed */
  isVirtual?: Maybe<Scalars['Boolean']>
  language: Scalars['String']
  name?: Maybe<Scalars['String']>
  relatingItems?: Maybe<Array<Item>>
  shape?: Maybe<Shape>
  tenantId: Scalars['ID']
  topics?: Maybe<Array<Topic>>
  tree?: Maybe<TreeNode>
  type: ItemType
  updatedAt?: Maybe<Scalars['DateTime']>
  variant?: Maybe<ProductVariant>
  variants: Array<ProductVariant>
  vatType?: Maybe<VatType>
  vatTypeId?: Maybe<Scalars['ID']>
  version?: Maybe<VersionedRecordInfo>
}

export type ProductHasVersionArgs = {
  versionLabel?: InputMaybe<VersionLabel>
}

export type ProductVariantArgs = {
  sku: Scalars['String']
}

export type ProductMutations = {
  __typename?: 'ProductMutations'
  addVariant: Product
  create: Product
  delete: Scalars['Int']
  publish: PublishInfo
  setDefaultVariant: Product
  unpublish?: Maybe<PublishInfo>
  update: Product
  updateStock: ProductStockLocation
  updateVariant: Product
  updateVariantComponent: Product
}

export type ProductMutationsAddVariantArgs = {
  input: CreateProductVariantInput
  language: Scalars['String']
  productId: Scalars['ID']
}

export type ProductMutationsCreateArgs = {
  input: CreateProductInput
  language: Scalars['String']
}

export type ProductMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type ProductMutationsPublishArgs = {
  id: Scalars['ID']
  includeDescendants?: InputMaybe<Scalars['Boolean']>
  language: Scalars['String']
}

export type ProductMutationsSetDefaultVariantArgs = {
  language: Scalars['String']
  productId: Scalars['ID']
  sku?: InputMaybe<Scalars['String']>
}

export type ProductMutationsUnpublishArgs = {
  id: Scalars['ID']
  includeDescendants?: InputMaybe<Scalars['Boolean']>
  language: Scalars['String']
}

export type ProductMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateProductInput
  language: Scalars['String']
}

export type ProductMutationsUpdateStockArgs = {
  productId: Scalars['ID']
  sku: Scalars['String']
  stock: Scalars['Int']
  stockLocationIdentifier?: Scalars['String']
}

export type ProductMutationsUpdateVariantArgs = {
  input: UpdateSingleProductVariantInput
  language: Scalars['String']
  productId: Scalars['ID']
  sku?: InputMaybe<Scalars['String']>
}

export type ProductMutationsUpdateVariantComponentArgs = {
  input: ComponentInput
  language: Scalars['String']
  productId: Scalars['ID']
  sku: Scalars['String']
}

export type ProductPriceVariant = {
  __typename?: 'ProductPriceVariant'
  currency?: Maybe<Scalars['String']>
  identifier: Scalars['String']
  name?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  priceList?: Maybe<ProductVariantPriceList>
  priceLists?: Maybe<Array<ProductVariantPriceList>>
}

export type ProductPriceVariantPriceListArgs = {
  identifier: Scalars['String']
}

export type ProductQueries = {
  __typename?: 'ProductQueries'
  get?: Maybe<Product>
  getVariants?: Maybe<Array<ProductVariant>>
}

export type ProductQueriesGetArgs = {
  id: Scalars['ID']
  language: Scalars['String']
  versionLabel?: VersionLabel
}

export type ProductQueriesGetVariantsArgs = {
  externalReferences?: InputMaybe<Array<Scalars['String']>>
  language: Scalars['String']
  skus?: InputMaybe<Array<Scalars['String']>>
  tenantId: Scalars['ID']
  versionLabel?: VersionLabel
}

export type ProductStockLocation = {
  __typename?: 'ProductStockLocation'
  identifier: Scalars['String']
  meta?: Maybe<Array<KeyValuePair>>
  name: Scalars['String']
  settings?: Maybe<StockLocationSettings>
  stock?: Maybe<Scalars['Int']>
}

export type ProductSubscription = {
  __typename?: 'ProductSubscription'
  customer?: Maybe<Customer>
  customerIdentifier: Scalars['String']
  id: Scalars['ID']
  initial?: Maybe<ProductSubscriptionPhase>
  item: ProductSubscriptionItem
  payment?: Maybe<Payment>
  recurring?: Maybe<ProductSubscriptionPhase>
  status: ProductSubscriptionStatus
  subscriptionPlan?: Maybe<SubscriptionPlan>
  tenant: Tenant
  tenantId: Scalars['ID']
  usage?: Maybe<Array<ProductSubscriptionUsage>>
}

export type ProductSubscriptionUsageArgs = {
  end: Scalars['DateTime']
  start: Scalars['DateTime']
}

export type ProductSubscriptionConnection = {
  __typename?: 'ProductSubscriptionConnection'
  edges?: Maybe<Array<ProductSubscriptionConnectionEdge>>
  pageInfo: PageInfo
}

export type ProductSubscriptionConnectionEdge = {
  __typename?: 'ProductSubscriptionConnectionEdge'
  cursor: Scalars['String']
  node: ProductSubscription
}

export type ProductSubscriptionHistoryEvent = {
  type: ProductSubscriptionHistoryEventType
}

export type ProductSubscriptionHistoryEventCancellation =
  ProductSubscriptionHistoryEvent & {
    __typename?: 'ProductSubscriptionHistoryEventCancellation'
    activeUntil?: Maybe<Scalars['DateTime']>
    cancelledAt: Scalars['DateTime']
    deactivated: Scalars['Boolean']
    type: ProductSubscriptionHistoryEventType
  }

export type ProductSubscriptionHistoryEventRenewal =
  ProductSubscriptionHistoryEvent & {
    __typename?: 'ProductSubscriptionHistoryEventRenewal'
    activeUntil?: Maybe<Scalars['DateTime']>
    currency: Scalars['String']
    price: Scalars['Float']
    renewedAt: Scalars['DateTime']
    type: ProductSubscriptionHistoryEventType
  }

export type ProductSubscriptionHistoryEventRenewalDueBroadcast =
  ProductSubscriptionHistoryEvent & {
    __typename?: 'ProductSubscriptionHistoryEventRenewalDueBroadcast'
    broadcastAt: Scalars['DateTime']
    renewAt: Scalars['DateTime']
    type: ProductSubscriptionHistoryEventType
  }

export enum ProductSubscriptionHistoryEventType {
  Cancellation = 'CANCELLATION',
  Renewal = 'RENEWAL',
  RenewalDueBroadcast = 'RENEWAL_DUE_BROADCAST',
}

export type ProductSubscriptionItem = {
  __typename?: 'ProductSubscriptionItem'
  imageUrl?: Maybe<Scalars['String']>
  meta?: Maybe<Array<KeyValuePair>>
  name: Scalars['String']
  quantity: Scalars['NonNegativeInt']
  sku: Scalars['String']
}

export type ProductSubscriptionMutations = {
  __typename?: 'ProductSubscriptionMutations'
  cancel: ProductSubscription
  create: ProductSubscription
  delete?: Maybe<Scalars['Int']>
  renew: ProductSubscription
  update: ProductSubscription
}

export type ProductSubscriptionMutationsCancelArgs = {
  deactivate?: InputMaybe<Scalars['Boolean']>
  id: Scalars['ID']
}

export type ProductSubscriptionMutationsCreateArgs = {
  input: CreateProductSubscriptionInput
}

export type ProductSubscriptionMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type ProductSubscriptionMutationsRenewArgs = {
  id: Scalars['ID']
}

export type ProductSubscriptionMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateProductSubscriptionInput
}

export type ProductSubscriptionPhase = {
  __typename?: 'ProductSubscriptionPhase'
  currency: Scalars['String']
  period: Scalars['Int']
  price: Scalars['Float']
  unit: SubscriptionPeriodUnit
}

export type ProductSubscriptionPlanReferenceInput = {
  identifier: Scalars['String']
  periodId: Scalars['ID']
}

export type ProductSubscriptionQueries = {
  __typename?: 'ProductSubscriptionQueries'
  get?: Maybe<ProductSubscription>
  getMany?: Maybe<ProductSubscriptionConnection>
}

export type ProductSubscriptionQueriesGetArgs = {
  id: Scalars['ID']
}

export type ProductSubscriptionQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  customerIdentifier?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortDirection>
  sortField?: InputMaybe<ProductSubscriptionSortField>
  tenantId: Scalars['ID']
}

export enum ProductSubscriptionSortField {
  UpdatedAt = 'updatedAt',
}

export type ProductSubscriptionStatus = {
  __typename?: 'ProductSubscriptionStatus'
  activeUntil?: Maybe<Scalars['DateTime']>
  currency: Scalars['String']
  price: Scalars['Float']
  renewAt?: Maybe<Scalars['DateTime']>
}

export type ProductSubscriptionUsage = {
  __typename?: 'ProductSubscriptionUsage'
  meteredVariableId: Scalars['ID']
  quantity?: Maybe<Scalars['Float']>
}

export type ProductVariant = {
  __typename?: 'ProductVariant'
  attributes?: Maybe<Array<ProductVariantAttribute>>
  components?: Maybe<Array<Component>>
  externalReference?: Maybe<Scalars['String']>
  /** @deprecated Product variant IDs have been deprecated and replaced by SKUs. */
  id: Scalars['ID']
  images?: Maybe<Array<Image>>
  isDefault: Scalars['Boolean']
  name?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  priceVariants?: Maybe<Array<ProductPriceVariant>>
  product: Product
  productId: Scalars['ID']
  sku: Scalars['String']
  stock?: Maybe<Scalars['Int']>
  stockLocations?: Maybe<Array<ProductStockLocation>>
  subscriptionPlans?: Maybe<Array<ProductVariantSubscriptionPlan>>
  videos?: Maybe<Array<Video>>
}

export type ProductVariantPriceArgs = {
  identifier?: Scalars['String']
}

export type ProductVariantStockArgs = {
  identifier?: Scalars['String']
}

export type ProductVariantAttribute = {
  __typename?: 'ProductVariantAttribute'
  attribute: Scalars['String']
  value: Scalars['String']
}

export type ProductVariantAttributeInput = {
  attribute: Scalars['String']
  value: Scalars['String']
}

export type ProductVariantConnection = {
  __typename?: 'ProductVariantConnection'
  edges?: Maybe<Array<ProductVariantConnectionEdge>>
  pageInfo: PageInfo
}

export type ProductVariantConnectionEdge = {
  __typename?: 'ProductVariantConnectionEdge'
  cursor: Scalars['String']
  node: ProductVariant
}

export type ProductVariantPriceList = {
  __typename?: 'ProductVariantPriceList'
  endDate?: Maybe<Scalars['DateTime']>
  identifier: Scalars['String']
  modifier: Scalars['Float']
  modifierType: PriceListModifierType
  price: Scalars['Float']
  startDate?: Maybe<Scalars['DateTime']>
}

export type ProductVariantSubscriptionMeteredVariable = {
  __typename?: 'ProductVariantSubscriptionMeteredVariable'
  id: Scalars['ID']
  identifier: Scalars['String']
  name: Scalars['String']
  tierType: TierType
  tiers: Array<ProductVariantSubscriptionPlanTier>
}

export type ProductVariantSubscriptionPlan = {
  __typename?: 'ProductVariantSubscriptionPlan'
  identifier: Scalars['String']
  name?: Maybe<Scalars['String']>
  periods: Array<ProductVariantSubscriptionPlanPeriod>
  tenantId: Scalars['ID']
}

export type ProductVariantSubscriptionPlanPeriod = {
  __typename?: 'ProductVariantSubscriptionPlanPeriod'
  id: Scalars['ID']
  initial?: Maybe<ProductVariantSubscriptionPlanPricing>
  name: Scalars['String']
  recurring?: Maybe<ProductVariantSubscriptionPlanPricing>
}

export type ProductVariantSubscriptionPlanPricing = {
  __typename?: 'ProductVariantSubscriptionPlanPricing'
  meteredVariables?: Maybe<Array<ProductVariantSubscriptionMeteredVariable>>
  period: Scalars['Int']
  price?: Maybe<Scalars['Float']>
  priceVariants?: Maybe<Array<ProductPriceVariant>>
  unit: SubscriptionPeriodUnit
}

export type ProductVariantSubscriptionPlanPricingPriceArgs = {
  identifier?: InputMaybe<Scalars['String']>
}

export type ProductVariantSubscriptionPlanTier = {
  __typename?: 'ProductVariantSubscriptionPlanTier'
  price?: Maybe<Scalars['Float']>
  priceVariants?: Maybe<Array<ProductPriceVariant>>
  threshold: Scalars['Int']
}

export type ProductVariantSubscriptionPlanTierPriceArgs = {
  identifier?: InputMaybe<Scalars['String']>
}

export type PropertiesTableComponentConfig = {
  __typename?: 'PropertiesTableComponentConfig'
  sections: Array<PropertiesTableComponentConfigSection>
}

export type PropertiesTableComponentConfigInput = {
  sections: Array<PropertiesTableComponentConfigSectionInput>
}

export type PropertiesTableComponentConfigSection = {
  __typename?: 'PropertiesTableComponentConfigSection'
  keys: Array<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type PropertiesTableComponentConfigSectionInput = {
  keys: Array<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type PropertiesTableComponentSection = {
  __typename?: 'PropertiesTableComponentSection'
  properties?: Maybe<Array<KeyValuePair>>
  title?: Maybe<Scalars['String']>
}

export type PropertiesTableComponentSectionInput = {
  properties?: InputMaybe<Array<KeyValuePairInput>>
  title?: InputMaybe<Scalars['String']>
}

export type PropertiesTableContent = {
  __typename?: 'PropertiesTableContent'
  sections?: Maybe<Array<PropertiesTableComponentSection>>
}

export type PropertiesTableContentInput = {
  sections?: InputMaybe<Array<PropertiesTableComponentSectionInput>>
}

export type PublishInfo = {
  __typename?: 'PublishInfo'
  id: Scalars['ID']
  language?: Maybe<Scalars['String']>
  versionId?: Maybe<Scalars['ID']>
}

export type Query = {
  __typename?: 'Query'
  app: AppQueries
  currencySummary?: Maybe<CurrencySummaryReport>
  customer: CustomerQueries
  document: DocumentQueries
  file: FileQueries
  folder: FolderQueries
  grid: GridQueries
  image: ImageQueries
  item: ItemQueries
  /** **EXPERIMENTAL:** Watch out! This feature is still in testing process. */
  market: MarketQueries
  me?: Maybe<User>
  order: OrderQueries
  pipeline: PipelineQueries
  /** **EXPERIMENTAL:** Watch out! This feature is still in testing process. */
  priceList: PriceListQueries
  priceVariant: PriceVariantQueries
  product: ProductQueries
  /** @deprecated productSubscription has been deprecated in favor of subscriptionContract */
  productSubscription: ProductSubscriptionQueries
  report?: Maybe<TenantReports>
  search?: Maybe<SearchQueries>
  shape: ShapeQueries
  stockLocation: StockLocationQueries
  subscriptionContract: SubscriptionContractQueries
  subscriptionContractEvent?: Maybe<SubscriptionContractEventQueries>
  subscriptionPlan: SubscriptionPlanQueries
  tenant: TenantQueries
  topic: TopicQueries
  tree: TreeQueries
  user: UserQueries
  version?: Maybe<VersionedServices>
  webhook: WebhookQueries
}

export type RegenerateSecretsInput = {
  signatureSecret?: InputMaybe<Scalars['Boolean']>
  staticAuthToken?: InputMaybe<Scalars['Boolean']>
}

export type ReportMetric = {
  __typename?: 'ReportMetric'
  currency?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['DateTime']>
  name?: Maybe<Scalars['String']>
  product?: Maybe<Product>
  sku?: Maybe<Scalars['String']>
  value: Scalars['Float']
}

export type ReportMetricProductArgs = {
  language: Scalars['String']
}

export type RichTextContent = {
  __typename?: 'RichTextContent'
  html?: Maybe<Array<Scalars['String']>>
  json?: Maybe<Array<Maybe<Scalars['JSON']>>>
  plainText?: Maybe<Array<Scalars['String']>>
}

export type RichTextContentInput = {
  html?: InputMaybe<Array<Scalars['String']>>
  json?: InputMaybe<Array<Scalars['JSON']>>
}

export type SalesReport = IObjectReports & {
  __typename?: 'SalesReport'
  avg: Array<Maybe<ReportMetric>>
  sum: Array<Maybe<ReportMetric>>
  total: Scalars['Float']
}

export type SalesReportAvgArgs = {
  direction?: InputMaybe<SortDirection>
  end?: InputMaybe<Scalars['DateTime']>
  filterBySKUs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  groupBy?: InputMaybe<Parameter>
  limit?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Parameter>
  resolution?: InputMaybe<Interval>
  start?: InputMaybe<Scalars['DateTime']>
}

export type SalesReportSumArgs = {
  direction?: InputMaybe<SortDirection>
  end?: InputMaybe<Scalars['DateTime']>
  filterBySKUs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  groupBy?: InputMaybe<Parameter>
  limit?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Parameter>
  resolution?: InputMaybe<Interval>
  start?: InputMaybe<Scalars['DateTime']>
}

export type SalesReportTotalArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type SearchQueries = {
  __typename?: 'SearchQueries'
  suggest?: Maybe<SuggestSearchConnection>
  topics?: Maybe<TopicSearchConnection>
}

export type SearchQueriesSuggestArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  language: Scalars['String']
  searchTerm?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
  types?: InputMaybe<Array<SuggestSearchItemType>>
}

export type SearchQueriesTopicsArgs = {
  language: Scalars['String']
  searchTerm?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
}

export type SelectionComponentConfig = {
  __typename?: 'SelectionComponentConfig'
  max?: Maybe<Scalars['Int']>
  min?: Maybe<Scalars['Int']>
  options: Array<SelectionComponentOptionConfig>
}

export type SelectionComponentConfigInput = {
  max?: InputMaybe<Scalars['Int']>
  min?: InputMaybe<Scalars['Int']>
  options: Array<SelectionComponentOptionConfigInput>
}

export type SelectionComponentContentInput = {
  keys: Array<Scalars['String']>
}

export type SelectionComponentOptionConfig = {
  __typename?: 'SelectionComponentOptionConfig'
  isPreselected?: Maybe<Scalars['Boolean']>
  key: Scalars['String']
  value: Scalars['String']
}

export type SelectionComponentOptionConfigInput = {
  isPreselected?: InputMaybe<Scalars['Boolean']>
  key: Scalars['String']
  value: Scalars['String']
}

export type SelectionContent = {
  __typename?: 'SelectionContent'
  options: Array<KeyValuePair>
}

export type Shape = {
  __typename?: 'Shape'
  components?: Maybe<Array<ShapeComponent>>
  createdAt: Scalars['DateTime']
  /** @deprecated Shape IDs have been deprecated in favor of human readable identifiers. Querying for them will be removed in a future release. */
  id?: Maybe<Scalars['ID']>
  identifier: Scalars['String']
  itemCount: Scalars['Int']
  items?: Maybe<Array<Item>>
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
  name: Scalars['String']
  tenantId: Scalars['ID']
  type: ShapeType
  updatedAt?: Maybe<Scalars['DateTime']>
  variantComponents?: Maybe<Array<ShapeComponent>>
}

export type ShapeItemsArgs = {
  language: Scalars['String']
}

export type ShapeMetaPropertyArgs = {
  key: Scalars['String']
}

export type ShapeComponent = {
  __typename?: 'ShapeComponent'
  config?: Maybe<ComponentConfig>
  description?: Maybe<Scalars['String']>
  id: Scalars['String']
  name: Scalars['String']
  type: ComponentType
}

export type ShapeComponentInput = {
  config?: InputMaybe<ComponentConfigInput>
  description?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  type: ComponentType
}

export type ShapeMetrics = IObjectMetrics & {
  __typename?: 'ShapeMetrics'
  count: Scalars['Int']
}

export type ShapeMetricsCountArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type ShapeMutations = {
  __typename?: 'ShapeMutations'
  create: Shape
  delete: Scalars['Int']
  /** @deprecated Migrating legacy shape ids will be removed in a future release. */
  migrateLegacyId: Shape
  update: Shape
}

export type ShapeMutationsCreateArgs = {
  input: CreateShapeInput
}

export type ShapeMutationsDeleteArgs = {
  identifier?: InputMaybe<Scalars['String']>
  tenantId?: InputMaybe<Scalars['ID']>
}

export type ShapeMutationsMigrateLegacyIdArgs = {
  id: Scalars['String']
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type ShapeMutationsUpdateArgs = {
  identifier?: InputMaybe<Scalars['String']>
  input: UpdateShapeInput
  tenantId?: InputMaybe<Scalars['ID']>
}

export type ShapeQueries = {
  __typename?: 'ShapeQueries'
  get?: Maybe<Shape>
  getMany?: Maybe<Array<Shape>>
}

export type ShapeQueriesGetArgs = {
  identifier?: InputMaybe<Scalars['String']>
  tenantId?: InputMaybe<Scalars['ID']>
}

export type ShapeQueriesGetManyArgs = {
  tenantId: Scalars['ID']
}

export enum ShapeType {
  Document = 'document',
  Folder = 'folder',
  Product = 'product',
}

export type SingleLineContent = {
  __typename?: 'SingleLineContent'
  text?: Maybe<Scalars['String']>
}

export type SingleLineContentInput = {
  text?: InputMaybe<Scalars['String']>
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type StockLocation = {
  __typename?: 'StockLocation'
  identifier: Scalars['String']
  name: Scalars['String']
  settings: StockLocationSettings
  tenant: Tenant
  tenantId: Scalars['ID']
}

export type StockLocationMutations = {
  __typename?: 'StockLocationMutations'
  create: StockLocation
  delete: Scalars['Int']
  update: StockLocation
}

export type StockLocationMutationsCreateArgs = {
  input: CreateStockLocationInput
}

export type StockLocationMutationsDeleteArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type StockLocationMutationsUpdateArgs = {
  identifier: Scalars['String']
  input: UpdateStockLocationInput
  tenantId: Scalars['ID']
}

export type StockLocationQueries = {
  __typename?: 'StockLocationQueries'
  get?: Maybe<StockLocation>
  getMany?: Maybe<Array<StockLocation>>
}

export type StockLocationQueriesGetArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type StockLocationQueriesGetManyArgs = {
  tenantId: Scalars['ID']
}

export type StockLocationReferenceInput = {
  identifier: Scalars['String']
  meta?: InputMaybe<Array<KeyValuePairInput>>
  stock?: InputMaybe<Scalars['Int']>
}

export type StockLocationSettings = {
  __typename?: 'StockLocationSettings'
  minimum?: Maybe<Scalars['Int']>
  unlimited: Scalars['Boolean']
}

export type StockLocationSettingsInput = {
  minimum?: InputMaybe<Scalars['Int']>
}

export type StripePayment = PaymentType & {
  __typename?: 'StripePayment'
  customerId?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  metadata?: Maybe<Scalars['String']>
  orderId?: Maybe<Scalars['String']>
  paymentIntentId?: Maybe<Scalars['String']>
  paymentMethod?: Maybe<Scalars['String']>
  paymentMethodId?: Maybe<Scalars['String']>
  provider: PaymentProvider
  subscriptionId?: Maybe<Scalars['String']>
}

export type StripePaymentInput = {
  customerId?: InputMaybe<Scalars['String']>
  metadata?: InputMaybe<Scalars['String']>
  orderId?: InputMaybe<Scalars['String']>
  paymentIntentId?: InputMaybe<Scalars['String']>
  paymentMethod?: InputMaybe<Scalars['String']>
  paymentMethodId?: InputMaybe<Scalars['String']>
  stripe?: InputMaybe<Scalars['String']>
  subscriptionId?: InputMaybe<Scalars['String']>
}

export type SubscriptionContract = {
  __typename?: 'SubscriptionContract'
  addresses?: Maybe<Array<SubscriptionContractAddress>>
  createdAt: Scalars['DateTime']
  customer?: Maybe<Customer>
  customerIdentifier: Scalars['String']
  id: Scalars['ID']
  initial?: Maybe<SubscriptionContractPhase>
  item: SubscriptionContractItem
  payment?: Maybe<Payment>
  recurring?: Maybe<SubscriptionContractPhase>
  status: SubscriptionContractStatus
  subscriptionPlan?: Maybe<SubscriptionPlan>
  tenant: Tenant
  tenantId: Scalars['ID']
  updatedAt: Scalars['DateTime']
  usage?: Maybe<Array<SubscriptionContractUsage>>
}

export type SubscriptionContractUsageArgs = {
  end: Scalars['DateTime']
  start: Scalars['DateTime']
}

export type SubscriptionContractAddress = {
  __typename?: 'SubscriptionContractAddress'
  city?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['EmailAddress']>
  firstName?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  middleName?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  street2?: Maybe<Scalars['String']>
  streetNumber?: Maybe<Scalars['String']>
  type: AddressType
}

export type SubscriptionContractCancelledEvent = SubscriptionContractEvent & {
  __typename?: 'SubscriptionContractCancelledEvent'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  type: SubscriptionContractEventType
}

export type SubscriptionContractConnection = {
  __typename?: 'SubscriptionContractConnection'
  edges?: Maybe<Array<SubscriptionContractConnectionEdge>>
  pageInfo: PageInfo
}

export type SubscriptionContractConnectionEdge = {
  __typename?: 'SubscriptionContractConnectionEdge'
  cursor: Scalars['String']
  node: SubscriptionContract
}

export type SubscriptionContractEvent = {
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  type: SubscriptionContractEventType
}

export type SubscriptionContractEventConnection = {
  __typename?: 'SubscriptionContractEventConnection'
  edges?: Maybe<Array<SubscriptionContractEventConnectionEdge>>
  pageInfo: PageInfo
}

export type SubscriptionContractEventConnectionEdge = {
  __typename?: 'SubscriptionContractEventConnectionEdge'
  cursor: Scalars['String']
  node: SubscriptionContractEvent
}

export type SubscriptionContractEventQueries = {
  __typename?: 'SubscriptionContractEventQueries'
  getMany?: Maybe<SubscriptionContractEventConnection>
}

export type SubscriptionContractEventQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  eventTypes?: InputMaybe<Array<SubscriptionContractEventType>>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortDirection>
  subscriptionContractId: Scalars['ID']
  tenantId: Scalars['ID']
}

export enum SubscriptionContractEventSortField {
  Id = '_id',
}

export enum SubscriptionContractEventType {
  Cancelled = 'cancelled',
  RenewalDueBroadcast = 'renewalDueBroadcast',
  Renewed = 'renewed',
  UsageTracked = 'usageTracked',
}

export type SubscriptionContractItem = {
  __typename?: 'SubscriptionContractItem'
  imageUrl?: Maybe<Scalars['String']>
  meta?: Maybe<Array<KeyValuePair>>
  name: Scalars['String']
  sku: Scalars['String']
}

export type SubscriptionContractMeteredVariableReference = {
  __typename?: 'SubscriptionContractMeteredVariableReference'
  id: Scalars['ID']
  tierType?: Maybe<TierType>
  tiers: Array<SubscriptionContractMeteredVariableTierReference>
}

export type SubscriptionContractMeteredVariableTierReference = {
  __typename?: 'SubscriptionContractMeteredVariableTierReference'
  currency: Scalars['String']
  price?: Maybe<Scalars['Float']>
  threshold: Scalars['Int']
}

export type SubscriptionContractMutations = {
  __typename?: 'SubscriptionContractMutations'
  cancel: SubscriptionContract
  create: SubscriptionContract
  delete?: Maybe<Scalars['Int']>
  renew: SubscriptionContract
  trackUsage: SubscriptionContractUsageTrackedEvent
  update: SubscriptionContract
}

export type SubscriptionContractMutationsCancelArgs = {
  deactivate?: InputMaybe<Scalars['Boolean']>
  id: Scalars['ID']
}

export type SubscriptionContractMutationsCreateArgs = {
  input: CreateSubscriptionContractInput
}

export type SubscriptionContractMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type SubscriptionContractMutationsRenewArgs = {
  id: Scalars['ID']
}

export type SubscriptionContractMutationsTrackUsageArgs = {
  id: Scalars['ID']
  input: TrackUsageInput
}

export type SubscriptionContractMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateSubscriptionContractInput
}

export type SubscriptionContractPhase = {
  __typename?: 'SubscriptionContractPhase'
  currency: Scalars['String']
  meteredVariables?: Maybe<Array<SubscriptionContractMeteredVariableReference>>
  period: Scalars['Int']
  price: Scalars['Float']
  unit: SubscriptionPeriodUnit
}

export type SubscriptionContractQueries = {
  __typename?: 'SubscriptionContractQueries'
  get?: Maybe<SubscriptionContract>
  getMany?: Maybe<SubscriptionContractConnection>
}

export type SubscriptionContractQueriesGetArgs = {
  id: Scalars['ID']
}

export type SubscriptionContractQueriesGetManyArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  customerIdentifier?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortDirection>
  sortField?: InputMaybe<SubscriptionContractSortField>
  tenantId: Scalars['ID']
}

export type SubscriptionContractRenewalDueBroadcastEvent =
  SubscriptionContractEvent & {
    __typename?: 'SubscriptionContractRenewalDueBroadcastEvent'
    createdAt: Scalars['DateTime']
    data: SubscriptionContractRenewalDueBroadcastEventData
    id: Scalars['ID']
    type: SubscriptionContractEventType
  }

export type SubscriptionContractRenewalDueBroadcastEventData = {
  __typename?: 'SubscriptionContractRenewalDueBroadcastEventData'
  broadcastAt: Scalars['DateTime']
  renewAt: Scalars['DateTime']
}

export type SubscriptionContractRenewedEvent = SubscriptionContractEvent & {
  __typename?: 'SubscriptionContractRenewedEvent'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  type: SubscriptionContractEventType
}

export enum SubscriptionContractSortField {
  Id = '_id',
  UpdatedAt = 'updatedAt',
}

export type SubscriptionContractStatus = {
  __typename?: 'SubscriptionContractStatus'
  activeUntil?: Maybe<Scalars['DateTime']>
  currency: Scalars['String']
  price: Scalars['Float']
  renewAt?: Maybe<Scalars['DateTime']>
}

export type SubscriptionContractUsage = {
  __typename?: 'SubscriptionContractUsage'
  meteredVariableId: Scalars['ID']
  quantity?: Maybe<Scalars['Float']>
}

export type SubscriptionContractUsageTrackedData = {
  __typename?: 'SubscriptionContractUsageTrackedData'
  description?: Maybe<Scalars['String']>
  idempotencyKey?: Maybe<Scalars['String']>
  meteredVariableId: Scalars['ID']
  quantity: Scalars['Float']
}

export type SubscriptionContractUsageTrackedEvent =
  SubscriptionContractEvent & {
    __typename?: 'SubscriptionContractUsageTrackedEvent'
    createdAt: Scalars['DateTime']
    data?: Maybe<SubscriptionContractUsageTrackedData>
    id: Scalars['ID']
    type: SubscriptionContractEventType
  }

export enum SubscriptionPeriodUnit {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year',
}

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan'
  createdAt: Scalars['DateTime']
  identifier: Scalars['String']
  meteredVariables?: Maybe<Array<SubscriptionPlanMeteredVariable>>
  name?: Maybe<Scalars['String']>
  periods?: Maybe<Array<SubscriptionPlanPeriod>>
  tenant: Tenant
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type SubscriptionPlanMeteredVariable = {
  __typename?: 'SubscriptionPlanMeteredVariable'
  id: Scalars['ID']
  identifier: Scalars['String']
  name?: Maybe<Scalars['String']>
  unit: Scalars['String']
}

export type SubscriptionPlanMeteredVariableInput = {
  id?: InputMaybe<Scalars['ID']>
  identifier: Scalars['String']
  name?: InputMaybe<Scalars['String']>
  unit: Scalars['String']
}

export type SubscriptionPlanMeteredVariableReferenceInput = {
  id: Scalars['ID']
  tierType?: InputMaybe<TierType>
  tiers?: InputMaybe<Array<SubscriptionPlanMeteredVariableTierReferenceInput>>
}

export type SubscriptionPlanMeteredVariableTierReferenceInput = {
  price?: InputMaybe<Scalars['Float']>
  priceVariants?: InputMaybe<Array<PriceVariantReferenceInput>>
  threshold: Scalars['Int']
}

export type SubscriptionPlanMutations = {
  __typename?: 'SubscriptionPlanMutations'
  create: SubscriptionPlan
  delete: Scalars['Int']
  update: SubscriptionPlan
}

export type SubscriptionPlanMutationsCreateArgs = {
  input: CreateSubscriptionPlanInput
}

export type SubscriptionPlanMutationsDeleteArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type SubscriptionPlanMutationsUpdateArgs = {
  identifier: Scalars['String']
  input: UpdateSubscriptionPlanInput
  tenantId: Scalars['ID']
}

export type SubscriptionPlanPeriod = {
  __typename?: 'SubscriptionPlanPeriod'
  id: Scalars['ID']
  initial?: Maybe<SubscriptionPlanPhase>
  name: Scalars['String']
  recurring: SubscriptionPlanPhase
}

export type SubscriptionPlanPeriodInput = {
  id?: InputMaybe<Scalars['ID']>
  initial?: InputMaybe<SubscriptionPlanPhaseInput>
  name: Scalars['String']
  recurring: SubscriptionPlanPhaseInput
}

export type SubscriptionPlanPeriodReferenceInput = {
  id: Scalars['ID']
  initial?: InputMaybe<SubscriptionPlanPriceInput>
  recurring: SubscriptionPlanPriceInput
}

export type SubscriptionPlanPhase = {
  __typename?: 'SubscriptionPlanPhase'
  period: Scalars['Int']
  unit: SubscriptionPeriodUnit
}

export type SubscriptionPlanPhaseInput = {
  period: Scalars['Int']
  unit: SubscriptionPeriodUnit
}

export type SubscriptionPlanPriceInput = {
  meteredVariables?: InputMaybe<
    Array<SubscriptionPlanMeteredVariableReferenceInput>
  >
  price?: InputMaybe<Scalars['Float']>
  priceVariants?: InputMaybe<Array<PriceVariantReferenceInput>>
}

export type SubscriptionPlanQueries = {
  __typename?: 'SubscriptionPlanQueries'
  get?: Maybe<SubscriptionPlan>
  getMany?: Maybe<Array<SubscriptionPlan>>
}

export type SubscriptionPlanQueriesGetArgs = {
  identifier: Scalars['String']
  tenantId: Scalars['ID']
}

export type SubscriptionPlanQueriesGetManyArgs = {
  tenantId: Scalars['ID']
}

export type SubscriptionPlanReferenceInput = {
  identifier: Scalars['String']
  meteredVariables?: InputMaybe<
    Array<SubscriptionPlanMeteredVariableReferenceInput>
  >
  periods: Array<SubscriptionPlanPeriodReferenceInput>
}

export type SuggestSearchAggregations = {
  __typename?: 'SuggestSearchAggregations'
  totalResults: Scalars['Int']
  typesAggregation: Array<SuggestSearchTypesAggregation>
}

export type SuggestSearchConnection = {
  __typename?: 'SuggestSearchConnection'
  aggregations: SuggestSearchAggregations
  edges?: Maybe<Array<SuggestSearchConnectionEdge>>
  pageInfo: PageInfo
}

export type SuggestSearchConnectionEdge = {
  __typename?: 'SuggestSearchConnectionEdge'
  cursor: Scalars['String']
  node: SuggestSearchResult
}

export enum SuggestSearchItemType {
  Document = 'DOCUMENT',
  Folder = 'FOLDER',
  Grid = 'GRID',
  Pipeline = 'PIPELINE',
  Product = 'PRODUCT',
  Shape = 'SHAPE',
  Topic = 'TOPIC',
  Webhook = 'WEBHOOK',
}

export type SuggestSearchResult = {
  id: Scalars['ID']
  name: Scalars['String']
  path: Scalars['String']
  tenantId: Scalars['ID']
  type: Scalars['String']
}

export type SuggestSearchTypesAggregation = {
  __typename?: 'SuggestSearchTypesAggregation'
  count: Scalars['Int']
  type: Scalars['String']
}

export type Tax = {
  __typename?: 'Tax'
  name?: Maybe<Scalars['String']>
  percent?: Maybe<Scalars['Float']>
}

export type TaxInput = {
  name?: InputMaybe<Scalars['String']>
  percent?: InputMaybe<Scalars['Float']>
}

export type Tenant = {
  __typename?: 'Tenant'
  authenticationMethod?: Maybe<TenantAuthenticationMethod>
  availableLanguages?: Maybe<Array<Language>>
  createdAt: Scalars['DateTime']
  defaults: TenantDefaults
  grids?: Maybe<Array<Grid>>
  id: Scalars['ID']
  identifier: Scalars['String']
  isActive: Scalars['Boolean']
  isTrial: Scalars['Boolean']
  logo?: Maybe<Image>
  meta?: Maybe<Array<KeyValuePair>>
  metaProperty?: Maybe<Scalars['String']>
  metrics?: Maybe<TenantMetrics>
  name: Scalars['String']
  preferences?: Maybe<TenantPreferences>
  rootItemId: Scalars['ID']
  shapes?: Maybe<Array<Shape>>
  /** Empty string for non-admin users. */
  signatureSecret: Scalars['String']
  /** Empty string for non-admin users. */
  staticAuthToken?: Maybe<Scalars['String']>
  topics?: Maybe<Array<Topic>>
  tree?: Maybe<Array<TreeNode>>
  updatedAt?: Maybe<Scalars['DateTime']>
  users?: Maybe<Array<UserTenantRole>>
  vatTypes?: Maybe<Array<VatType>>
  webhooks?: Maybe<Array<Webhook>>
}

export type TenantGridsArgs = {
  language: Scalars['String']
  versionLabel?: VersionLabel
}

export type TenantMetaPropertyArgs = {
  key: Scalars['String']
}

export type TenantTopicsArgs = {
  language: Scalars['String']
}

export type TenantTreeArgs = {
  versionLabel?: InputMaybe<VersionLabel>
}

export type TenantWebhooksArgs = {
  concern?: InputMaybe<Scalars['String']>
  event?: InputMaybe<Scalars['String']>
}

export type TenantAuthenticationMethod = {
  __typename?: 'TenantAuthenticationMethod'
  catalogue?: Maybe<AuthenticationMethod>
  search?: Maybe<AuthenticationMethod>
}

export type TenantAuthenticationMethodInput = {
  catalogue?: InputMaybe<AuthenticationMethod>
  search?: InputMaybe<AuthenticationMethod>
}

export enum TenantCopyExcludeableTypes {
  Assets = 'assets',
}

export type TenantDefaults = {
  __typename?: 'TenantDefaults'
  currency: Scalars['String']
  language: Scalars['String']
}

export type TenantDefaultsInput = {
  currency?: InputMaybe<Scalars['String']>
  language?: InputMaybe<Scalars['String']>
}

export type TenantFrontend = {
  __typename?: 'TenantFrontend'
  /** @deprecated authentication property has been deprecated */
  authentication?: Maybe<TenantFrontendAuthentication>
  name: Scalars['String']
  /** @deprecated responsive property has been deprecated */
  responsive?: Maybe<Scalars['Boolean']>
  url: Scalars['String']
}

export type TenantFrontendAuthentication = {
  __typename?: 'TenantFrontendAuthentication'
  key: Scalars['String']
  value: Scalars['String']
}

export type TenantFrontendAuthenticationInput = {
  key: Scalars['String']
  value: Scalars['String']
}

export type TenantFrontendInput = {
  name: Scalars['String']
  url: Scalars['String']
}

export type TenantMetrics = {
  __typename?: 'TenantMetrics'
  apiCalls: ApiCallMetrics
  bandwidth: BandwidthUsageMetrics
  items: ItemMetrics
  orders: OrderMetrics
  shapes: ShapeMetrics
  users: UserMetrics
  webhooks: WebhookMetrics
}

export type TenantMutations = {
  __typename?: 'TenantMutations'
  addUsers: Array<UserTenantRole>
  create: Tenant
  createCopyTask: BulkTaskTenantCopyInfo
  delete: Scalars['Int']
  regenerateSecrets: Tenant
  /** @deprecated Replaced by regenerateSecrets */
  regenerateStaticAuthToken: Tenant
  removeUsers?: Maybe<Array<UserTenantRole>>
  setAuthenticationMethod: Tenant
  setPreferences: TenantPreferences
  update: Tenant
}

export type TenantMutationsAddUsersArgs = {
  roles: Array<UserRoleInput>
  tenantId: Scalars['ID']
}

export type TenantMutationsCreateArgs = {
  input: CreateTenantInput
}

export type TenantMutationsCreateCopyTaskArgs = {
  desiredIdentifier: Scalars['String']
  desiredName?: InputMaybe<Scalars['String']>
  exclude?: InputMaybe<Array<TenantCopyExcludeableTypes>>
  overwrite?: InputMaybe<Scalars['Boolean']>
  tenantId: Scalars['ID']
}

export type TenantMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type TenantMutationsRegenerateSecretsArgs = {
  input?: InputMaybe<RegenerateSecretsInput>
  tenantId: Scalars['ID']
}

export type TenantMutationsRegenerateStaticAuthTokenArgs = {
  tenantId: Scalars['ID']
}

export type TenantMutationsRemoveUsersArgs = {
  tenantId: Scalars['ID']
  userIds: Array<Scalars['ID']>
}

export type TenantMutationsSetAuthenticationMethodArgs = {
  input?: InputMaybe<TenantAuthenticationMethodInput>
  tenantId: Scalars['ID']
}

export type TenantMutationsSetPreferencesArgs = {
  input: TenantPreferencesInput
  tenantId: Scalars['ID']
}

export type TenantMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateTenantInput
}

export type TenantPreferences = {
  __typename?: 'TenantPreferences'
  frontends?: Maybe<Array<Maybe<TenantFrontend>>>
}

export type TenantPreferencesInput = {
  frontends?: InputMaybe<Array<TenantFrontendInput>>
}

export type TenantQueries = {
  __typename?: 'TenantQueries'
  get?: Maybe<Tenant>
  getMany?: Maybe<Array<Tenant>>
  getRootTopics?: Maybe<Array<Maybe<Topic>>>
  suggestIdentifier: IdentifierSuggestion
}

export type TenantQueriesGetArgs = {
  id?: InputMaybe<Scalars['ID']>
  identifier?: InputMaybe<Scalars['String']>
}

export type TenantQueriesGetManyArgs = {
  identifier?: InputMaybe<Scalars['String']>
}

export type TenantQueriesGetRootTopicsArgs = {
  language: Scalars['String']
  tenantId: Scalars['ID']
}

export type TenantQueriesSuggestIdentifierArgs = {
  desired: Scalars['String']
}

export type TenantReports = {
  __typename?: 'TenantReports'
  orders: OrdersReport
  sales: SalesReport
}

export type TenantReportsOrdersArgs = {
  currency: Scalars['String']
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
  tenantId: Scalars['ID']
}

export type TenantReportsSalesArgs = {
  currency: Scalars['String']
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
  tenantId: Scalars['ID']
}

export type TenantRoleInput = {
  role: UserRole
  tenantId: Scalars['ID']
}

export enum TierType {
  Graduated = 'graduated',
  Volume = 'volume',
}

export type Topic = {
  __typename?: 'Topic'
  ancestors?: Maybe<Array<Topic>>
  childCount: Scalars['Int']
  children?: Maybe<Array<Topic>>
  createdAt: Scalars['DateTime']
  descendants?: Maybe<Array<Topic>>
  id: Scalars['ID']
  items?: Maybe<Array<Item>>
  language?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  parent?: Maybe<Topic>
  parentId?: Maybe<Scalars['ID']>
  path: Scalars['String']
  tenant: Tenant
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type TopicConnection = {
  __typename?: 'TopicConnection'
  edges?: Maybe<Array<TopicConnectionEdge>>
  pageInfo: PageInfo
}

export type TopicConnectionEdge = {
  __typename?: 'TopicConnectionEdge'
  cursor: Scalars['String']
  node: Topic
}

export type TopicImagesModified = {
  __typename?: 'TopicImagesModified'
  modified?: Maybe<Scalars['Int']>
}

export type TopicItemsModified = {
  __typename?: 'TopicItemsModified'
  modified?: Maybe<Scalars['Int']>
}

export type TopicMutations = {
  __typename?: 'TopicMutations'
  addImages: TopicImagesModified
  addItems: TopicItemsModified
  bulkCreate: Array<Topic>
  create: Topic
  delete: Scalars['Int']
  removeImages: TopicImagesModified
  removeItems: TopicItemsModified
  update: Topic
}

export type TopicMutationsAddImagesArgs = {
  imageKeys: Array<Scalars['String']>
  topicId: Scalars['ID']
}

export type TopicMutationsAddItemsArgs = {
  itemIds: Array<Scalars['ID']>
  topicId: Scalars['ID']
}

export type TopicMutationsBulkCreateArgs = {
  input: Array<BulkCreateTopicInput>
  language: Scalars['String']
  tenantId: Scalars['ID']
}

export type TopicMutationsCreateArgs = {
  input: CreateTopicInput
  language: Scalars['String']
}

export type TopicMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type TopicMutationsRemoveImagesArgs = {
  imageKeys: Array<Scalars['String']>
  topicId: Scalars['ID']
}

export type TopicMutationsRemoveItemsArgs = {
  itemIds: Array<Scalars['ID']>
  topicId: Scalars['ID']
}

export type TopicMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateTopicInput
  language: Scalars['String']
}

export type TopicQueries = {
  __typename?: 'TopicQueries'
  /** Returns a specific topic. Topics can be queried either by ID or by path. */
  get?: Maybe<Topic>
  getRootTopics?: Maybe<Array<Maybe<Topic>>>
}

export type TopicQueriesGetArgs = {
  id?: InputMaybe<Scalars['ID']>
  language: Scalars['String']
  path?: InputMaybe<GetTopicByPathArguments>
}

export type TopicQueriesGetRootTopicsArgs = {
  language: Scalars['String']
  tenantId: Scalars['ID']
}

export type TopicSearchAggregations = {
  __typename?: 'TopicSearchAggregations'
  totalResults: Scalars['Int']
}

export type TopicSearchConnection = {
  __typename?: 'TopicSearchConnection'
  aggregations: TopicSearchAggregations
  edges?: Maybe<Array<TopicSearchConnectionEdge>>
}

export type TopicSearchConnectionEdge = {
  __typename?: 'TopicSearchConnectionEdge'
  node: TopicSearchResult
}

export type TopicSearchResult = {
  __typename?: 'TopicSearchResult'
  display: Scalars['String']
  id: Scalars['ID']
  language: Scalars['String']
  name: Scalars['String']
  path: Scalars['String']
  tenantId: Scalars['ID']
}

export type TrackUsageInput = {
  description?: InputMaybe<Scalars['String']>
  idempotencyKey?: InputMaybe<Scalars['String']>
  meteredVariableId: Scalars['ID']
  quantity: Scalars['Float']
}

export type TreeMutations = {
  __typename?: 'TreeMutations'
  createNode: TreeNode
  deleteNode: Scalars['Int']
  moveNode: TreeNode
}

export type TreeMutationsCreateNodeArgs = {
  input: FullTreeNodeInput
}

export type TreeMutationsDeleteNodeArgs = {
  itemId: Scalars['ID']
}

export type TreeMutationsMoveNodeArgs = {
  input: TreeNodeInput
  itemId: Scalars['ID']
}

export type TreeNode = {
  __typename?: 'TreeNode'
  ancestors?: Maybe<Array<TreeNode>>
  childCount?: Maybe<Scalars['Int']>
  children?: Maybe<Array<TreeNode>>
  identifiers?: Maybe<Array<TreeNodeIdentifier>>
  item?: Maybe<Item>
  itemId: Scalars['ID']
  language?: Maybe<Scalars['String']>
  parent?: Maybe<TreeNode>
  parentId?: Maybe<Scalars['ID']>
  path?: Maybe<Scalars['String']>
  position?: Maybe<Scalars['PositiveInt']>
  siblings?: Maybe<Array<TreeNode>>
  versionLabel: VersionLabel
}

export type TreeNodeItemArgs = {
  language?: InputMaybe<Scalars['String']>
}

export type TreeNodePathArgs = {
  language?: InputMaybe<Scalars['String']>
}

export type TreeNodeIdentifier = {
  __typename?: 'TreeNodeIdentifier'
  identifier: Scalars['String']
  language: Scalars['String']
}

export type TreeNodeIdentifierInput = {
  identifier: Scalars['String']
  language: Scalars['String']
}

export type TreeNodeInput = {
  parentId: Scalars['ID']
  position?: InputMaybe<Scalars['PositiveInt']>
}

export type TreeQueries = {
  __typename?: 'TreeQueries'
  getNode?: Maybe<TreeNode>
}

export type TreeQueriesGetNodeArgs = {
  itemId: Scalars['ID']
  language?: InputMaybe<Scalars['String']>
  versionLabel?: VersionLabel
}

export type UpdateAppInput = {
  baseUrl?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
}

export type UpdateCustomerAddressInput = {
  city?: InputMaybe<Scalars['String']>
  country?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['EmailAddress']>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  middleName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  postalCode?: InputMaybe<Scalars['String']>
  state?: InputMaybe<Scalars['String']>
  street?: InputMaybe<Scalars['String']>
  street2?: InputMaybe<Scalars['String']>
  streetNumber?: InputMaybe<Scalars['String']>
  type?: InputMaybe<AddressType>
}

export type UpdateCustomerInput = {
  addresses?: InputMaybe<Array<CreateCustomerAddressInput>>
  birthDate?: InputMaybe<Scalars['Date']>
  companyName?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  externalReferences?: InputMaybe<Array<KeyValuePairInput>>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  middleName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  taxNumber?: InputMaybe<Scalars['String']>
}

export type UpdateDocumentInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  topicIds?: InputMaybe<Array<Scalars['ID']>>
}

export type UpdateFolderInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  topicIds?: InputMaybe<Array<Scalars['ID']>>
}

export type UpdateGridInput = {
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name?: InputMaybe<Scalars['String']>
  rows?: InputMaybe<Array<GridRowInput>>
}

export type UpdateImageInput = {
  altText?: InputMaybe<Scalars['String']>
  caption?: InputMaybe<RichTextContentInput>
  focalPoint?: InputMaybe<FocalPointInput>
  meta?: InputMaybe<Array<KeyValuePairInput>>
}

export type UpdateLanguageInput = {
  name: Scalars['String']
}

export type UpdateMarketInput = {
  customerIdentifiers?: InputMaybe<Array<Scalars['String']>>
  name?: InputMaybe<Scalars['String']>
}

export type UpdateOrderInput = {
  additionalInformation?: InputMaybe<Scalars['String']>
  cart?: InputMaybe<Array<OrderItemInput>>
  customer?: InputMaybe<CustomerInput>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  payment?: InputMaybe<Array<PaymentInput>>
  total?: InputMaybe<PriceInput>
}

export type UpdatePipelineInput = {
  name: Scalars['String']
}

export type UpdatePipelineStageInput = {
  name?: InputMaybe<Scalars['String']>
  placeNewOrders?: InputMaybe<Scalars['Boolean']>
}

export type UpdatePriceListInput = {
  endDate?: InputMaybe<Scalars['DateTime']>
  modifierType?: InputMaybe<PriceListModifierType>
  name?: InputMaybe<Scalars['String']>
  priceVariants?: InputMaybe<Array<PriceListPriceVariantReferenceInput>>
  selectedProductVariants?: InputMaybe<CreatePriceListSelectedProductVariantsInput>
  startDate?: InputMaybe<Scalars['DateTime']>
  targetAudience?: InputMaybe<CreatePriceListTargetAudienceInput>
}

export type UpdatePriceVariantInput = {
  currency?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
}

export type UpdateProductInput = {
  components?: InputMaybe<Array<ComponentInput>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  externalReference?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  topicIds?: InputMaybe<Array<Scalars['ID']>>
  variants?: InputMaybe<Array<UpdateProductVariantInput>>
  vatTypeId?: InputMaybe<Scalars['ID']>
}

export type UpdateProductSubscriptionInput = {
  addresses?: InputMaybe<Array<CreateProductSubscriptionAddressInput>>
  initial?: InputMaybe<UpdateProductSubscriptionPhaseInput>
  item?: InputMaybe<UpdateProductSubscriptionItemInput>
  payment?: InputMaybe<PaymentInput>
  recurring?: InputMaybe<UpdateProductSubscriptionPhaseInput>
  status?: InputMaybe<UpdateProductSubscriptionStatusInput>
}

export type UpdateProductSubscriptionItemInput = {
  imageUrl?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name?: InputMaybe<Scalars['String']>
  quantity?: InputMaybe<Scalars['NonNegativeInt']>
  sku?: InputMaybe<Scalars['String']>
}

export type UpdateProductSubscriptionPhaseInput = {
  currency?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Float']>
}

export type UpdateProductSubscriptionStatusInput = {
  activeUntil?: InputMaybe<Scalars['DateTime']>
  currency?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Float']>
  renewAt?: InputMaybe<Scalars['DateTime']>
}

export type UpdateProductVariantInput = {
  attributes?: InputMaybe<Array<ProductVariantAttributeInput>>
  components?: InputMaybe<Array<ComponentInput>>
  externalReference?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['String']>
  images?: InputMaybe<Array<ImageInput>>
  isDefault?: InputMaybe<Scalars['Boolean']>
  name?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Float']>
  priceVariants?: InputMaybe<Array<PriceVariantReferenceInput>>
  sku?: InputMaybe<Scalars['String']>
  stock?: InputMaybe<Scalars['Int']>
  stockLocations?: InputMaybe<Array<StockLocationReferenceInput>>
  subscriptionPlans?: InputMaybe<Array<SubscriptionPlanReferenceInput>>
  videos?: InputMaybe<Array<VideoInput>>
}

export type UpdateShapeInput = {
  components?: InputMaybe<Array<ShapeComponentInput>>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name?: InputMaybe<Scalars['String']>
  variantComponents?: InputMaybe<Array<ShapeComponentInput>>
}

export type UpdateSingleProductVariantInput = {
  attributes?: InputMaybe<Array<ProductVariantAttributeInput>>
  components?: InputMaybe<Array<ComponentInput>>
  externalReference?: InputMaybe<Scalars['String']>
  images?: InputMaybe<Array<ImageInput>>
  name?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Float']>
  priceVariants?: InputMaybe<Array<PriceVariantReferenceInput>>
  sku?: InputMaybe<Scalars['String']>
  stock?: InputMaybe<Scalars['Int']>
  stockLocations?: InputMaybe<Array<StockLocationReferenceInput>>
  subscriptionPlans?: InputMaybe<Array<SubscriptionPlanReferenceInput>>
  videos?: InputMaybe<Array<VideoInput>>
}

export type UpdateStockLocationInput = {
  name?: InputMaybe<Scalars['String']>
  settings?: InputMaybe<StockLocationSettingsInput>
}

export type UpdateSubscriptionContractInput = {
  addresses?: InputMaybe<Array<CreateSubscriptionContractAddressInput>>
  initial?: InputMaybe<UpdateSubscriptionContractPhaseInput>
  item?: InputMaybe<UpdateSubscriptionContractItemInput>
  payment?: InputMaybe<PaymentInput>
  recurring?: InputMaybe<UpdateSubscriptionContractPhaseInput>
  status?: InputMaybe<UpdateSubscriptionContractStatusInput>
}

export type UpdateSubscriptionContractItemInput = {
  imageUrl?: InputMaybe<Scalars['String']>
  meta?: InputMaybe<Array<KeyValuePairInput>>
  name?: InputMaybe<Scalars['String']>
  quantity?: InputMaybe<Scalars['NonNegativeInt']>
  sku?: InputMaybe<Scalars['String']>
}

export type UpdateSubscriptionContractPhaseInput = {
  currency?: InputMaybe<Scalars['String']>
  meteredVariables?: InputMaybe<
    Array<CreateSubscriptionContractMeteredVariableReferenceInput>
  >
  price?: InputMaybe<Scalars['Float']>
}

export type UpdateSubscriptionContractStatusInput = {
  activeUntil?: InputMaybe<Scalars['DateTime']>
  currency?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Float']>
  renewAt?: InputMaybe<Scalars['DateTime']>
}

export type UpdateSubscriptionPlanInput = {
  meteredVariables?: InputMaybe<Array<SubscriptionPlanMeteredVariableInput>>
  name?: InputMaybe<Scalars['String']>
  periods?: InputMaybe<Array<SubscriptionPlanPeriodInput>>
}

export type UpdateTenantInput = {
  defaults?: InputMaybe<TenantDefaultsInput>
  isActive?: InputMaybe<Scalars['Boolean']>
  isTrial?: InputMaybe<Scalars['Boolean']>
  logo?: InputMaybe<ImageInput>
  name?: InputMaybe<Scalars['String']>
}

export type UpdateTopicInput = {
  name?: InputMaybe<Scalars['String']>
  parentId?: InputMaybe<Scalars['ID']>
  pathIdentifier?: InputMaybe<Scalars['String']>
}

export type UpdateUserInput = {
  companyName?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  marketingEmailConsentedAt?: InputMaybe<Scalars['DateTime']>
  tocReadAt?: InputMaybe<Scalars['DateTime']>
}

export type UpdateVatTypeInput = {
  name?: InputMaybe<Scalars['String']>
  percent?: InputMaybe<Scalars['Float']>
}

export type UpdateWebhookInput = {
  concern?: InputMaybe<Scalars['String']>
  event?: InputMaybe<Scalars['String']>
  graphqlQuery?: InputMaybe<Scalars['String']>
  headers?: InputMaybe<Array<WebhookHeaderInput>>
  method?: InputMaybe<HttpMethod>
  name?: InputMaybe<Scalars['String']>
  url?: InputMaybe<Scalars['String']>
}

export type UploadField = {
  __typename?: 'UploadField'
  name: Scalars['String']
  value: Scalars['String']
}

export type User = {
  __typename?: 'User'
  accessTokens?: Maybe<Array<AccessToken>>
  companyName?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  email?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  isAdmin: Scalars['Boolean']
  lastName?: Maybe<Scalars['String']>
  lastSeenAt?: Maybe<Scalars['DateTime']>
  marketingEmailConsentedAt?: Maybe<Scalars['DateTime']>
  preferences?: Maybe<Preferences>
  role?: Maybe<UserTenantRole>
  sub: Array<Scalars['String']>
  tenants?: Maybe<Array<UserTenantRole>>
  tocReadAt?: Maybe<Scalars['DateTime']>
}

export type UserPreferencesArgs = {
  tenantId?: InputMaybe<Scalars['ID']>
}

export type UserRoleArgs = {
  tenantId: Scalars['ID']
}

export type UserMetrics = {
  __typename?: 'UserMetrics'
  count: Scalars['Int']
}

export type UserMetricsCountArgs = {
  role?: InputMaybe<UserRoles>
}

export type UserMutations = {
  __typename?: 'UserMutations'
  addTenants: Array<UserTenantRole>
  create: User
  delete: Scalars['Int']
  generateAccessToken: AccessToken
  grantAdminRights: User
  removeTenants?: Maybe<Array<UserTenantRole>>
  revokeAdminRights: User
  update: User
}

export type UserMutationsAddTenantsArgs = {
  roles: Array<TenantRoleInput>
  userId: Scalars['ID']
}

export type UserMutationsCreateArgs = {
  input: CreateUserInput
}

export type UserMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type UserMutationsGenerateAccessTokenArgs = {
  input: CreateAccessTokenInput
  userId: Scalars['ID']
}

export type UserMutationsGrantAdminRightsArgs = {
  userId: Scalars['ID']
}

export type UserMutationsRemoveTenantsArgs = {
  tenantIds: Array<Scalars['ID']>
  userId: Scalars['ID']
}

export type UserMutationsRevokeAdminRightsArgs = {
  userId: Scalars['ID']
}

export type UserMutationsUpdateArgs = {
  id: Scalars['ID']
  input?: InputMaybe<UpdateUserInput>
}

export type UserQueries = {
  __typename?: 'UserQueries'
  dev_search?: Maybe<Array<User>>
  get?: Maybe<User>
  getMany: Array<User>
  me?: Maybe<User>
}

export type UserQueriesDev_SearchArgs = {
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
}

export type UserQueriesGetArgs = {
  id: Scalars['ID']
}

export enum UserRole {
  Custom = 'custom',
  TenantAdmin = 'tenantAdmin',
  User = 'user',
}

export type UserRoleInput = {
  role: UserRole
  userId: Scalars['ID']
}

export enum UserRoles {
  TenantAdmin = 'TenantAdmin',
  User = 'User',
}

export type UserTenantRole = {
  __typename?: 'UserTenantRole'
  role: Scalars['String']
  tenant: Tenant
  tenantId: Scalars['ID']
  user: User
  userId: Scalars['ID']
}

export type VatType = {
  __typename?: 'VatType'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  name: Scalars['String']
  percent: Scalars['Float']
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type VatTypeMutations = {
  __typename?: 'VatTypeMutations'
  create: VatType
  delete: Scalars['Int']
  update: VatType
}

export type VatTypeMutationsCreateArgs = {
  input: CreateVatTypeInput
}

export type VatTypeMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type VatTypeMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateVatTypeInput
}

export type VersionInfo = {
  __typename?: 'VersionInfo'
  apiVersion: Scalars['String']
  commitSha: Scalars['String']
}

export enum VersionLabel {
  Current = 'current',
  Draft = 'draft',
  Published = 'published',
}

export type VersionedRecordInfo = {
  __typename?: 'VersionedRecordInfo'
  createdAt: Scalars['DateTime']
  id?: Maybe<Scalars['ID']>
  label: VersionLabel
}

export type VersionedServices = {
  __typename?: 'VersionedServices'
  core: VersionInfo
  federated: Scalars['Boolean']
  metrics?: Maybe<VersionInfo>
  reporting?: Maybe<VersionInfo>
  search?: Maybe<VersionInfo>
  subscriptions?: Maybe<VersionInfo>
}

export type Video = {
  __typename?: 'Video'
  id: Scalars['String']
  playlist?: Maybe<Scalars['String']>
  playlists?: Maybe<Array<Scalars['String']>>
  thumbnails?: Maybe<Array<Image>>
  title?: Maybe<Scalars['String']>
}

export type VideoPlaylistArgs = {
  type: Scalars['String']
}

export type VideoContent = {
  __typename?: 'VideoContent'
  videos?: Maybe<Array<Video>>
}

export type VideoInput = {
  key: Scalars['String']
  thumbnails?: InputMaybe<Array<ImageInput>>
  title?: InputMaybe<Scalars['String']>
}

export type VideoMutations = {
  __typename?: 'VideoMutations'
  addPlaylists: Video
}

export type VideoMutationsAddPlaylistsArgs = {
  keys: Array<Scalars['String']>
  videoId: Scalars['String']
}

export type Webhook = {
  __typename?: 'Webhook'
  concern: Scalars['String']
  createdAt?: Maybe<Scalars['DateTime']>
  event: Scalars['String']
  graphqlQuery?: Maybe<Scalars['String']>
  headers?: Maybe<Array<WebhookHeader>>
  id: Scalars['ID']
  lastInvocation?: Maybe<WebhookInvocation>
  method: HttpMethod
  name: Scalars['String']
  pastInvocations?: Maybe<Array<WebhookInvocation>>
  tenant?: Maybe<Tenant>
  tenantId: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
  url: Scalars['String']
}

export type WebhookPastInvocationsArgs = {
  limit?: InputMaybe<Scalars['Int']>
}

export type WebhookHeader = {
  __typename?: 'WebhookHeader'
  name: Scalars['String']
  value: Scalars['String']
}

export type WebhookHeaderInput = {
  name: Scalars['String']
  value: Scalars['String']
}

export type WebhookInvocation = {
  __typename?: 'WebhookInvocation'
  end?: Maybe<Scalars['DateTime']>
  payload?: Maybe<Scalars['JSON']>
  response?: Maybe<WebhookInvocationResponse>
  start?: Maybe<Scalars['DateTime']>
}

export type WebhookInvocationResponse = {
  __typename?: 'WebhookInvocationResponse'
  body?: Maybe<Scalars['JSON']>
  status?: Maybe<Scalars['Int']>
}

export type WebhookMetrics = IObjectMetrics & {
  __typename?: 'WebhookMetrics'
  count: Scalars['Int']
}

export type WebhookMetricsCountArgs = {
  end?: InputMaybe<Scalars['DateTime']>
  start?: InputMaybe<Scalars['DateTime']>
}

export type WebhookMutations = {
  __typename?: 'WebhookMutations'
  create: Webhook
  /** @deprecated This internal use only mutation has been deprecated and will can no longer be used to register webhook invocations. */
  delete: Scalars['Int']
  registerInvocation: WebhookInvocation
  update: Webhook
}

export type WebhookMutationsCreateArgs = {
  input: CreateWebhookInput
}

export type WebhookMutationsDeleteArgs = {
  id: Scalars['ID']
}

export type WebhookMutationsRegisterInvocationArgs = {
  input?: InputMaybe<CreateWebhookInvocationInput>
  webhookId: Scalars['ID']
}

export type WebhookMutationsUpdateArgs = {
  id: Scalars['ID']
  input: UpdateWebhookInput
}

export type WebhookQueries = {
  __typename?: 'WebhookQueries'
  get?: Maybe<Webhook>
  getMany?: Maybe<Array<Webhook>>
}

export type WebhookQueriesGetArgs = {
  id: Scalars['ID']
}

export type WebhookQueriesGetManyArgs = {
  concern?: InputMaybe<Scalars['String']>
  event?: InputMaybe<Scalars['String']>
  tenantId: Scalars['ID']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping of union types */
export type ResolversUnionTypes = {
  ComponentConfig:
    | ComponentChoiceComponentConfig
    | ContentChunkComponentConfig
    | FilesComponentConfig
    | ItemRelationsComponentConfig
    | NumericComponentConfig
    | PropertiesTableComponentConfig
    | SelectionComponentConfig
  ComponentContent:
    | BooleanContent
    | ComponentChoiceContent
    | ContentChunkContent
    | DatetimeContent
    | FileContent
    | GridRelationsContent
    | ImageContent
    | ItemRelationsContent
    | LocationContent
    | NumericContent
    | ParagraphCollectionContent
    | PropertiesTableContent
    | RichTextContent
    | SelectionContent
    | SingleLineContent
    | VideoContent
  Payment:
    | CashPayment
    | CustomPayment
    | KlarnaPayment
    | PaypalPayment
    | StripePayment
}

/** Mapping of union parent types */
export type ResolversUnionParentTypes = {
  ComponentConfig:
    | ComponentChoiceComponentConfig
    | ContentChunkComponentConfig
    | FilesComponentConfig
    | ItemRelationsComponentConfig
    | NumericComponentConfig
    | PropertiesTableComponentConfig
    | SelectionComponentConfig
  ComponentContent:
    | BooleanContent
    | ComponentChoiceContent
    | ContentChunkContent
    | DatetimeContent
    | FileContent
    | GridRelationsContent
    | ImageContent
    | ItemRelationsContent
    | LocationContent
    | NumericContent
    | ParagraphCollectionContent
    | PropertiesTableContent
    | RichTextContent
    | SelectionContent
    | SingleLineContent
    | VideoContent
  Payment:
    | CashPayment
    | CustomPayment
    | KlarnaPayment
    | PaypalPayment
    | StripePayment
}

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AcceptedContentType: ResolverTypeWrapper<AcceptedContentType>
  AcceptedContentTypeInput: AcceptedContentTypeInput
  AccessToken: ResolverTypeWrapper<AccessToken>
  AccessTokenMutations: ResolverTypeWrapper<AccessTokenMutations>
  AddLanguageInput: AddLanguageInput
  Address: ResolverTypeWrapper<Address>
  AddressInput: AddressInput
  AddressType: AddressType
  ApiCallMetrics: ResolverTypeWrapper<ApiCallMetrics>
  App: ResolverTypeWrapper<App>
  AppConnection: ResolverTypeWrapper<AppConnection>
  AppConnectionEdge: ResolverTypeWrapper<AppConnectionEdge>
  AppListFilter: AppListFilter
  AppListSortOptions: AppListSortOptions
  AppMutations: ResolverTypeWrapper<AppMutations>
  AppQueries: ResolverTypeWrapper<AppQueries>
  AuthenticationMethod: AuthenticationMethod
  BandwidthUnit: BandwidthUnit
  BandwidthUsageMetrics: ResolverTypeWrapper<BandwidthUsageMetrics>
  BandwidthUsageType: BandwidthUsageType
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  BooleanContent: ResolverTypeWrapper<BooleanContent>
  BooleanContentInput: BooleanContentInput
  BulkCreateDocumentInput: BulkCreateDocumentInput
  BulkCreateFolderInput: BulkCreateFolderInput
  BulkCreateProductInput: BulkCreateProductInput
  BulkCreateShapeInput: BulkCreateShapeInput
  BulkCreateTenantInput: BulkCreateTenantInput
  BulkCreateTopicInput: BulkCreateTopicInput
  BulkCreateUserInput: BulkCreateUserInput
  BulkCreateVatTypeInput: BulkCreateVatTypeInput
  BulkTaskTenantCopyInfo: ResolverTypeWrapper<BulkTaskTenantCopyInfo>
  CashPayment: ResolverTypeWrapper<CashPayment>
  CashPaymentInput: CashPaymentInput
  Component: ResolverTypeWrapper<
    Omit<Component, 'content'> & {
      content?: Maybe<ResolversTypes['ComponentContent']>
    }
  >
  ComponentChoiceComponentConfig: ResolverTypeWrapper<ComponentChoiceComponentConfig>
  ComponentChoiceComponentConfigInput: ComponentChoiceComponentConfigInput
  ComponentChoiceContent: ResolverTypeWrapper<ComponentChoiceContent>
  ComponentConfig: ResolverTypeWrapper<ResolversUnionTypes['ComponentConfig']>
  ComponentConfigInput: ComponentConfigInput
  ComponentContent: ResolverTypeWrapper<ResolversUnionTypes['ComponentContent']>
  ComponentInput: ComponentInput
  ComponentType: ComponentType
  ContentChunkComponentConfig: ResolverTypeWrapper<ContentChunkComponentConfig>
  ContentChunkComponentConfigInput: ContentChunkComponentConfigInput
  ContentChunkContent: ResolverTypeWrapper<ContentChunkContent>
  ContentChunkContentInput: ContentChunkContentInput
  ContractSubscriptionPlanReferenceInput: ContractSubscriptionPlanReferenceInput
  CreateAccessTokenInput: CreateAccessTokenInput
  CreateAppInput: CreateAppInput
  CreateChildTopicInput: CreateChildTopicInput
  CreateCustomerAddressInput: CreateCustomerAddressInput
  CreateCustomerInput: CreateCustomerInput
  CreateDocumentInput: CreateDocumentInput
  CreateFolderInput: CreateFolderInput
  CreateGridInput: CreateGridInput
  CreateMarketInput: CreateMarketInput
  CreatePipelineInput: CreatePipelineInput
  CreatePipelineStageInput: CreatePipelineStageInput
  CreatePriceListInput: CreatePriceListInput
  CreatePriceListProductVariant: CreatePriceListProductVariant
  CreatePriceListSelectedProductVariantsInput: CreatePriceListSelectedProductVariantsInput
  CreatePriceListTargetAudienceInput: CreatePriceListTargetAudienceInput
  CreatePriceVariantInput: CreatePriceVariantInput
  CreateProductInput: CreateProductInput
  CreateProductSubscriptionAddressInput: CreateProductSubscriptionAddressInput
  CreateProductSubscriptionInput: CreateProductSubscriptionInput
  CreateProductSubscriptionItemInput: CreateProductSubscriptionItemInput
  CreateProductSubscriptionMeteredVariableInput: CreateProductSubscriptionMeteredVariableInput
  CreateProductSubscriptionMeteredVariableTierInput: CreateProductSubscriptionMeteredVariableTierInput
  CreateProductSubscriptionPhaseInput: CreateProductSubscriptionPhaseInput
  CreateProductSubscriptionStatusInput: CreateProductSubscriptionStatusInput
  CreateProductVariantInput: CreateProductVariantInput
  CreateShapeInput: CreateShapeInput
  CreateStockLocationInput: CreateStockLocationInput
  CreateSubscriptionContractAddressInput: CreateSubscriptionContractAddressInput
  CreateSubscriptionContractInput: CreateSubscriptionContractInput
  CreateSubscriptionContractItemInput: CreateSubscriptionContractItemInput
  CreateSubscriptionContractMeteredVariableReferenceInput: CreateSubscriptionContractMeteredVariableReferenceInput
  CreateSubscriptionContractMeteredVariableTierInput: CreateSubscriptionContractMeteredVariableTierInput
  CreateSubscriptionContractPhaseInput: CreateSubscriptionContractPhaseInput
  CreateSubscriptionContractStatusInput: CreateSubscriptionContractStatusInput
  CreateSubscriptionPlanInput: CreateSubscriptionPlanInput
  CreateTenantInput: CreateTenantInput
  CreateTopicInput: CreateTopicInput
  CreateUserInput: CreateUserInput
  CreateVatTypeInput: CreateVatTypeInput
  CreateWebhookInput: CreateWebhookInput
  CreateWebhookInvocationInput: CreateWebhookInvocationInput
  CurrencySummary: ResolverTypeWrapper<CurrencySummary>
  CurrencySummaryReport: ResolverTypeWrapper<CurrencySummaryReport>
  CustomPayment: ResolverTypeWrapper<CustomPayment>
  CustomPaymentInput: CustomPaymentInput
  CustomProperties: ResolverTypeWrapper<CustomProperties>
  CustomPropertiesInput: CustomPropertiesInput
  Customer: ResolverTypeWrapper<Customer>
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>
  CustomerConnectionEdge: ResolverTypeWrapper<CustomerConnectionEdge>
  CustomerExternalReferenceInput: CustomerExternalReferenceInput
  CustomerInput: CustomerInput
  CustomerMutations: ResolverTypeWrapper<CustomerMutations>
  CustomerQueries: ResolverTypeWrapper<CustomerQueries>
  Date: ResolverTypeWrapper<Scalars['Date']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  DatetimeContent: ResolverTypeWrapper<DatetimeContent>
  DatetimeContentInput: DatetimeContentInput
  DigitalAssetManagementPreferencesInput: DigitalAssetManagementPreferencesInput
  DigitalAssetPreferences: ResolverTypeWrapper<DigitalAssetPreferences>
  Discount: ResolverTypeWrapper<Discount>
  DiscountInput: DiscountInput
  Document: ResolverTypeWrapper<Document>
  DocumentMutations: ResolverTypeWrapper<DocumentMutations>
  DocumentQueries: ResolverTypeWrapper<DocumentQueries>
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>
  ExperimentalPreferenceEnabled: ResolverTypeWrapper<ExperimentalPreferenceEnabled>
  ExperimentalPreferenceEnabledInput: ExperimentalPreferenceEnabledInput
  ExperimentalPreferences: ResolverTypeWrapper<ExperimentalPreferences>
  ExperimentalPreferencesInput: ExperimentalPreferencesInput
  File: ResolverTypeWrapper<File>
  FileContent: ResolverTypeWrapper<FileContent>
  FileContentInput: FileContentInput
  FileInput: FileInput
  FileQueries: ResolverTypeWrapper<FileQueries>
  FileSize: ResolverTypeWrapper<FileSize>
  FileSizeUnit: FileSizeUnit
  FileUploadMutations: ResolverTypeWrapper<FileUploadMutations>
  FileUploadType: FileUploadType
  FilesComponentConfig: ResolverTypeWrapper<FilesComponentConfig>
  FilesComponentConfigInput: FilesComponentConfigInput
  Float: ResolverTypeWrapper<Scalars['Float']>
  FocalPoint: ResolverTypeWrapper<FocalPoint>
  FocalPointInput: FocalPointInput
  Folder: ResolverTypeWrapper<Folder>
  FolderMutations: ResolverTypeWrapper<FolderMutations>
  FolderQueries: ResolverTypeWrapper<FolderQueries>
  FullTreeNodeInput: FullTreeNodeInput
  GenericPublishInput: GenericPublishInput
  GenericSuggestSearchResult: ResolverTypeWrapper<GenericSuggestSearchResult>
  GetTopicByPathArguments: GetTopicByPathArguments
  Grid: ResolverTypeWrapper<Grid>
  GridColumn: ResolverTypeWrapper<GridColumn>
  GridColumnInput: GridColumnInput
  GridColumnLayout: ResolverTypeWrapper<GridColumnLayout>
  GridLayoutInput: GridLayoutInput
  GridMutations: ResolverTypeWrapper<GridMutations>
  GridPublishInfo: ResolverTypeWrapper<GridPublishInfo>
  GridQueries: ResolverTypeWrapper<GridQueries>
  GridRelationsContent: ResolverTypeWrapper<GridRelationsContent>
  GridRelationsContentInput: GridRelationsContentInput
  GridRow: ResolverTypeWrapper<GridRow>
  GridRowInput: GridRowInput
  HttpMethod: HttpMethod
  ID: ResolverTypeWrapper<Scalars['ID']>
  IObjectMetrics:
    | ResolversTypes['ApiCallMetrics']
    | ResolversTypes['ItemMetrics']
    | ResolversTypes['OrderMetrics']
    | ResolversTypes['ShapeMetrics']
    | ResolversTypes['WebhookMetrics']
  IObjectReports: ResolversTypes['SalesReport']
  IdentifierSuggestion: ResolverTypeWrapper<IdentifierSuggestion>
  Image: ResolverTypeWrapper<Image>
  ImageConnection: ResolverTypeWrapper<ImageConnection>
  ImageConnectionEdge: ResolverTypeWrapper<ImageConnectionEdge>
  ImageContent: ResolverTypeWrapper<ImageContent>
  ImageFilterInput: ImageFilterInput
  ImageInput: ImageInput
  ImageMutations: ResolverTypeWrapper<ImageMutations>
  ImageQueries: ResolverTypeWrapper<ImageQueries>
  ImageSortField: ImageSortField
  ImageVariant: ResolverTypeWrapper<ImageVariant>
  ImageVariantInput: ImageVariantInput
  Int: ResolverTypeWrapper<Scalars['Int']>
  Interval: Interval
  InviteToken: ResolverTypeWrapper<InviteToken>
  InviteTokenMutations: ResolverTypeWrapper<InviteTokenMutations>
  Item:
    | ResolversTypes['Document']
    | ResolversTypes['Folder']
    | ResolversTypes['Product']
  ItemConnection: ResolverTypeWrapper<ItemConnection>
  ItemConnectionEdge: ResolverTypeWrapper<ItemConnectionEdge>
  ItemMetrics: ResolverTypeWrapper<ItemMetrics>
  ItemMutations: ResolverTypeWrapper<ItemMutations>
  ItemQueries: ResolverTypeWrapper<ItemQueries>
  ItemRelationsComponentConfig: ResolverTypeWrapper<ItemRelationsComponentConfig>
  ItemRelationsComponentConfigInput: ItemRelationsComponentConfigInput
  ItemRelationsComponentQuickSelectConfig: ResolverTypeWrapper<ItemRelationsComponentQuickSelectConfig>
  ItemRelationsComponentQuickSelectConfigInput: ItemRelationsComponentQuickSelectConfigInput
  ItemRelationsComponentQuickSelectFolderConfig: ResolverTypeWrapper<ItemRelationsComponentQuickSelectFolderConfig>
  ItemRelationsComponentQuickSelectFolderConfigInput: ItemRelationsComponentQuickSelectFolderConfigInput
  ItemRelationsContent: ResolverTypeWrapper<ItemRelationsContent>
  ItemRelationsContentInput: ItemRelationsContentInput
  ItemSortField: ItemSortField
  ItemSuggestSearchResult: ResolverTypeWrapper<ItemSuggestSearchResult>
  ItemType: ItemType
  JSON: ResolverTypeWrapper<Scalars['JSON']>
  KeyValuePair: ResolverTypeWrapper<KeyValuePair>
  KeyValuePairInput: KeyValuePairInput
  KlarnaPayment: ResolverTypeWrapper<KlarnaPayment>
  KlarnaPaymentInput: KlarnaPaymentInput
  Language: ResolverTypeWrapper<Language>
  LanguageMutations: ResolverTypeWrapper<LanguageMutations>
  LocationContent: ResolverTypeWrapper<LocationContent>
  LocationContentInput: LocationContentInput
  Market: ResolverTypeWrapper<Market>
  MarketConnection: ResolverTypeWrapper<MarketConnection>
  MarketConnectionEdge: ResolverTypeWrapper<MarketConnectionEdge>
  MarketMutations: ResolverTypeWrapper<MarketMutations>
  MarketQueries: ResolverTypeWrapper<MarketQueries>
  MaxFileSizeInput: MaxFileSizeInput
  MeMutations: ResolverTypeWrapper<MeMutations>
  Mutation: ResolverTypeWrapper<{}>
  NerdyViewPreferences: ResolverTypeWrapper<NerdyViewPreferences>
  NerdyViewPreferencesInput: NerdyViewPreferencesInput
  NonNegativeFloat: ResolverTypeWrapper<Scalars['NonNegativeFloat']>
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']>
  NumericComponentConfig: ResolverTypeWrapper<NumericComponentConfig>
  NumericComponentConfigInput: NumericComponentConfigInput
  NumericComponentContentInput: NumericComponentContentInput
  NumericContent: ResolverTypeWrapper<NumericContent>
  Operation: Operation
  Order: ResolverTypeWrapper<
    Omit<Order, 'payment'> & {
      payment?: Maybe<Array<ResolversTypes['Payment']>>
    }
  >
  OrderConnection: ResolverTypeWrapper<OrderConnection>
  OrderConnectionEdge: ResolverTypeWrapper<OrderConnectionEdge>
  OrderItem: ResolverTypeWrapper<OrderItem>
  OrderItemInput: OrderItemInput
  OrderItemMeteredVariable: ResolverTypeWrapper<OrderItemMeteredVariable>
  OrderItemSubscription: ResolverTypeWrapper<OrderItemSubscription>
  OrderItemSubscriptionPeriodUnit: OrderItemSubscriptionPeriodUnit
  OrderMetrics: ResolverTypeWrapper<OrderMetrics>
  OrderMutations: ResolverTypeWrapper<OrderMutations>
  OrderPipeline: ResolverTypeWrapper<OrderPipeline>
  OrderQueries: ResolverTypeWrapper<OrderQueries>
  OrderSortField: OrderSortField
  OrdersReport: ResolverTypeWrapper<OrdersReport>
  PageInfo: ResolverTypeWrapper<PageInfo>
  ParagraphCollectionContent: ResolverTypeWrapper<ParagraphCollectionContent>
  ParagraphCollectionContentInput: ParagraphCollectionContentInput
  ParagraphContent: ResolverTypeWrapper<ParagraphContent>
  ParagraphContentInput: ParagraphContentInput
  Parameter: Parameter
  Payment: ResolverTypeWrapper<ResolversUnionTypes['Payment']>
  PaymentInput: PaymentInput
  PaymentProvider: PaymentProvider
  PaymentType:
    | ResolversTypes['CashPayment']
    | ResolversTypes['CustomPayment']
    | ResolversTypes['KlarnaPayment']
    | ResolversTypes['PaypalPayment']
    | ResolversTypes['StripePayment']
  PaypalPayment: ResolverTypeWrapper<PaypalPayment>
  PaypalPaymentInput: PaypalPaymentInput
  PhoneNumber: ResolverTypeWrapper<Scalars['PhoneNumber']>
  Pipeline: ResolverTypeWrapper<Pipeline>
  PipelineConnection: ResolverTypeWrapper<PipelineConnection>
  PipelineConnectionEdge: ResolverTypeWrapper<PipelineConnectionEdge>
  PipelineMutations: ResolverTypeWrapper<PipelineMutations>
  PipelineQueries: ResolverTypeWrapper<PipelineQueries>
  PipelineSortField: PipelineSortField
  PipelineStage: ResolverTypeWrapper<PipelineStage>
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>
  Preference: ResolverTypeWrapper<Preference>
  PreferenceInput: PreferenceInput
  Preferences: ResolverTypeWrapper<Preferences>
  PreferencesInput: PreferencesInput
  PresignedUploadRequest: ResolverTypeWrapper<PresignedUploadRequest>
  Price: ResolverTypeWrapper<Price>
  PriceInput: PriceInput
  PriceList: ResolverTypeWrapper<PriceList>
  PriceListConnection: ResolverTypeWrapper<PriceListConnection>
  PriceListConnectionEdge: ResolverTypeWrapper<PriceListConnectionEdge>
  PriceListModifierType: PriceListModifierType
  PriceListMutations: ResolverTypeWrapper<PriceListMutations>
  PriceListPriceVariant: ResolverTypeWrapper<PriceListPriceVariant>
  PriceListPriceVariantReferenceInput: PriceListPriceVariantReferenceInput
  PriceListProduct: ResolverTypeWrapper<PriceListProduct>
  PriceListProductPriceVariantReference: PriceListProductPriceVariantReference
  PriceListProductSelectionType: PriceListProductSelectionType
  PriceListQueries: ResolverTypeWrapper<PriceListQueries>
  PriceListSelectedProductVariants: ResolverTypeWrapper<PriceListSelectedProductVariants>
  PriceListTargetAudience: ResolverTypeWrapper<PriceListTargetAudience>
  PriceListTargetAudienceType: PriceListTargetAudienceType
  PriceVariant: ResolverTypeWrapper<PriceVariant>
  PriceVariantMutations: ResolverTypeWrapper<PriceVariantMutations>
  PriceVariantQueries: ResolverTypeWrapper<PriceVariantQueries>
  PriceVariantReferenceInput: PriceVariantReferenceInput
  Product: ResolverTypeWrapper<Product>
  ProductMutations: ResolverTypeWrapper<ProductMutations>
  ProductPriceVariant: ResolverTypeWrapper<ProductPriceVariant>
  ProductQueries: ResolverTypeWrapper<ProductQueries>
  ProductStockLocation: ResolverTypeWrapper<ProductStockLocation>
  ProductSubscription: ResolverTypeWrapper<
    Omit<ProductSubscription, 'payment'> & {
      payment?: Maybe<ResolversTypes['Payment']>
    }
  >
  ProductSubscriptionConnection: ResolverTypeWrapper<ProductSubscriptionConnection>
  ProductSubscriptionConnectionEdge: ResolverTypeWrapper<ProductSubscriptionConnectionEdge>
  ProductSubscriptionHistoryEvent:
    | ResolversTypes['ProductSubscriptionHistoryEventCancellation']
    | ResolversTypes['ProductSubscriptionHistoryEventRenewal']
    | ResolversTypes['ProductSubscriptionHistoryEventRenewalDueBroadcast']
  ProductSubscriptionHistoryEventCancellation: ResolverTypeWrapper<ProductSubscriptionHistoryEventCancellation>
  ProductSubscriptionHistoryEventRenewal: ResolverTypeWrapper<ProductSubscriptionHistoryEventRenewal>
  ProductSubscriptionHistoryEventRenewalDueBroadcast: ResolverTypeWrapper<ProductSubscriptionHistoryEventRenewalDueBroadcast>
  ProductSubscriptionHistoryEventType: ProductSubscriptionHistoryEventType
  ProductSubscriptionItem: ResolverTypeWrapper<ProductSubscriptionItem>
  ProductSubscriptionMutations: ResolverTypeWrapper<ProductSubscriptionMutations>
  ProductSubscriptionPhase: ResolverTypeWrapper<ProductSubscriptionPhase>
  ProductSubscriptionPlanReferenceInput: ProductSubscriptionPlanReferenceInput
  ProductSubscriptionQueries: ResolverTypeWrapper<ProductSubscriptionQueries>
  ProductSubscriptionSortField: ProductSubscriptionSortField
  ProductSubscriptionStatus: ResolverTypeWrapper<ProductSubscriptionStatus>
  ProductSubscriptionUsage: ResolverTypeWrapper<ProductSubscriptionUsage>
  ProductVariant: ResolverTypeWrapper<ProductVariant>
  ProductVariantAttribute: ResolverTypeWrapper<ProductVariantAttribute>
  ProductVariantAttributeInput: ProductVariantAttributeInput
  ProductVariantConnection: ResolverTypeWrapper<ProductVariantConnection>
  ProductVariantConnectionEdge: ResolverTypeWrapper<ProductVariantConnectionEdge>
  ProductVariantPriceList: ResolverTypeWrapper<ProductVariantPriceList>
  ProductVariantSubscriptionMeteredVariable: ResolverTypeWrapper<ProductVariantSubscriptionMeteredVariable>
  ProductVariantSubscriptionPlan: ResolverTypeWrapper<ProductVariantSubscriptionPlan>
  ProductVariantSubscriptionPlanPeriod: ResolverTypeWrapper<ProductVariantSubscriptionPlanPeriod>
  ProductVariantSubscriptionPlanPricing: ResolverTypeWrapper<ProductVariantSubscriptionPlanPricing>
  ProductVariantSubscriptionPlanTier: ResolverTypeWrapper<ProductVariantSubscriptionPlanTier>
  PropertiesTableComponentConfig: ResolverTypeWrapper<PropertiesTableComponentConfig>
  PropertiesTableComponentConfigInput: PropertiesTableComponentConfigInput
  PropertiesTableComponentConfigSection: ResolverTypeWrapper<PropertiesTableComponentConfigSection>
  PropertiesTableComponentConfigSectionInput: PropertiesTableComponentConfigSectionInput
  PropertiesTableComponentSection: ResolverTypeWrapper<PropertiesTableComponentSection>
  PropertiesTableComponentSectionInput: PropertiesTableComponentSectionInput
  PropertiesTableContent: ResolverTypeWrapper<PropertiesTableContent>
  PropertiesTableContentInput: PropertiesTableContentInput
  PublishInfo: ResolverTypeWrapper<PublishInfo>
  Query: ResolverTypeWrapper<{}>
  RegenerateSecretsInput: RegenerateSecretsInput
  ReportMetric: ResolverTypeWrapper<ReportMetric>
  RichTextContent: ResolverTypeWrapper<RichTextContent>
  RichTextContentInput: RichTextContentInput
  SalesReport: ResolverTypeWrapper<SalesReport>
  SearchQueries: ResolverTypeWrapper<SearchQueries>
  SelectionComponentConfig: ResolverTypeWrapper<SelectionComponentConfig>
  SelectionComponentConfigInput: SelectionComponentConfigInput
  SelectionComponentContentInput: SelectionComponentContentInput
  SelectionComponentOptionConfig: ResolverTypeWrapper<SelectionComponentOptionConfig>
  SelectionComponentOptionConfigInput: SelectionComponentOptionConfigInput
  SelectionContent: ResolverTypeWrapper<SelectionContent>
  Shape: ResolverTypeWrapper<Shape>
  ShapeComponent: ResolverTypeWrapper<
    Omit<ShapeComponent, 'config'> & {
      config?: Maybe<ResolversTypes['ComponentConfig']>
    }
  >
  ShapeComponentInput: ShapeComponentInput
  ShapeMetrics: ResolverTypeWrapper<ShapeMetrics>
  ShapeMutations: ResolverTypeWrapper<ShapeMutations>
  ShapeQueries: ResolverTypeWrapper<ShapeQueries>
  ShapeType: ShapeType
  SingleLineContent: ResolverTypeWrapper<SingleLineContent>
  SingleLineContentInput: SingleLineContentInput
  SortDirection: SortDirection
  StockLocation: ResolverTypeWrapper<StockLocation>
  StockLocationMutations: ResolverTypeWrapper<StockLocationMutations>
  StockLocationQueries: ResolverTypeWrapper<StockLocationQueries>
  StockLocationReferenceInput: StockLocationReferenceInput
  StockLocationSettings: ResolverTypeWrapper<StockLocationSettings>
  StockLocationSettingsInput: StockLocationSettingsInput
  String: ResolverTypeWrapper<Scalars['String']>
  StripePayment: ResolverTypeWrapper<StripePayment>
  StripePaymentInput: StripePaymentInput
  SubscriptionContract: ResolverTypeWrapper<
    Omit<SubscriptionContract, 'payment'> & {
      payment?: Maybe<ResolversTypes['Payment']>
    }
  >
  SubscriptionContractAddress: ResolverTypeWrapper<SubscriptionContractAddress>
  SubscriptionContractCancelledEvent: ResolverTypeWrapper<SubscriptionContractCancelledEvent>
  SubscriptionContractConnection: ResolverTypeWrapper<SubscriptionContractConnection>
  SubscriptionContractConnectionEdge: ResolverTypeWrapper<SubscriptionContractConnectionEdge>
  SubscriptionContractEvent:
    | ResolversTypes['SubscriptionContractCancelledEvent']
    | ResolversTypes['SubscriptionContractRenewalDueBroadcastEvent']
    | ResolversTypes['SubscriptionContractRenewedEvent']
    | ResolversTypes['SubscriptionContractUsageTrackedEvent']
  SubscriptionContractEventConnection: ResolverTypeWrapper<SubscriptionContractEventConnection>
  SubscriptionContractEventConnectionEdge: ResolverTypeWrapper<SubscriptionContractEventConnectionEdge>
  SubscriptionContractEventQueries: ResolverTypeWrapper<SubscriptionContractEventQueries>
  SubscriptionContractEventSortField: SubscriptionContractEventSortField
  SubscriptionContractEventType: SubscriptionContractEventType
  SubscriptionContractItem: ResolverTypeWrapper<SubscriptionContractItem>
  SubscriptionContractMeteredVariableReference: ResolverTypeWrapper<SubscriptionContractMeteredVariableReference>
  SubscriptionContractMeteredVariableTierReference: ResolverTypeWrapper<SubscriptionContractMeteredVariableTierReference>
  SubscriptionContractMutations: ResolverTypeWrapper<SubscriptionContractMutations>
  SubscriptionContractPhase: ResolverTypeWrapper<SubscriptionContractPhase>
  SubscriptionContractQueries: ResolverTypeWrapper<SubscriptionContractQueries>
  SubscriptionContractRenewalDueBroadcastEvent: ResolverTypeWrapper<SubscriptionContractRenewalDueBroadcastEvent>
  SubscriptionContractRenewalDueBroadcastEventData: ResolverTypeWrapper<SubscriptionContractRenewalDueBroadcastEventData>
  SubscriptionContractRenewedEvent: ResolverTypeWrapper<SubscriptionContractRenewedEvent>
  SubscriptionContractSortField: SubscriptionContractSortField
  SubscriptionContractStatus: ResolverTypeWrapper<SubscriptionContractStatus>
  SubscriptionContractUsage: ResolverTypeWrapper<SubscriptionContractUsage>
  SubscriptionContractUsageTrackedData: ResolverTypeWrapper<SubscriptionContractUsageTrackedData>
  SubscriptionContractUsageTrackedEvent: ResolverTypeWrapper<SubscriptionContractUsageTrackedEvent>
  SubscriptionPeriodUnit: SubscriptionPeriodUnit
  SubscriptionPlan: ResolverTypeWrapper<SubscriptionPlan>
  SubscriptionPlanMeteredVariable: ResolverTypeWrapper<SubscriptionPlanMeteredVariable>
  SubscriptionPlanMeteredVariableInput: SubscriptionPlanMeteredVariableInput
  SubscriptionPlanMeteredVariableReferenceInput: SubscriptionPlanMeteredVariableReferenceInput
  SubscriptionPlanMeteredVariableTierReferenceInput: SubscriptionPlanMeteredVariableTierReferenceInput
  SubscriptionPlanMutations: ResolverTypeWrapper<SubscriptionPlanMutations>
  SubscriptionPlanPeriod: ResolverTypeWrapper<SubscriptionPlanPeriod>
  SubscriptionPlanPeriodInput: SubscriptionPlanPeriodInput
  SubscriptionPlanPeriodReferenceInput: SubscriptionPlanPeriodReferenceInput
  SubscriptionPlanPhase: ResolverTypeWrapper<SubscriptionPlanPhase>
  SubscriptionPlanPhaseInput: SubscriptionPlanPhaseInput
  SubscriptionPlanPriceInput: SubscriptionPlanPriceInput
  SubscriptionPlanQueries: ResolverTypeWrapper<SubscriptionPlanQueries>
  SubscriptionPlanReferenceInput: SubscriptionPlanReferenceInput
  SuggestSearchAggregations: ResolverTypeWrapper<SuggestSearchAggregations>
  SuggestSearchConnection: ResolverTypeWrapper<SuggestSearchConnection>
  SuggestSearchConnectionEdge: ResolverTypeWrapper<SuggestSearchConnectionEdge>
  SuggestSearchItemType: SuggestSearchItemType
  SuggestSearchResult:
    | ResolversTypes['GenericSuggestSearchResult']
    | ResolversTypes['ItemSuggestSearchResult']
  SuggestSearchTypesAggregation: ResolverTypeWrapper<SuggestSearchTypesAggregation>
  Tax: ResolverTypeWrapper<Tax>
  TaxInput: TaxInput
  Tenant: ResolverTypeWrapper<Tenant>
  TenantAuthenticationMethod: ResolverTypeWrapper<TenantAuthenticationMethod>
  TenantAuthenticationMethodInput: TenantAuthenticationMethodInput
  TenantCopyExcludeableTypes: TenantCopyExcludeableTypes
  TenantDefaults: ResolverTypeWrapper<TenantDefaults>
  TenantDefaultsInput: TenantDefaultsInput
  TenantFrontend: ResolverTypeWrapper<TenantFrontend>
  TenantFrontendAuthentication: ResolverTypeWrapper<TenantFrontendAuthentication>
  TenantFrontendAuthenticationInput: TenantFrontendAuthenticationInput
  TenantFrontendInput: TenantFrontendInput
  TenantMetrics: ResolverTypeWrapper<TenantMetrics>
  TenantMutations: ResolverTypeWrapper<TenantMutations>
  TenantPreferences: ResolverTypeWrapper<TenantPreferences>
  TenantPreferencesInput: TenantPreferencesInput
  TenantQueries: ResolverTypeWrapper<TenantQueries>
  TenantReports: ResolverTypeWrapper<TenantReports>
  TenantRoleInput: TenantRoleInput
  TierType: TierType
  Topic: ResolverTypeWrapper<Topic>
  TopicConnection: ResolverTypeWrapper<TopicConnection>
  TopicConnectionEdge: ResolverTypeWrapper<TopicConnectionEdge>
  TopicImagesModified: ResolverTypeWrapper<TopicImagesModified>
  TopicItemsModified: ResolverTypeWrapper<TopicItemsModified>
  TopicMutations: ResolverTypeWrapper<TopicMutations>
  TopicQueries: ResolverTypeWrapper<TopicQueries>
  TopicSearchAggregations: ResolverTypeWrapper<TopicSearchAggregations>
  TopicSearchConnection: ResolverTypeWrapper<TopicSearchConnection>
  TopicSearchConnectionEdge: ResolverTypeWrapper<TopicSearchConnectionEdge>
  TopicSearchResult: ResolverTypeWrapper<TopicSearchResult>
  TrackUsageInput: TrackUsageInput
  TreeMutations: ResolverTypeWrapper<TreeMutations>
  TreeNode: ResolverTypeWrapper<TreeNode>
  TreeNodeIdentifier: ResolverTypeWrapper<TreeNodeIdentifier>
  TreeNodeIdentifierInput: TreeNodeIdentifierInput
  TreeNodeInput: TreeNodeInput
  TreeQueries: ResolverTypeWrapper<TreeQueries>
  UpdateAppInput: UpdateAppInput
  UpdateCustomerAddressInput: UpdateCustomerAddressInput
  UpdateCustomerInput: UpdateCustomerInput
  UpdateDocumentInput: UpdateDocumentInput
  UpdateFolderInput: UpdateFolderInput
  UpdateGridInput: UpdateGridInput
  UpdateImageInput: UpdateImageInput
  UpdateLanguageInput: UpdateLanguageInput
  UpdateMarketInput: UpdateMarketInput
  UpdateOrderInput: UpdateOrderInput
  UpdatePipelineInput: UpdatePipelineInput
  UpdatePipelineStageInput: UpdatePipelineStageInput
  UpdatePriceListInput: UpdatePriceListInput
  UpdatePriceVariantInput: UpdatePriceVariantInput
  UpdateProductInput: UpdateProductInput
  UpdateProductSubscriptionInput: UpdateProductSubscriptionInput
  UpdateProductSubscriptionItemInput: UpdateProductSubscriptionItemInput
  UpdateProductSubscriptionPhaseInput: UpdateProductSubscriptionPhaseInput
  UpdateProductSubscriptionStatusInput: UpdateProductSubscriptionStatusInput
  UpdateProductVariantInput: UpdateProductVariantInput
  UpdateShapeInput: UpdateShapeInput
  UpdateSingleProductVariantInput: UpdateSingleProductVariantInput
  UpdateStockLocationInput: UpdateStockLocationInput
  UpdateSubscriptionContractInput: UpdateSubscriptionContractInput
  UpdateSubscriptionContractItemInput: UpdateSubscriptionContractItemInput
  UpdateSubscriptionContractPhaseInput: UpdateSubscriptionContractPhaseInput
  UpdateSubscriptionContractStatusInput: UpdateSubscriptionContractStatusInput
  UpdateSubscriptionPlanInput: UpdateSubscriptionPlanInput
  UpdateTenantInput: UpdateTenantInput
  UpdateTopicInput: UpdateTopicInput
  UpdateUserInput: UpdateUserInput
  UpdateVatTypeInput: UpdateVatTypeInput
  UpdateWebhookInput: UpdateWebhookInput
  UploadField: ResolverTypeWrapper<UploadField>
  User: ResolverTypeWrapper<User>
  UserMetrics: ResolverTypeWrapper<UserMetrics>
  UserMutations: ResolverTypeWrapper<UserMutations>
  UserQueries: ResolverTypeWrapper<UserQueries>
  UserRole: UserRole
  UserRoleInput: UserRoleInput
  UserRoles: UserRoles
  UserTenantRole: ResolverTypeWrapper<UserTenantRole>
  VatType: ResolverTypeWrapper<VatType>
  VatTypeMutations: ResolverTypeWrapper<VatTypeMutations>
  VersionInfo: ResolverTypeWrapper<VersionInfo>
  VersionLabel: VersionLabel
  VersionedRecordInfo: ResolverTypeWrapper<VersionedRecordInfo>
  VersionedServices: ResolverTypeWrapper<VersionedServices>
  Video: ResolverTypeWrapper<Video>
  VideoContent: ResolverTypeWrapper<VideoContent>
  VideoInput: VideoInput
  VideoMutations: ResolverTypeWrapper<VideoMutations>
  Webhook: ResolverTypeWrapper<Webhook>
  WebhookHeader: ResolverTypeWrapper<WebhookHeader>
  WebhookHeaderInput: WebhookHeaderInput
  WebhookInvocation: ResolverTypeWrapper<WebhookInvocation>
  WebhookInvocationResponse: ResolverTypeWrapper<WebhookInvocationResponse>
  WebhookMetrics: ResolverTypeWrapper<WebhookMetrics>
  WebhookMutations: ResolverTypeWrapper<WebhookMutations>
  WebhookQueries: ResolverTypeWrapper<WebhookQueries>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AcceptedContentType: AcceptedContentType
  AcceptedContentTypeInput: AcceptedContentTypeInput
  AccessToken: AccessToken
  AccessTokenMutations: AccessTokenMutations
  AddLanguageInput: AddLanguageInput
  Address: Address
  AddressInput: AddressInput
  ApiCallMetrics: ApiCallMetrics
  App: App
  AppConnection: AppConnection
  AppConnectionEdge: AppConnectionEdge
  AppListFilter: AppListFilter
  AppListSortOptions: AppListSortOptions
  AppMutations: AppMutations
  AppQueries: AppQueries
  BandwidthUsageMetrics: BandwidthUsageMetrics
  Boolean: Scalars['Boolean']
  BooleanContent: BooleanContent
  BooleanContentInput: BooleanContentInput
  BulkCreateDocumentInput: BulkCreateDocumentInput
  BulkCreateFolderInput: BulkCreateFolderInput
  BulkCreateProductInput: BulkCreateProductInput
  BulkCreateShapeInput: BulkCreateShapeInput
  BulkCreateTenantInput: BulkCreateTenantInput
  BulkCreateTopicInput: BulkCreateTopicInput
  BulkCreateUserInput: BulkCreateUserInput
  BulkCreateVatTypeInput: BulkCreateVatTypeInput
  BulkTaskTenantCopyInfo: BulkTaskTenantCopyInfo
  CashPayment: CashPayment
  CashPaymentInput: CashPaymentInput
  Component: Omit<Component, 'content'> & {
    content?: Maybe<ResolversParentTypes['ComponentContent']>
  }
  ComponentChoiceComponentConfig: ComponentChoiceComponentConfig
  ComponentChoiceComponentConfigInput: ComponentChoiceComponentConfigInput
  ComponentChoiceContent: ComponentChoiceContent
  ComponentConfig: ResolversUnionParentTypes['ComponentConfig']
  ComponentConfigInput: ComponentConfigInput
  ComponentContent: ResolversUnionParentTypes['ComponentContent']
  ComponentInput: ComponentInput
  ContentChunkComponentConfig: ContentChunkComponentConfig
  ContentChunkComponentConfigInput: ContentChunkComponentConfigInput
  ContentChunkContent: ContentChunkContent
  ContentChunkContentInput: ContentChunkContentInput
  ContractSubscriptionPlanReferenceInput: ContractSubscriptionPlanReferenceInput
  CreateAccessTokenInput: CreateAccessTokenInput
  CreateAppInput: CreateAppInput
  CreateChildTopicInput: CreateChildTopicInput
  CreateCustomerAddressInput: CreateCustomerAddressInput
  CreateCustomerInput: CreateCustomerInput
  CreateDocumentInput: CreateDocumentInput
  CreateFolderInput: CreateFolderInput
  CreateGridInput: CreateGridInput
  CreateMarketInput: CreateMarketInput
  CreatePipelineInput: CreatePipelineInput
  CreatePipelineStageInput: CreatePipelineStageInput
  CreatePriceListInput: CreatePriceListInput
  CreatePriceListProductVariant: CreatePriceListProductVariant
  CreatePriceListSelectedProductVariantsInput: CreatePriceListSelectedProductVariantsInput
  CreatePriceListTargetAudienceInput: CreatePriceListTargetAudienceInput
  CreatePriceVariantInput: CreatePriceVariantInput
  CreateProductInput: CreateProductInput
  CreateProductSubscriptionAddressInput: CreateProductSubscriptionAddressInput
  CreateProductSubscriptionInput: CreateProductSubscriptionInput
  CreateProductSubscriptionItemInput: CreateProductSubscriptionItemInput
  CreateProductSubscriptionMeteredVariableInput: CreateProductSubscriptionMeteredVariableInput
  CreateProductSubscriptionMeteredVariableTierInput: CreateProductSubscriptionMeteredVariableTierInput
  CreateProductSubscriptionPhaseInput: CreateProductSubscriptionPhaseInput
  CreateProductSubscriptionStatusInput: CreateProductSubscriptionStatusInput
  CreateProductVariantInput: CreateProductVariantInput
  CreateShapeInput: CreateShapeInput
  CreateStockLocationInput: CreateStockLocationInput
  CreateSubscriptionContractAddressInput: CreateSubscriptionContractAddressInput
  CreateSubscriptionContractInput: CreateSubscriptionContractInput
  CreateSubscriptionContractItemInput: CreateSubscriptionContractItemInput
  CreateSubscriptionContractMeteredVariableReferenceInput: CreateSubscriptionContractMeteredVariableReferenceInput
  CreateSubscriptionContractMeteredVariableTierInput: CreateSubscriptionContractMeteredVariableTierInput
  CreateSubscriptionContractPhaseInput: CreateSubscriptionContractPhaseInput
  CreateSubscriptionContractStatusInput: CreateSubscriptionContractStatusInput
  CreateSubscriptionPlanInput: CreateSubscriptionPlanInput
  CreateTenantInput: CreateTenantInput
  CreateTopicInput: CreateTopicInput
  CreateUserInput: CreateUserInput
  CreateVatTypeInput: CreateVatTypeInput
  CreateWebhookInput: CreateWebhookInput
  CreateWebhookInvocationInput: CreateWebhookInvocationInput
  CurrencySummary: CurrencySummary
  CurrencySummaryReport: CurrencySummaryReport
  CustomPayment: CustomPayment
  CustomPaymentInput: CustomPaymentInput
  CustomProperties: CustomProperties
  CustomPropertiesInput: CustomPropertiesInput
  Customer: Customer
  CustomerConnection: CustomerConnection
  CustomerConnectionEdge: CustomerConnectionEdge
  CustomerExternalReferenceInput: CustomerExternalReferenceInput
  CustomerInput: CustomerInput
  CustomerMutations: CustomerMutations
  CustomerQueries: CustomerQueries
  Date: Scalars['Date']
  DateTime: Scalars['DateTime']
  DatetimeContent: DatetimeContent
  DatetimeContentInput: DatetimeContentInput
  DigitalAssetManagementPreferencesInput: DigitalAssetManagementPreferencesInput
  DigitalAssetPreferences: DigitalAssetPreferences
  Discount: Discount
  DiscountInput: DiscountInput
  Document: Document
  DocumentMutations: DocumentMutations
  DocumentQueries: DocumentQueries
  EmailAddress: Scalars['EmailAddress']
  ExperimentalPreferenceEnabled: ExperimentalPreferenceEnabled
  ExperimentalPreferenceEnabledInput: ExperimentalPreferenceEnabledInput
  ExperimentalPreferences: ExperimentalPreferences
  ExperimentalPreferencesInput: ExperimentalPreferencesInput
  File: File
  FileContent: FileContent
  FileContentInput: FileContentInput
  FileInput: FileInput
  FileQueries: FileQueries
  FileSize: FileSize
  FileUploadMutations: FileUploadMutations
  FilesComponentConfig: FilesComponentConfig
  FilesComponentConfigInput: FilesComponentConfigInput
  Float: Scalars['Float']
  FocalPoint: FocalPoint
  FocalPointInput: FocalPointInput
  Folder: Folder
  FolderMutations: FolderMutations
  FolderQueries: FolderQueries
  FullTreeNodeInput: FullTreeNodeInput
  GenericPublishInput: GenericPublishInput
  GenericSuggestSearchResult: GenericSuggestSearchResult
  GetTopicByPathArguments: GetTopicByPathArguments
  Grid: Grid
  GridColumn: GridColumn
  GridColumnInput: GridColumnInput
  GridColumnLayout: GridColumnLayout
  GridLayoutInput: GridLayoutInput
  GridMutations: GridMutations
  GridPublishInfo: GridPublishInfo
  GridQueries: GridQueries
  GridRelationsContent: GridRelationsContent
  GridRelationsContentInput: GridRelationsContentInput
  GridRow: GridRow
  GridRowInput: GridRowInput
  ID: Scalars['ID']
  IObjectMetrics:
    | ResolversParentTypes['ApiCallMetrics']
    | ResolversParentTypes['ItemMetrics']
    | ResolversParentTypes['OrderMetrics']
    | ResolversParentTypes['ShapeMetrics']
    | ResolversParentTypes['WebhookMetrics']
  IObjectReports: ResolversParentTypes['SalesReport']
  IdentifierSuggestion: IdentifierSuggestion
  Image: Image
  ImageConnection: ImageConnection
  ImageConnectionEdge: ImageConnectionEdge
  ImageContent: ImageContent
  ImageFilterInput: ImageFilterInput
  ImageInput: ImageInput
  ImageMutations: ImageMutations
  ImageQueries: ImageQueries
  ImageVariant: ImageVariant
  ImageVariantInput: ImageVariantInput
  Int: Scalars['Int']
  InviteToken: InviteToken
  InviteTokenMutations: InviteTokenMutations
  Item:
    | ResolversParentTypes['Document']
    | ResolversParentTypes['Folder']
    | ResolversParentTypes['Product']
  ItemConnection: ItemConnection
  ItemConnectionEdge: ItemConnectionEdge
  ItemMetrics: ItemMetrics
  ItemMutations: ItemMutations
  ItemQueries: ItemQueries
  ItemRelationsComponentConfig: ItemRelationsComponentConfig
  ItemRelationsComponentConfigInput: ItemRelationsComponentConfigInput
  ItemRelationsComponentQuickSelectConfig: ItemRelationsComponentQuickSelectConfig
  ItemRelationsComponentQuickSelectConfigInput: ItemRelationsComponentQuickSelectConfigInput
  ItemRelationsComponentQuickSelectFolderConfig: ItemRelationsComponentQuickSelectFolderConfig
  ItemRelationsComponentQuickSelectFolderConfigInput: ItemRelationsComponentQuickSelectFolderConfigInput
  ItemRelationsContent: ItemRelationsContent
  ItemRelationsContentInput: ItemRelationsContentInput
  ItemSuggestSearchResult: ItemSuggestSearchResult
  JSON: Scalars['JSON']
  KeyValuePair: KeyValuePair
  KeyValuePairInput: KeyValuePairInput
  KlarnaPayment: KlarnaPayment
  KlarnaPaymentInput: KlarnaPaymentInput
  Language: Language
  LanguageMutations: LanguageMutations
  LocationContent: LocationContent
  LocationContentInput: LocationContentInput
  Market: Market
  MarketConnection: MarketConnection
  MarketConnectionEdge: MarketConnectionEdge
  MarketMutations: MarketMutations
  MarketQueries: MarketQueries
  MaxFileSizeInput: MaxFileSizeInput
  MeMutations: MeMutations
  Mutation: {}
  NerdyViewPreferences: NerdyViewPreferences
  NerdyViewPreferencesInput: NerdyViewPreferencesInput
  NonNegativeFloat: Scalars['NonNegativeFloat']
  NonNegativeInt: Scalars['NonNegativeInt']
  NumericComponentConfig: NumericComponentConfig
  NumericComponentConfigInput: NumericComponentConfigInput
  NumericComponentContentInput: NumericComponentContentInput
  NumericContent: NumericContent
  Order: Omit<Order, 'payment'> & {
    payment?: Maybe<Array<ResolversParentTypes['Payment']>>
  }
  OrderConnection: OrderConnection
  OrderConnectionEdge: OrderConnectionEdge
  OrderItem: OrderItem
  OrderItemInput: OrderItemInput
  OrderItemMeteredVariable: OrderItemMeteredVariable
  OrderItemSubscription: OrderItemSubscription
  OrderMetrics: OrderMetrics
  OrderMutations: OrderMutations
  OrderPipeline: OrderPipeline
  OrderQueries: OrderQueries
  OrdersReport: OrdersReport
  PageInfo: PageInfo
  ParagraphCollectionContent: ParagraphCollectionContent
  ParagraphCollectionContentInput: ParagraphCollectionContentInput
  ParagraphContent: ParagraphContent
  ParagraphContentInput: ParagraphContentInput
  Payment: ResolversUnionParentTypes['Payment']
  PaymentInput: PaymentInput
  PaymentType:
    | ResolversParentTypes['CashPayment']
    | ResolversParentTypes['CustomPayment']
    | ResolversParentTypes['KlarnaPayment']
    | ResolversParentTypes['PaypalPayment']
    | ResolversParentTypes['StripePayment']
  PaypalPayment: PaypalPayment
  PaypalPaymentInput: PaypalPaymentInput
  PhoneNumber: Scalars['PhoneNumber']
  Pipeline: Pipeline
  PipelineConnection: PipelineConnection
  PipelineConnectionEdge: PipelineConnectionEdge
  PipelineMutations: PipelineMutations
  PipelineQueries: PipelineQueries
  PipelineStage: PipelineStage
  PositiveInt: Scalars['PositiveInt']
  Preference: Preference
  PreferenceInput: PreferenceInput
  Preferences: Preferences
  PreferencesInput: PreferencesInput
  PresignedUploadRequest: PresignedUploadRequest
  Price: Price
  PriceInput: PriceInput
  PriceList: PriceList
  PriceListConnection: PriceListConnection
  PriceListConnectionEdge: PriceListConnectionEdge
  PriceListMutations: PriceListMutations
  PriceListPriceVariant: PriceListPriceVariant
  PriceListPriceVariantReferenceInput: PriceListPriceVariantReferenceInput
  PriceListProduct: PriceListProduct
  PriceListProductPriceVariantReference: PriceListProductPriceVariantReference
  PriceListQueries: PriceListQueries
  PriceListSelectedProductVariants: PriceListSelectedProductVariants
  PriceListTargetAudience: PriceListTargetAudience
  PriceVariant: PriceVariant
  PriceVariantMutations: PriceVariantMutations
  PriceVariantQueries: PriceVariantQueries
  PriceVariantReferenceInput: PriceVariantReferenceInput
  Product: Product
  ProductMutations: ProductMutations
  ProductPriceVariant: ProductPriceVariant
  ProductQueries: ProductQueries
  ProductStockLocation: ProductStockLocation
  ProductSubscription: Omit<ProductSubscription, 'payment'> & {
    payment?: Maybe<ResolversParentTypes['Payment']>
  }
  ProductSubscriptionConnection: ProductSubscriptionConnection
  ProductSubscriptionConnectionEdge: ProductSubscriptionConnectionEdge
  ProductSubscriptionHistoryEvent:
    | ResolversParentTypes['ProductSubscriptionHistoryEventCancellation']
    | ResolversParentTypes['ProductSubscriptionHistoryEventRenewal']
    | ResolversParentTypes['ProductSubscriptionHistoryEventRenewalDueBroadcast']
  ProductSubscriptionHistoryEventCancellation: ProductSubscriptionHistoryEventCancellation
  ProductSubscriptionHistoryEventRenewal: ProductSubscriptionHistoryEventRenewal
  ProductSubscriptionHistoryEventRenewalDueBroadcast: ProductSubscriptionHistoryEventRenewalDueBroadcast
  ProductSubscriptionItem: ProductSubscriptionItem
  ProductSubscriptionMutations: ProductSubscriptionMutations
  ProductSubscriptionPhase: ProductSubscriptionPhase
  ProductSubscriptionPlanReferenceInput: ProductSubscriptionPlanReferenceInput
  ProductSubscriptionQueries: ProductSubscriptionQueries
  ProductSubscriptionStatus: ProductSubscriptionStatus
  ProductSubscriptionUsage: ProductSubscriptionUsage
  ProductVariant: ProductVariant
  ProductVariantAttribute: ProductVariantAttribute
  ProductVariantAttributeInput: ProductVariantAttributeInput
  ProductVariantConnection: ProductVariantConnection
  ProductVariantConnectionEdge: ProductVariantConnectionEdge
  ProductVariantPriceList: ProductVariantPriceList
  ProductVariantSubscriptionMeteredVariable: ProductVariantSubscriptionMeteredVariable
  ProductVariantSubscriptionPlan: ProductVariantSubscriptionPlan
  ProductVariantSubscriptionPlanPeriod: ProductVariantSubscriptionPlanPeriod
  ProductVariantSubscriptionPlanPricing: ProductVariantSubscriptionPlanPricing
  ProductVariantSubscriptionPlanTier: ProductVariantSubscriptionPlanTier
  PropertiesTableComponentConfig: PropertiesTableComponentConfig
  PropertiesTableComponentConfigInput: PropertiesTableComponentConfigInput
  PropertiesTableComponentConfigSection: PropertiesTableComponentConfigSection
  PropertiesTableComponentConfigSectionInput: PropertiesTableComponentConfigSectionInput
  PropertiesTableComponentSection: PropertiesTableComponentSection
  PropertiesTableComponentSectionInput: PropertiesTableComponentSectionInput
  PropertiesTableContent: PropertiesTableContent
  PropertiesTableContentInput: PropertiesTableContentInput
  PublishInfo: PublishInfo
  Query: {}
  RegenerateSecretsInput: RegenerateSecretsInput
  ReportMetric: ReportMetric
  RichTextContent: RichTextContent
  RichTextContentInput: RichTextContentInput
  SalesReport: SalesReport
  SearchQueries: SearchQueries
  SelectionComponentConfig: SelectionComponentConfig
  SelectionComponentConfigInput: SelectionComponentConfigInput
  SelectionComponentContentInput: SelectionComponentContentInput
  SelectionComponentOptionConfig: SelectionComponentOptionConfig
  SelectionComponentOptionConfigInput: SelectionComponentOptionConfigInput
  SelectionContent: SelectionContent
  Shape: Shape
  ShapeComponent: Omit<ShapeComponent, 'config'> & {
    config?: Maybe<ResolversParentTypes['ComponentConfig']>
  }
  ShapeComponentInput: ShapeComponentInput
  ShapeMetrics: ShapeMetrics
  ShapeMutations: ShapeMutations
  ShapeQueries: ShapeQueries
  SingleLineContent: SingleLineContent
  SingleLineContentInput: SingleLineContentInput
  StockLocation: StockLocation
  StockLocationMutations: StockLocationMutations
  StockLocationQueries: StockLocationQueries
  StockLocationReferenceInput: StockLocationReferenceInput
  StockLocationSettings: StockLocationSettings
  StockLocationSettingsInput: StockLocationSettingsInput
  String: Scalars['String']
  StripePayment: StripePayment
  StripePaymentInput: StripePaymentInput
  SubscriptionContract: Omit<SubscriptionContract, 'payment'> & {
    payment?: Maybe<ResolversParentTypes['Payment']>
  }
  SubscriptionContractAddress: SubscriptionContractAddress
  SubscriptionContractCancelledEvent: SubscriptionContractCancelledEvent
  SubscriptionContractConnection: SubscriptionContractConnection
  SubscriptionContractConnectionEdge: SubscriptionContractConnectionEdge
  SubscriptionContractEvent:
    | ResolversParentTypes['SubscriptionContractCancelledEvent']
    | ResolversParentTypes['SubscriptionContractRenewalDueBroadcastEvent']
    | ResolversParentTypes['SubscriptionContractRenewedEvent']
    | ResolversParentTypes['SubscriptionContractUsageTrackedEvent']
  SubscriptionContractEventConnection: SubscriptionContractEventConnection
  SubscriptionContractEventConnectionEdge: SubscriptionContractEventConnectionEdge
  SubscriptionContractEventQueries: SubscriptionContractEventQueries
  SubscriptionContractItem: SubscriptionContractItem
  SubscriptionContractMeteredVariableReference: SubscriptionContractMeteredVariableReference
  SubscriptionContractMeteredVariableTierReference: SubscriptionContractMeteredVariableTierReference
  SubscriptionContractMutations: SubscriptionContractMutations
  SubscriptionContractPhase: SubscriptionContractPhase
  SubscriptionContractQueries: SubscriptionContractQueries
  SubscriptionContractRenewalDueBroadcastEvent: SubscriptionContractRenewalDueBroadcastEvent
  SubscriptionContractRenewalDueBroadcastEventData: SubscriptionContractRenewalDueBroadcastEventData
  SubscriptionContractRenewedEvent: SubscriptionContractRenewedEvent
  SubscriptionContractStatus: SubscriptionContractStatus
  SubscriptionContractUsage: SubscriptionContractUsage
  SubscriptionContractUsageTrackedData: SubscriptionContractUsageTrackedData
  SubscriptionContractUsageTrackedEvent: SubscriptionContractUsageTrackedEvent
  SubscriptionPlan: SubscriptionPlan
  SubscriptionPlanMeteredVariable: SubscriptionPlanMeteredVariable
  SubscriptionPlanMeteredVariableInput: SubscriptionPlanMeteredVariableInput
  SubscriptionPlanMeteredVariableReferenceInput: SubscriptionPlanMeteredVariableReferenceInput
  SubscriptionPlanMeteredVariableTierReferenceInput: SubscriptionPlanMeteredVariableTierReferenceInput
  SubscriptionPlanMutations: SubscriptionPlanMutations
  SubscriptionPlanPeriod: SubscriptionPlanPeriod
  SubscriptionPlanPeriodInput: SubscriptionPlanPeriodInput
  SubscriptionPlanPeriodReferenceInput: SubscriptionPlanPeriodReferenceInput
  SubscriptionPlanPhase: SubscriptionPlanPhase
  SubscriptionPlanPhaseInput: SubscriptionPlanPhaseInput
  SubscriptionPlanPriceInput: SubscriptionPlanPriceInput
  SubscriptionPlanQueries: SubscriptionPlanQueries
  SubscriptionPlanReferenceInput: SubscriptionPlanReferenceInput
  SuggestSearchAggregations: SuggestSearchAggregations
  SuggestSearchConnection: SuggestSearchConnection
  SuggestSearchConnectionEdge: SuggestSearchConnectionEdge
  SuggestSearchResult:
    | ResolversParentTypes['GenericSuggestSearchResult']
    | ResolversParentTypes['ItemSuggestSearchResult']
  SuggestSearchTypesAggregation: SuggestSearchTypesAggregation
  Tax: Tax
  TaxInput: TaxInput
  Tenant: Tenant
  TenantAuthenticationMethod: TenantAuthenticationMethod
  TenantAuthenticationMethodInput: TenantAuthenticationMethodInput
  TenantDefaults: TenantDefaults
  TenantDefaultsInput: TenantDefaultsInput
  TenantFrontend: TenantFrontend
  TenantFrontendAuthentication: TenantFrontendAuthentication
  TenantFrontendAuthenticationInput: TenantFrontendAuthenticationInput
  TenantFrontendInput: TenantFrontendInput
  TenantMetrics: TenantMetrics
  TenantMutations: TenantMutations
  TenantPreferences: TenantPreferences
  TenantPreferencesInput: TenantPreferencesInput
  TenantQueries: TenantQueries
  TenantReports: TenantReports
  TenantRoleInput: TenantRoleInput
  Topic: Topic
  TopicConnection: TopicConnection
  TopicConnectionEdge: TopicConnectionEdge
  TopicImagesModified: TopicImagesModified
  TopicItemsModified: TopicItemsModified
  TopicMutations: TopicMutations
  TopicQueries: TopicQueries
  TopicSearchAggregations: TopicSearchAggregations
  TopicSearchConnection: TopicSearchConnection
  TopicSearchConnectionEdge: TopicSearchConnectionEdge
  TopicSearchResult: TopicSearchResult
  TrackUsageInput: TrackUsageInput
  TreeMutations: TreeMutations
  TreeNode: TreeNode
  TreeNodeIdentifier: TreeNodeIdentifier
  TreeNodeIdentifierInput: TreeNodeIdentifierInput
  TreeNodeInput: TreeNodeInput
  TreeQueries: TreeQueries
  UpdateAppInput: UpdateAppInput
  UpdateCustomerAddressInput: UpdateCustomerAddressInput
  UpdateCustomerInput: UpdateCustomerInput
  UpdateDocumentInput: UpdateDocumentInput
  UpdateFolderInput: UpdateFolderInput
  UpdateGridInput: UpdateGridInput
  UpdateImageInput: UpdateImageInput
  UpdateLanguageInput: UpdateLanguageInput
  UpdateMarketInput: UpdateMarketInput
  UpdateOrderInput: UpdateOrderInput
  UpdatePipelineInput: UpdatePipelineInput
  UpdatePipelineStageInput: UpdatePipelineStageInput
  UpdatePriceListInput: UpdatePriceListInput
  UpdatePriceVariantInput: UpdatePriceVariantInput
  UpdateProductInput: UpdateProductInput
  UpdateProductSubscriptionInput: UpdateProductSubscriptionInput
  UpdateProductSubscriptionItemInput: UpdateProductSubscriptionItemInput
  UpdateProductSubscriptionPhaseInput: UpdateProductSubscriptionPhaseInput
  UpdateProductSubscriptionStatusInput: UpdateProductSubscriptionStatusInput
  UpdateProductVariantInput: UpdateProductVariantInput
  UpdateShapeInput: UpdateShapeInput
  UpdateSingleProductVariantInput: UpdateSingleProductVariantInput
  UpdateStockLocationInput: UpdateStockLocationInput
  UpdateSubscriptionContractInput: UpdateSubscriptionContractInput
  UpdateSubscriptionContractItemInput: UpdateSubscriptionContractItemInput
  UpdateSubscriptionContractPhaseInput: UpdateSubscriptionContractPhaseInput
  UpdateSubscriptionContractStatusInput: UpdateSubscriptionContractStatusInput
  UpdateSubscriptionPlanInput: UpdateSubscriptionPlanInput
  UpdateTenantInput: UpdateTenantInput
  UpdateTopicInput: UpdateTopicInput
  UpdateUserInput: UpdateUserInput
  UpdateVatTypeInput: UpdateVatTypeInput
  UpdateWebhookInput: UpdateWebhookInput
  UploadField: UploadField
  User: User
  UserMetrics: UserMetrics
  UserMutations: UserMutations
  UserQueries: UserQueries
  UserRoleInput: UserRoleInput
  UserTenantRole: UserTenantRole
  VatType: VatType
  VatTypeMutations: VatTypeMutations
  VersionInfo: VersionInfo
  VersionedRecordInfo: VersionedRecordInfo
  VersionedServices: VersionedServices
  Video: Video
  VideoContent: VideoContent
  VideoInput: VideoInput
  VideoMutations: VideoMutations
  Webhook: Webhook
  WebhookHeader: WebhookHeader
  WebhookHeaderInput: WebhookHeaderInput
  WebhookInvocation: WebhookInvocation
  WebhookInvocationResponse: WebhookInvocationResponse
  WebhookMetrics: WebhookMetrics
  WebhookMutations: WebhookMutations
  WebhookQueries: WebhookQueries
}

export type AcceptedContentTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AcceptedContentType'] = ResolversParentTypes['AcceptedContentType']
> = {
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  extensionLabel?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AccessTokenResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AccessToken'] = ResolversParentTypes['AccessToken']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  lastUsed?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  secret?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AccessTokenMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AccessTokenMutations'] = ResolversParentTypes['AccessTokenMutations']
> = {
  create?: Resolver<
    ResolversTypes['AccessToken'],
    ParentType,
    ContextType,
    RequireFields<AccessTokenMutationsCreateArgs, 'input' | 'userId'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<AccessTokenMutationsDeleteArgs, 'id'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AddressResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']
> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  email?: Resolver<
    Maybe<ResolversTypes['EmailAddress']>,
    ParentType,
    ContextType
  >
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<AddressMetaPropertyArgs, 'key'>
  >
  middleName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  postalCode?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  street2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  streetNumber?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  type?: Resolver<ResolversTypes['AddressType'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ApiCallMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ApiCallMetrics'] = ResolversParentTypes['ApiCallMetrics']
> = {
  count?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<ApiCallMetricsCountArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AppResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']
> = {
  baseUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  sessionUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenant?: Resolver<Maybe<ResolversTypes['Tenant']>, ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AppConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AppConnection'] = ResolversParentTypes['AppConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['AppConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AppConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AppConnectionEdge'] = ResolversParentTypes['AppConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['App'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AppMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AppMutations'] = ResolversParentTypes['AppMutations']
> = {
  create?: Resolver<
    ResolversTypes['App'],
    ParentType,
    ContextType,
    RequireFields<AppMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<AppMutationsDeleteArgs, 'identifier' | 'tenantId'>
  >
  update?: Resolver<
    ResolversTypes['App'],
    ParentType,
    ContextType,
    RequireFields<AppMutationsUpdateArgs, 'identifier' | 'input' | 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AppQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AppQueries'] = ResolversParentTypes['AppQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['App']>,
    ParentType,
    ContextType,
    RequireFields<AppQueriesGetArgs, 'identifier' | 'tenantId'>
  >
  getMany?: Resolver<
    ResolversTypes['AppConnection'],
    ParentType,
    ContextType,
    RequireFields<AppQueriesGetManyArgs, 'filter'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type BandwidthUsageMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BandwidthUsageMetrics'] = ResolversParentTypes['BandwidthUsageMetrics']
> = {
  total?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType,
    RequireFields<BandwidthUsageMetricsTotalArgs, 'unit'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type BooleanContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BooleanContent'] = ResolversParentTypes['BooleanContent']
> = {
  value?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type BulkTaskTenantCopyInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BulkTaskTenantCopyInfo'] = ResolversParentTypes['BulkTaskTenantCopyInfo']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CashPaymentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CashPayment'] = ResolversParentTypes['CashPayment']
> = {
  cash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  provider?: Resolver<
    ResolversTypes['PaymentProvider'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ComponentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Component'] = ResolversParentTypes['Component']
> = {
  componentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<
    Maybe<ResolversTypes['ComponentContent']>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['ComponentType'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ComponentChoiceComponentConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ComponentChoiceComponentConfig'] = ResolversParentTypes['ComponentChoiceComponentConfig']
> = {
  choices?: Resolver<
    Array<ResolversTypes['ShapeComponent']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ComponentChoiceContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ComponentChoiceContent'] = ResolversParentTypes['ComponentChoiceContent']
> = {
  selectedComponent?: Resolver<
    ResolversTypes['Component'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ComponentConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ComponentConfig'] = ResolversParentTypes['ComponentConfig']
> = {
  __resolveType: TypeResolveFn<
    | 'ComponentChoiceComponentConfig'
    | 'ContentChunkComponentConfig'
    | 'FilesComponentConfig'
    | 'ItemRelationsComponentConfig'
    | 'NumericComponentConfig'
    | 'PropertiesTableComponentConfig'
    | 'SelectionComponentConfig',
    ParentType,
    ContextType
  >
}

export type ComponentContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ComponentContent'] = ResolversParentTypes['ComponentContent']
> = {
  __resolveType: TypeResolveFn<
    | 'BooleanContent'
    | 'ComponentChoiceContent'
    | 'ContentChunkContent'
    | 'DatetimeContent'
    | 'FileContent'
    | 'GridRelationsContent'
    | 'ImageContent'
    | 'ItemRelationsContent'
    | 'LocationContent'
    | 'NumericContent'
    | 'ParagraphCollectionContent'
    | 'PropertiesTableContent'
    | 'RichTextContent'
    | 'SelectionContent'
    | 'SingleLineContent'
    | 'VideoContent',
    ParentType,
    ContextType
  >
}

export type ContentChunkComponentConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ContentChunkComponentConfig'] = ResolversParentTypes['ContentChunkComponentConfig']
> = {
  components?: Resolver<
    Array<ResolversTypes['ShapeComponent']>,
    ParentType,
    ContextType
  >
  repeatable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ContentChunkContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ContentChunkContent'] = ResolversParentTypes['ContentChunkContent']
> = {
  chunks?: Resolver<
    Array<Array<ResolversTypes['Component']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CurrencySummaryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CurrencySummary'] = ResolversParentTypes['CurrencySummary']
> = {
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  value?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CurrencySummaryReportResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CurrencySummaryReport'] = ResolversParentTypes['CurrencySummaryReport']
> = {
  orders?: Resolver<
    Array<Maybe<ResolversTypes['CurrencySummary']>>,
    ParentType,
    ContextType,
    RequireFields<CurrencySummaryReportOrdersArgs, 'tenantId'>
  >
  sales?: Resolver<
    Array<Maybe<ResolversTypes['CurrencySummary']>>,
    ParentType,
    ContextType,
    RequireFields<CurrencySummaryReportSalesArgs, 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CustomPaymentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CustomPayment'] = ResolversParentTypes['CustomPayment']
> = {
  properties?: Resolver<
    Maybe<Array<ResolversTypes['CustomProperties']>>,
    ParentType,
    ContextType
  >
  provider?: Resolver<
    ResolversTypes['PaymentProvider'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CustomPropertiesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CustomProperties'] = ResolversParentTypes['CustomProperties']
> = {
  property?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CustomerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']
> = {
  addresses?: Resolver<
    Maybe<Array<ResolversTypes['Address']>>,
    ParentType,
    ContextType
  >
  birthDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  companyName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  externalReference?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<CustomerExternalReferenceArgs, 'key'>
  >
  externalReferences?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  identifier?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<CustomerMetaPropertyArgs, 'key'>
  >
  middleName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  taxNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tenantId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CustomerConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CustomerConnection'] = ResolversParentTypes['CustomerConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['CustomerConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CustomerConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CustomerConnectionEdge'] = ResolversParentTypes['CustomerConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CustomerMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CustomerMutations'] = ResolversParentTypes['CustomerMutations']
> = {
  create?: Resolver<
    ResolversTypes['Customer'],
    ParentType,
    ContextType,
    RequireFields<CustomerMutationsCreateArgs, 'input'>
  >
  createAddress?: Resolver<
    ResolversTypes['Customer'],
    ParentType,
    ContextType,
    RequireFields<
      CustomerMutationsCreateAddressArgs,
      'identifier' | 'input' | 'tenantId'
    >
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<
      CustomerMutationsDeleteArgs,
      'deleteSubscriptionContracts' | 'identifier' | 'tenantId'
    >
  >
  deleteAddress?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<
      CustomerMutationsDeleteAddressArgs,
      'addressId' | 'identifier' | 'tenantId'
    >
  >
  setMetadata?: Resolver<
    ResolversTypes['Customer'],
    ParentType,
    ContextType,
    RequireFields<
      CustomerMutationsSetMetadataArgs,
      'identifier' | 'key' | 'tenantId' | 'value'
    >
  >
  update?: Resolver<
    ResolversTypes['Customer'],
    ParentType,
    ContextType,
    RequireFields<
      CustomerMutationsUpdateArgs,
      'identifier' | 'input' | 'tenantId'
    >
  >
  updateAddress?: Resolver<
    ResolversTypes['Customer'],
    ParentType,
    ContextType,
    RequireFields<
      CustomerMutationsUpdateAddressArgs,
      'addressId' | 'identifier' | 'input' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CustomerQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CustomerQueries'] = ResolversParentTypes['CustomerQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Customer']>,
    ParentType,
    ContextType,
    RequireFields<CustomerQueriesGetArgs, 'tenantId'>
  >
  getMany?: Resolver<
    Maybe<ResolversTypes['CustomerConnection']>,
    ParentType,
    ContextType,
    RequireFields<CustomerQueriesGetManyArgs, 'first' | 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type DatetimeContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatetimeContent'] = ResolversParentTypes['DatetimeContent']
> = {
  datetime?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DigitalAssetPreferencesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DigitalAssetPreferences'] = ResolversParentTypes['DigitalAssetPreferences']
> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DiscountResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Discount'] = ResolversParentTypes['Discount']
> = {
  percent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DocumentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']
> = {
  components?: Resolver<
    Maybe<Array<ResolversTypes['Component']>>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  externalReference?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  hasVersion?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<DocumentHasVersionArgs>
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  relatingItems?: Resolver<
    Maybe<Array<ResolversTypes['Item']>>,
    ParentType,
    ContextType
  >
  shape?: Resolver<Maybe<ResolversTypes['Shape']>, ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  topics?: Resolver<
    Maybe<Array<ResolversTypes['Topic']>>,
    ParentType,
    ContextType
  >
  tree?: Resolver<Maybe<ResolversTypes['TreeNode']>, ParentType, ContextType>
  type?: Resolver<ResolversTypes['ItemType'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  version?: Resolver<
    Maybe<ResolversTypes['VersionedRecordInfo']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DocumentMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DocumentMutations'] = ResolversParentTypes['DocumentMutations']
> = {
  create?: Resolver<
    ResolversTypes['Document'],
    ParentType,
    ContextType,
    RequireFields<DocumentMutationsCreateArgs, 'input' | 'language'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<DocumentMutationsDeleteArgs, 'id'>
  >
  publish?: Resolver<
    ResolversTypes['PublishInfo'],
    ParentType,
    ContextType,
    RequireFields<
      DocumentMutationsPublishArgs,
      'id' | 'includeDescendants' | 'language'
    >
  >
  unpublish?: Resolver<
    Maybe<ResolversTypes['PublishInfo']>,
    ParentType,
    ContextType,
    RequireFields<
      DocumentMutationsUnpublishArgs,
      'id' | 'includeDescendants' | 'language'
    >
  >
  update?: Resolver<
    ResolversTypes['Document'],
    ParentType,
    ContextType,
    RequireFields<DocumentMutationsUpdateArgs, 'id' | 'input' | 'language'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DocumentQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DocumentQueries'] = ResolversParentTypes['DocumentQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Document']>,
    ParentType,
    ContextType,
    RequireFields<DocumentQueriesGetArgs, 'id' | 'language' | 'versionLabel'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress'
}

export type ExperimentalPreferenceEnabledResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ExperimentalPreferenceEnabled'] = ResolversParentTypes['ExperimentalPreferenceEnabled']
> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ExperimentalPreferencesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ExperimentalPreferences'] = ResolversParentTypes['ExperimentalPreferences']
> = {
  componentsOnVariants?: Resolver<
    Maybe<ResolversTypes['ExperimentalPreferenceEnabled']>,
    ParentType,
    ContextType
  >
  dam?: Resolver<
    Maybe<ResolversTypes['DigitalAssetPreferences']>,
    ParentType,
    ContextType
  >
  get?: Resolver<
    Maybe<ResolversTypes['Preference']>,
    ParentType,
    ContextType,
    RequireFields<ExperimentalPreferencesGetArgs, 'name'>
  >
  nerdyView?: Resolver<
    Maybe<ResolversTypes['NerdyViewPreferences']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FileResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']
> = {
  contentType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<FileMetaPropertyArgs, 'key'>
  >
  size?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FileContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileContent'] = ResolversParentTypes['FileContent']
> = {
  files?: Resolver<
    Maybe<Array<ResolversTypes['File']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FileQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileQueries'] = ResolversParentTypes['FileQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    ContextType,
    RequireFields<FileQueriesGetArgs, 'key' | 'language'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FileSizeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileSize'] = ResolversParentTypes['FileSize']
> = {
  size?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  unit?: Resolver<ResolversTypes['FileSizeUnit'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FileUploadMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileUploadMutations'] = ResolversParentTypes['FileUploadMutations']
> = {
  generatePresignedRequest?: Resolver<
    ResolversTypes['PresignedUploadRequest'],
    ParentType,
    ContextType,
    RequireFields<
      FileUploadMutationsGeneratePresignedRequestArgs,
      'contentType' | 'filename' | 'tenantId' | 'type'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FilesComponentConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FilesComponentConfig'] = ResolversParentTypes['FilesComponentConfig']
> = {
  acceptedContentTypes?: Resolver<
    Maybe<Array<ResolversTypes['AcceptedContentType']>>,
    ParentType,
    ContextType
  >
  max?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  maxFileSize?: Resolver<
    Maybe<ResolversTypes['FileSize']>,
    ParentType,
    ContextType
  >
  min?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FocalPointResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FocalPoint'] = ResolversParentTypes['FocalPoint']
> = {
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FolderResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Folder'] = ResolversParentTypes['Folder']
> = {
  components?: Resolver<
    Maybe<Array<ResolversTypes['Component']>>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  externalReference?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  hasVersion?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<FolderHasVersionArgs>
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  relatingItems?: Resolver<
    Maybe<Array<ResolversTypes['Item']>>,
    ParentType,
    ContextType
  >
  shape?: Resolver<Maybe<ResolversTypes['Shape']>, ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  topics?: Resolver<
    Maybe<Array<ResolversTypes['Topic']>>,
    ParentType,
    ContextType
  >
  tree?: Resolver<Maybe<ResolversTypes['TreeNode']>, ParentType, ContextType>
  type?: Resolver<ResolversTypes['ItemType'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  version?: Resolver<
    Maybe<ResolversTypes['VersionedRecordInfo']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FolderMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FolderMutations'] = ResolversParentTypes['FolderMutations']
> = {
  create?: Resolver<
    ResolversTypes['Folder'],
    ParentType,
    ContextType,
    RequireFields<FolderMutationsCreateArgs, 'input' | 'language'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<FolderMutationsDeleteArgs, 'id'>
  >
  publish?: Resolver<
    ResolversTypes['PublishInfo'],
    ParentType,
    ContextType,
    RequireFields<
      FolderMutationsPublishArgs,
      'id' | 'includeDescendants' | 'language'
    >
  >
  unpublish?: Resolver<
    Maybe<ResolversTypes['PublishInfo']>,
    ParentType,
    ContextType,
    RequireFields<
      FolderMutationsUnpublishArgs,
      'id' | 'includeDescendants' | 'language'
    >
  >
  update?: Resolver<
    ResolversTypes['Folder'],
    ParentType,
    ContextType,
    RequireFields<FolderMutationsUpdateArgs, 'id' | 'input' | 'language'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FolderQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FolderQueries'] = ResolversParentTypes['FolderQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Folder']>,
    ParentType,
    ContextType,
    RequireFields<FolderQueriesGetArgs, 'id' | 'language' | 'versionLabel'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GenericSuggestSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GenericSuggestSearchResult'] = ResolversParentTypes['GenericSuggestSearchResult']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GridResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Grid'] = ResolversParentTypes['Grid']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  hasVersion?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    Partial<GridHasVersionArgs>
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<GridMetaPropertyArgs, 'key'>
  >
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  rows?: Resolver<Array<ResolversTypes['GridRow']>, ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  version?: Resolver<
    Maybe<ResolversTypes['VersionedRecordInfo']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GridColumnResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GridColumn'] = ResolversParentTypes['GridColumn']
> = {
  item?: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType>
  itemId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  itemType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  layout?: Resolver<
    Maybe<ResolversTypes['GridColumnLayout']>,
    ParentType,
    ContextType
  >
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<GridColumnMetaPropertyArgs, 'key'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GridColumnLayoutResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GridColumnLayout'] = ResolversParentTypes['GridColumnLayout']
> = {
  colspan?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  rowspan?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GridMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GridMutations'] = ResolversParentTypes['GridMutations']
> = {
  create?: Resolver<
    ResolversTypes['Grid'],
    ParentType,
    ContextType,
    RequireFields<GridMutationsCreateArgs, 'input' | 'language'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<GridMutationsDeleteArgs, 'id'>
  >
  publish?: Resolver<
    ResolversTypes['GridPublishInfo'],
    ParentType,
    ContextType,
    RequireFields<GridMutationsPublishArgs, 'id' | 'language'>
  >
  unpublish?: Resolver<
    Maybe<ResolversTypes['GridPublishInfo']>,
    ParentType,
    ContextType,
    RequireFields<GridMutationsUnpublishArgs, 'id' | 'language'>
  >
  update?: Resolver<
    ResolversTypes['Grid'],
    ParentType,
    ContextType,
    RequireFields<GridMutationsUpdateArgs, 'id' | 'input' | 'language'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GridPublishInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GridPublishInfo'] = ResolversParentTypes['GridPublishInfo']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  versionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GridQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GridQueries'] = ResolversParentTypes['GridQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Grid']>,
    ParentType,
    ContextType,
    RequireFields<GridQueriesGetArgs, 'id' | 'language' | 'versionLabel'>
  >
  getMany?: Resolver<
    Maybe<Array<ResolversTypes['Grid']>>,
    ParentType,
    ContextType,
    RequireFields<GridQueriesGetManyArgs, 'language' | 'versionLabel'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GridRelationsContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GridRelationsContent'] = ResolversParentTypes['GridRelationsContent']
> = {
  grids?: Resolver<
    Maybe<Array<ResolversTypes['Grid']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GridRowResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GridRow'] = ResolversParentTypes['GridRow']
> = {
  columns?: Resolver<
    Array<ResolversTypes['GridColumn']>,
    ParentType,
    ContextType
  >
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<GridRowMetaPropertyArgs, 'key'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type IObjectMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['IObjectMetrics'] = ResolversParentTypes['IObjectMetrics']
> = {
  __resolveType: TypeResolveFn<
    | 'ApiCallMetrics'
    | 'ItemMetrics'
    | 'OrderMetrics'
    | 'ShapeMetrics'
    | 'WebhookMetrics',
    ParentType,
    ContextType
  >
  count?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<IObjectMetricsCountArgs>
  >
}

export type IObjectReportsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['IObjectReports'] = ResolversParentTypes['IObjectReports']
> = {
  __resolveType: TypeResolveFn<'SalesReport', ParentType, ContextType>
  avg?: Resolver<
    Array<Maybe<ResolversTypes['ReportMetric']>>,
    ParentType,
    ContextType,
    RequireFields<IObjectReportsAvgArgs, 'direction' | 'orderBy' | 'resolution'>
  >
  sum?: Resolver<
    Array<Maybe<ResolversTypes['ReportMetric']>>,
    ParentType,
    ContextType,
    RequireFields<IObjectReportsSumArgs, 'direction' | 'orderBy' | 'resolution'>
  >
  total?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType,
    Partial<IObjectReportsTotalArgs>
  >
}

export type IdentifierSuggestionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['IdentifierSuggestion'] = ResolversParentTypes['IdentifierSuggestion']
> = {
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  suggestion?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ImageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']
> = {
  altText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  caption?: Resolver<
    Maybe<ResolversTypes['RichTextContent']>,
    ParentType,
    ContextType
  >
  focalPoint?: Resolver<
    Maybe<ResolversTypes['FocalPoint']>,
    ParentType,
    ContextType
  >
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<ImageMetaPropertyArgs, 'key'>
  >
  mimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  variants?: Resolver<
    Maybe<Array<ResolversTypes['ImageVariant']>>,
    ParentType,
    ContextType
  >
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ImageConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ImageConnection'] = ResolversParentTypes['ImageConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['ImageConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ImageConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ImageConnectionEdge'] = ResolversParentTypes['ImageConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['Image'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ImageContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ImageContent'] = ResolversParentTypes['ImageContent']
> = {
  images?: Resolver<
    Maybe<Array<ResolversTypes['Image']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ImageMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ImageMutations'] = ResolversParentTypes['ImageMutations']
> = {
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<ImageMutationsDeleteArgs, 'key' | 'tenantId'>
  >
  registerImage?: Resolver<
    Maybe<ResolversTypes['Image']>,
    ParentType,
    ContextType,
    RequireFields<ImageMutationsRegisterImageArgs, 'key' | 'tenantId'>
  >
  registerVariants?: Resolver<
    Maybe<ResolversTypes['Image']>,
    ParentType,
    ContextType,
    RequireFields<ImageMutationsRegisterVariantsArgs, 'key' | 'variants'>
  >
  update?: Resolver<
    ResolversTypes['Image'],
    ParentType,
    ContextType,
    RequireFields<ImageMutationsUpdateArgs, 'input' | 'key' | 'language'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ImageQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ImageQueries'] = ResolversParentTypes['ImageQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Image']>,
    ParentType,
    ContextType,
    RequireFields<ImageQueriesGetArgs, 'key'>
  >
  getItems?: Resolver<
    Maybe<ResolversTypes['ItemConnection']>,
    ParentType,
    ContextType,
    RequireFields<
      ImageQueriesGetItemsArgs,
      'first' | 'key' | 'language' | 'tenantId' | 'versionLabel'
    >
  >
  getMany?: Resolver<
    Maybe<ResolversTypes['ImageConnection']>,
    ParentType,
    ContextType,
    RequireFields<
      ImageQueriesGetManyArgs,
      'first' | 'language' | 'sort' | 'sortField' | 'tenantId'
    >
  >
  getTopics?: Resolver<
    Maybe<ResolversTypes['TopicConnection']>,
    ParentType,
    ContextType,
    RequireFields<
      ImageQueriesGetTopicsArgs,
      'first' | 'key' | 'language' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ImageVariantResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ImageVariant'] = ResolversParentTypes['ImageVariant']
> = {
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type InviteTokenResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InviteToken'] = ResolversParentTypes['InviteToken']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  createdBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  createdByUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType
  >
  expiresAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  redeemedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  redeemedBy?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  redeemedByUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType
  >
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  token?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type InviteTokenMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InviteTokenMutations'] = ResolversParentTypes['InviteTokenMutations']
> = {
  create?: Resolver<
    ResolversTypes['InviteToken'],
    ParentType,
    ContextType,
    RequireFields<InviteTokenMutationsCreateArgs, 'tenantId'>
  >
  redeem?: Resolver<
    ResolversTypes['InviteToken'],
    ParentType,
    ContextType,
    RequireFields<InviteTokenMutationsRedeemArgs, 'token'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Item'] = ResolversParentTypes['Item']
> = {
  __resolveType: TypeResolveFn<
    'Document' | 'Folder' | 'Product',
    ParentType,
    ContextType
  >
  components?: Resolver<
    Maybe<Array<ResolversTypes['Component']>>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  externalReference?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  hasVersion?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<ItemHasVersionArgs>
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  relatingItems?: Resolver<
    Maybe<Array<ResolversTypes['Item']>>,
    ParentType,
    ContextType
  >
  shape?: Resolver<Maybe<ResolversTypes['Shape']>, ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  topics?: Resolver<
    Maybe<Array<ResolversTypes['Topic']>>,
    ParentType,
    ContextType
  >
  tree?: Resolver<Maybe<ResolversTypes['TreeNode']>, ParentType, ContextType>
  type?: Resolver<ResolversTypes['ItemType'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  version?: Resolver<
    Maybe<ResolversTypes['VersionedRecordInfo']>,
    ParentType,
    ContextType
  >
}

export type ItemConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemConnection'] = ResolversParentTypes['ItemConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['ItemConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemConnectionEdge'] = ResolversParentTypes['ItemConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['Item'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemMetrics'] = ResolversParentTypes['ItemMetrics']
> = {
  count?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<ItemMetricsCountArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemMutations'] = ResolversParentTypes['ItemMutations']
> = {
  bulkPublish?: Resolver<
    Maybe<Array<ResolversTypes['PublishInfo']>>,
    ParentType,
    ContextType,
    RequireFields<ItemMutationsBulkPublishArgs, 'language'>
  >
  bulkUnpublish?: Resolver<
    Maybe<Array<ResolversTypes['PublishInfo']>>,
    ParentType,
    ContextType,
    RequireFields<ItemMutationsBulkUnpublishArgs, 'language'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<ItemMutationsDeleteArgs, 'id'>
  >
  publish?: Resolver<
    ResolversTypes['PublishInfo'],
    ParentType,
    ContextType,
    RequireFields<
      ItemMutationsPublishArgs,
      'id' | 'includeDescendants' | 'language'
    >
  >
  unpublish?: Resolver<
    Maybe<ResolversTypes['PublishInfo']>,
    ParentType,
    ContextType,
    RequireFields<
      ItemMutationsUnpublishArgs,
      'id' | 'includeDescendants' | 'language'
    >
  >
  updateComponent?: Resolver<
    ResolversTypes['Item'],
    ParentType,
    ContextType,
    RequireFields<
      ItemMutationsUpdateComponentArgs,
      'input' | 'itemId' | 'language'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemQueries'] = ResolversParentTypes['ItemQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Item']>,
    ParentType,
    ContextType,
    RequireFields<ItemQueriesGetArgs, 'id' | 'language' | 'versionLabel'>
  >
  getMany?: Resolver<
    Maybe<Array<ResolversTypes['Item']>>,
    ParentType,
    ContextType,
    RequireFields<ItemQueriesGetManyArgs, 'language' | 'versionLabel'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemRelationsComponentConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemRelationsComponentConfig'] = ResolversParentTypes['ItemRelationsComponentConfig']
> = {
  acceptedShapeIdentifiers?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
  max?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  maxItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  maxSkus?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  min?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  minItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  minSkus?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  quickSelect?: Resolver<
    Maybe<ResolversTypes['ItemRelationsComponentQuickSelectConfig']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemRelationsComponentQuickSelectConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemRelationsComponentQuickSelectConfig'] = ResolversParentTypes['ItemRelationsComponentQuickSelectConfig']
> = {
  folders?: Resolver<
    Maybe<
      Array<ResolversTypes['ItemRelationsComponentQuickSelectFolderConfig']>
    >,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemRelationsComponentQuickSelectFolderConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemRelationsComponentQuickSelectFolderConfig'] = ResolversParentTypes['ItemRelationsComponentQuickSelectFolderConfig']
> = {
  folderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemRelationsContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemRelationsContent'] = ResolversParentTypes['ItemRelationsContent']
> = {
  items?: Resolver<
    Maybe<Array<ResolversTypes['Item']>>,
    ParentType,
    ContextType
  >
  productVariants?: Resolver<
    Maybe<Array<ResolversTypes['ProductVariant']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ItemSuggestSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ItemSuggestSearchResult'] = ResolversParentTypes['ItemSuggestSearchResult']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  shapeIdentifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type KeyValuePairResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['KeyValuePair'] = ResolversParentTypes['KeyValuePair']
> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type KlarnaPaymentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['KlarnaPayment'] = ResolversParentTypes['KlarnaPayment']
> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  merchantReference1?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  merchantReference2?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  orderId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  provider?: Resolver<
    ResolversTypes['PaymentProvider'],
    ParentType,
    ContextType
  >
  recurringToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LanguageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']
> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  system?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LanguageMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LanguageMutations'] = ResolversParentTypes['LanguageMutations']
> = {
  add?: Resolver<
    Maybe<Array<ResolversTypes['Language']>>,
    ParentType,
    ContextType,
    RequireFields<LanguageMutationsAddArgs, 'input' | 'tenantId'>
  >
  remove?: Resolver<
    Maybe<Array<ResolversTypes['Language']>>,
    ParentType,
    ContextType,
    RequireFields<LanguageMutationsRemoveArgs, 'code' | 'tenantId'>
  >
  update?: Resolver<
    Maybe<Array<ResolversTypes['Language']>>,
    ParentType,
    ContextType,
    RequireFields<LanguageMutationsUpdateArgs, 'code' | 'input' | 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LocationContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LocationContent'] = ResolversParentTypes['LocationContent']
> = {
  lat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  long?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Market'] = ResolversParentTypes['Market']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  customerIdentifiers?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarketConnection'] = ResolversParentTypes['MarketConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['MarketConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarketConnectionEdge'] = ResolversParentTypes['MarketConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['Market'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarketMutations'] = ResolversParentTypes['MarketMutations']
> = {
  create?: Resolver<
    ResolversTypes['Market'],
    ParentType,
    ContextType,
    RequireFields<MarketMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<MarketMutationsDeleteArgs, 'identifier' | 'tenantId'>
  >
  update?: Resolver<
    ResolversTypes['Market'],
    ParentType,
    ContextType,
    RequireFields<
      MarketMutationsUpdateArgs,
      'identifier' | 'input' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarketQueries'] = ResolversParentTypes['MarketQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Market']>,
    ParentType,
    ContextType,
    RequireFields<MarketQueriesGetArgs, 'identifier' | 'tenantId'>
  >
  getMany?: Resolver<
    ResolversTypes['MarketConnection'],
    ParentType,
    ContextType,
    RequireFields<MarketQueriesGetManyArgs, 'first' | 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MeMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MeMutations'] = ResolversParentTypes['MeMutations']
> = {
  generateAccessToken?: Resolver<
    Maybe<ResolversTypes['AccessToken']>,
    ParentType,
    ContextType,
    RequireFields<MeMutationsGenerateAccessTokenArgs, 'input'>
  >
  setPreference?: Resolver<
    Maybe<ResolversTypes['Preference']>,
    ParentType,
    ContextType,
    RequireFields<MeMutationsSetPreferenceArgs, 'input'>
  >
  setPreferences?: Resolver<
    Maybe<ResolversTypes['Preferences']>,
    ParentType,
    ContextType,
    RequireFields<MeMutationsSetPreferencesArgs, 'input'>
  >
  update?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    Partial<MeMutationsUpdateArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  accessToken?: Resolver<
    Maybe<ResolversTypes['AccessTokenMutations']>,
    ParentType,
    ContextType
  >
  app?: Resolver<Maybe<ResolversTypes['AppMutations']>, ParentType, ContextType>
  customer?: Resolver<
    Maybe<ResolversTypes['CustomerMutations']>,
    ParentType,
    ContextType
  >
  document?: Resolver<
    Maybe<ResolversTypes['DocumentMutations']>,
    ParentType,
    ContextType
  >
  fileUpload?: Resolver<
    Maybe<ResolversTypes['FileUploadMutations']>,
    ParentType,
    ContextType
  >
  folder?: Resolver<
    Maybe<ResolversTypes['FolderMutations']>,
    ParentType,
    ContextType
  >
  grid?: Resolver<
    Maybe<ResolversTypes['GridMutations']>,
    ParentType,
    ContextType
  >
  image?: Resolver<
    Maybe<ResolversTypes['ImageMutations']>,
    ParentType,
    ContextType
  >
  inviteToken?: Resolver<
    Maybe<ResolversTypes['InviteTokenMutations']>,
    ParentType,
    ContextType
  >
  item?: Resolver<
    Maybe<ResolversTypes['ItemMutations']>,
    ParentType,
    ContextType
  >
  language?: Resolver<
    Maybe<ResolversTypes['LanguageMutations']>,
    ParentType,
    ContextType
  >
  market?: Resolver<ResolversTypes['MarketMutations'], ParentType, ContextType>
  me?: Resolver<Maybe<ResolversTypes['MeMutations']>, ParentType, ContextType>
  order?: Resolver<
    Maybe<ResolversTypes['OrderMutations']>,
    ParentType,
    ContextType
  >
  pipeline?: Resolver<
    Maybe<ResolversTypes['PipelineMutations']>,
    ParentType,
    ContextType
  >
  priceList?: Resolver<
    ResolversTypes['PriceListMutations'],
    ParentType,
    ContextType
  >
  priceVariant?: Resolver<
    ResolversTypes['PriceVariantMutations'],
    ParentType,
    ContextType
  >
  product?: Resolver<
    Maybe<ResolversTypes['ProductMutations']>,
    ParentType,
    ContextType
  >
  productSubscription?: Resolver<
    ResolversTypes['ProductSubscriptionMutations'],
    ParentType,
    ContextType
  >
  shape?: Resolver<
    Maybe<ResolversTypes['ShapeMutations']>,
    ParentType,
    ContextType
  >
  stockLocation?: Resolver<
    ResolversTypes['StockLocationMutations'],
    ParentType,
    ContextType
  >
  subscriptionContract?: Resolver<
    ResolversTypes['SubscriptionContractMutations'],
    ParentType,
    ContextType
  >
  subscriptionPlan?: Resolver<
    ResolversTypes['SubscriptionPlanMutations'],
    ParentType,
    ContextType
  >
  tenant?: Resolver<
    Maybe<ResolversTypes['TenantMutations']>,
    ParentType,
    ContextType
  >
  topic?: Resolver<
    Maybe<ResolversTypes['TopicMutations']>,
    ParentType,
    ContextType
  >
  tree?: Resolver<
    Maybe<ResolversTypes['TreeMutations']>,
    ParentType,
    ContextType
  >
  user?: Resolver<
    Maybe<ResolversTypes['UserMutations']>,
    ParentType,
    ContextType
  >
  vatType?: Resolver<
    Maybe<ResolversTypes['VatTypeMutations']>,
    ParentType,
    ContextType
  >
  video?: Resolver<
    Maybe<ResolversTypes['VideoMutations']>,
    ParentType,
    ContextType
  >
  webhook?: Resolver<
    Maybe<ResolversTypes['WebhookMutations']>,
    ParentType,
    ContextType
  >
}

export type NerdyViewPreferencesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['NerdyViewPreferences'] = ResolversParentTypes['NerdyViewPreferences']
> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface NonNegativeFloatScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeFloat'], any> {
  name: 'NonNegativeFloat'
}

export interface NonNegativeIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeInt'], any> {
  name: 'NonNegativeInt'
}

export type NumericComponentConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['NumericComponentConfig'] = ResolversParentTypes['NumericComponentConfig']
> = {
  decimalPlaces?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  units?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type NumericContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['NumericContent'] = ResolversParentTypes['NumericContent']
> = {
  number?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']
> = {
  additionalInformation?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  cart?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  customer?: Resolver<
    Maybe<ResolversTypes['Customer']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  payment?: Resolver<
    Maybe<Array<ResolversTypes['Payment']>>,
    ParentType,
    ContextType
  >
  pipelines?: Resolver<
    Maybe<Array<ResolversTypes['OrderPipeline']>>,
    ParentType,
    ContextType
  >
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  total?: Resolver<Maybe<ResolversTypes['Price']>, ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderConnection'] = ResolversParentTypes['OrderConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['OrderConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderConnectionEdge'] = ResolversParentTypes['OrderConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['Order'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']
> = {
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  orderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  price?: Resolver<Maybe<ResolversTypes['Price']>, ParentType, ContextType>
  productId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  productSubscriptionId?: Resolver<
    Maybe<ResolversTypes['ID']>,
    ParentType,
    ContextType
  >
  productVariantId?: Resolver<
    Maybe<ResolversTypes['ID']>,
    ParentType,
    ContextType
  >
  quantity?: Resolver<ResolversTypes['NonNegativeInt'], ParentType, ContextType>
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  subTotal?: Resolver<Maybe<ResolversTypes['Price']>, ParentType, ContextType>
  subscription?: Resolver<
    Maybe<ResolversTypes['OrderItemSubscription']>,
    ParentType,
    ContextType
  >
  subscriptionContractId?: Resolver<
    Maybe<ResolversTypes['ID']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderItemMeteredVariableResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderItemMeteredVariable'] = ResolversParentTypes['OrderItemMeteredVariable']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  usage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderItemSubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderItemSubscription'] = ResolversParentTypes['OrderItemSubscription']
> = {
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  meteredVariables?: Resolver<
    Maybe<Array<ResolversTypes['OrderItemMeteredVariable']>>,
    ParentType,
    ContextType
  >
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  period?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  unit?: Resolver<
    ResolversTypes['OrderItemSubscriptionPeriodUnit'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderMetrics'] = ResolversParentTypes['OrderMetrics']
> = {
  count?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<OrderMetricsCountArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderMutations'] = ResolversParentTypes['OrderMutations']
> = {
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<OrderMutationsDeleteArgs, 'id'>
  >
  removePipeline?: Resolver<
    ResolversTypes['Order'],
    ParentType,
    ContextType,
    RequireFields<OrderMutationsRemovePipelineArgs, 'orderId' | 'pipelineId'>
  >
  setPipelineStage?: Resolver<
    ResolversTypes['Order'],
    ParentType,
    ContextType,
    RequireFields<
      OrderMutationsSetPipelineStageArgs,
      'orderId' | 'pipelineId' | 'stageId'
    >
  >
  update?: Resolver<
    ResolversTypes['Order'],
    ParentType,
    ContextType,
    RequireFields<OrderMutationsUpdateArgs, 'id' | 'input'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderPipelineResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderPipeline'] = ResolversParentTypes['OrderPipeline']
> = {
  pipeline?: Resolver<ResolversTypes['Pipeline'], ParentType, ContextType>
  pipelineId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  stageId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrderQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrderQueries'] = ResolversParentTypes['OrderQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Order']>,
    ParentType,
    ContextType,
    RequireFields<OrderQueriesGetArgs, 'id'>
  >
  getMany?: Resolver<
    Maybe<ResolversTypes['OrderConnection']>,
    ParentType,
    ContextType,
    RequireFields<OrderQueriesGetManyArgs, 'first' | 'sort' | 'sortField'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OrdersReportResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OrdersReport'] = ResolversParentTypes['OrdersReport']
> = {
  avg?: Resolver<
    Array<Maybe<ResolversTypes['ReportMetric']>>,
    ParentType,
    ContextType,
    RequireFields<
      OrdersReportAvgArgs,
      'direction' | 'groupBy' | 'orderBy' | 'resolution'
    >
  >
  sum?: Resolver<
    Array<Maybe<ResolversTypes['ReportMetric']>>,
    ParentType,
    ContextType,
    RequireFields<
      OrdersReportSumArgs,
      'direction' | 'groupBy' | 'orderBy' | 'resolution'
    >
  >
  total?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<OrdersReportTotalArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PageInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']
> = {
  endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  startCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  totalNodes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ParagraphCollectionContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ParagraphCollectionContent'] = ResolversParentTypes['ParagraphCollectionContent']
> = {
  paragraphs?: Resolver<
    Maybe<Array<ResolversTypes['ParagraphContent']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ParagraphContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ParagraphContent'] = ResolversParentTypes['ParagraphContent']
> = {
  body?: Resolver<
    Maybe<ResolversTypes['RichTextContent']>,
    ParentType,
    ContextType
  >
  images?: Resolver<
    Maybe<Array<ResolversTypes['Image']>>,
    ParentType,
    ContextType
  >
  title?: Resolver<
    Maybe<ResolversTypes['SingleLineContent']>,
    ParentType,
    ContextType
  >
  videos?: Resolver<
    Maybe<Array<ResolversTypes['Video']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PaymentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']
> = {
  __resolveType: TypeResolveFn<
    | 'CashPayment'
    | 'CustomPayment'
    | 'KlarnaPayment'
    | 'PaypalPayment'
    | 'StripePayment',
    ParentType,
    ContextType
  >
}

export type PaymentTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PaymentType'] = ResolversParentTypes['PaymentType']
> = {
  __resolveType: TypeResolveFn<
    | 'CashPayment'
    | 'CustomPayment'
    | 'KlarnaPayment'
    | 'PaypalPayment'
    | 'StripePayment',
    ParentType,
    ContextType
  >
  provider?: Resolver<
    ResolversTypes['PaymentProvider'],
    ParentType,
    ContextType
  >
}

export type PaypalPaymentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PaypalPayment'] = ResolversParentTypes['PaypalPayment']
> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  invoiceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  orderId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  provider?: Resolver<
    ResolversTypes['PaymentProvider'],
    ParentType,
    ContextType
  >
  subscriptionId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface PhoneNumberScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PhoneNumber'], any> {
  name: 'PhoneNumber'
}

export type PipelineResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Pipeline'] = ResolversParentTypes['Pipeline']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  orders?: Resolver<
    ResolversTypes['OrderConnection'],
    ParentType,
    ContextType,
    RequireFields<PipelineOrdersArgs, 'first' | 'sort' | 'sortField'>
  >
  stages?: Resolver<
    Maybe<Array<ResolversTypes['PipelineStage']>>,
    ParentType,
    ContextType
  >
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PipelineConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PipelineConnection'] = ResolversParentTypes['PipelineConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['PipelineConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PipelineConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PipelineConnectionEdge'] = ResolversParentTypes['PipelineConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['Pipeline'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PipelineMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PipelineMutations'] = ResolversParentTypes['PipelineMutations']
> = {
  addStage?: Resolver<
    ResolversTypes['Pipeline'],
    ParentType,
    ContextType,
    RequireFields<PipelineMutationsAddStageArgs, 'input' | 'pipelineId'>
  >
  create?: Resolver<
    ResolversTypes['Pipeline'],
    ParentType,
    ContextType,
    RequireFields<PipelineMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType,
    RequireFields<PipelineMutationsDeleteArgs, 'force' | 'id'>
  >
  moveStage?: Resolver<
    ResolversTypes['Pipeline'],
    ParentType,
    ContextType,
    RequireFields<
      PipelineMutationsMoveStageArgs,
      'newPosition' | 'pipelineId' | 'stageId'
    >
  >
  removeStage?: Resolver<
    ResolversTypes['Pipeline'],
    ParentType,
    ContextType,
    RequireFields<
      PipelineMutationsRemoveStageArgs,
      'force' | 'pipelineId' | 'stageId'
    >
  >
  update?: Resolver<
    ResolversTypes['Pipeline'],
    ParentType,
    ContextType,
    RequireFields<PipelineMutationsUpdateArgs, 'id'>
  >
  updateStage?: Resolver<
    ResolversTypes['Pipeline'],
    ParentType,
    ContextType,
    RequireFields<
      PipelineMutationsUpdateStageArgs,
      'input' | 'pipelineId' | 'stageId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PipelineQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PipelineQueries'] = ResolversParentTypes['PipelineQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Pipeline']>,
    ParentType,
    ContextType,
    RequireFields<PipelineQueriesGetArgs, 'id'>
  >
  getMany?: Resolver<
    ResolversTypes['PipelineConnection'],
    ParentType,
    ContextType,
    RequireFields<
      PipelineQueriesGetManyArgs,
      'first' | 'sort' | 'sortField' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PipelineStageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PipelineStage'] = ResolversParentTypes['PipelineStage']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  orders?: Resolver<
    ResolversTypes['OrderConnection'],
    ParentType,
    ContextType,
    RequireFields<PipelineStageOrdersArgs, 'first' | 'sort' | 'sortField'>
  >
  placeNewOrders?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt'
}

export type PreferenceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Preference'] = ResolversParentTypes['Preference']
> = {
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PreferencesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Preferences'] = ResolversParentTypes['Preferences']
> = {
  experimental?: Resolver<
    Maybe<ResolversTypes['ExperimentalPreferences']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PresignedUploadRequestResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PresignedUploadRequest'] = ResolversParentTypes['PresignedUploadRequest']
> = {
  fields?: Resolver<
    Array<ResolversTypes['UploadField']>,
    ParentType,
    ContextType
  >
  lifetime?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  maxSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Price'] = ResolversParentTypes['Price']
> = {
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  discounts?: Resolver<
    Maybe<Array<ResolversTypes['Discount']>>,
    ParentType,
    ContextType
  >
  gross?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  net?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  tax?: Resolver<Maybe<ResolversTypes['Tax']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceList'] = ResolversParentTypes['PriceList']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  modifierType?: Resolver<
    ResolversTypes['PriceListModifierType'],
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  price?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType,
    RequireFields<PriceListPriceArgs, 'identifier'>
  >
  priceVariants?: Resolver<
    Maybe<Array<ResolversTypes['PriceListPriceVariant']>>,
    ParentType,
    ContextType
  >
  selectedProductVariants?: Resolver<
    ResolversTypes['PriceListSelectedProductVariants'],
    ParentType,
    ContextType
  >
  startDate?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  targetAudience?: Resolver<
    ResolversTypes['PriceListTargetAudience'],
    ParentType,
    ContextType
  >
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceListConnection'] = ResolversParentTypes['PriceListConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['PriceListConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceListConnectionEdge'] = ResolversParentTypes['PriceListConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['PriceList'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceListMutations'] = ResolversParentTypes['PriceListMutations']
> = {
  create?: Resolver<
    ResolversTypes['PriceList'],
    ParentType,
    ContextType,
    RequireFields<PriceListMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<PriceListMutationsDeleteArgs, 'identifier' | 'tenantId'>
  >
  removeSelectedProductVariants?: Resolver<
    ResolversTypes['PriceList'],
    ParentType,
    ContextType,
    RequireFields<
      PriceListMutationsRemoveSelectedProductVariantsArgs,
      'identifier' | 'tenantId' | 'variants'
    >
  >
  update?: Resolver<
    ResolversTypes['PriceList'],
    ParentType,
    ContextType,
    RequireFields<
      PriceListMutationsUpdateArgs,
      'identifier' | 'input' | 'tenantId'
    >
  >
  upsertSelectedProductVariants?: Resolver<
    ResolversTypes['PriceList'],
    ParentType,
    ContextType,
    RequireFields<
      PriceListMutationsUpsertSelectedProductVariantsArgs,
      'identifier' | 'tenantId' | 'variants'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListPriceVariantResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceListPriceVariant'] = ResolversParentTypes['PriceListPriceVariant']
> = {
  decimalPlaces?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  modifier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListProductResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceListProduct'] = ResolversParentTypes['PriceListProduct']
> = {
  priceVariants?: Resolver<
    Maybe<Array<ResolversTypes['PriceListPriceVariant']>>,
    ParentType,
    ContextType
  >
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceListQueries'] = ResolversParentTypes['PriceListQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['PriceList']>,
    ParentType,
    ContextType,
    RequireFields<PriceListQueriesGetArgs, 'identifier' | 'tenantId'>
  >
  getMany?: Resolver<
    Maybe<ResolversTypes['PriceListConnection']>,
    ParentType,
    ContextType,
    RequireFields<PriceListQueriesGetManyArgs, 'first' | 'tenantId'>
  >
  getProductVariants?: Resolver<
    Maybe<ResolversTypes['ProductVariantConnection']>,
    ParentType,
    ContextType,
    RequireFields<
      PriceListQueriesGetProductVariantsArgs,
      'first' | 'identifier' | 'language' | 'tenantId' | 'versionLabel'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListSelectedProductVariantsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceListSelectedProductVariants'] = ResolversParentTypes['PriceListSelectedProductVariants']
> = {
  type?: Resolver<
    Maybe<ResolversTypes['PriceListProductSelectionType']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceListTargetAudienceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceListTargetAudience'] = ResolversParentTypes['PriceListTargetAudience']
> = {
  marketIdentifiers?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
  type?: Resolver<
    ResolversTypes['PriceListTargetAudienceType'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceVariantResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceVariant'] = ResolversParentTypes['PriceVariant']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceVariantMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceVariantMutations'] = ResolversParentTypes['PriceVariantMutations']
> = {
  create?: Resolver<
    ResolversTypes['PriceVariant'],
    ParentType,
    ContextType,
    RequireFields<PriceVariantMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<PriceVariantMutationsDeleteArgs, 'identifier' | 'tenantId'>
  >
  update?: Resolver<
    ResolversTypes['PriceVariant'],
    ParentType,
    ContextType,
    RequireFields<
      PriceVariantMutationsUpdateArgs,
      'identifier' | 'input' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PriceVariantQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PriceVariantQueries'] = ResolversParentTypes['PriceVariantQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['PriceVariant']>,
    ParentType,
    ContextType,
    RequireFields<PriceVariantQueriesGetArgs, 'identifier' | 'tenantId'>
  >
  getMany?: Resolver<
    Maybe<Array<ResolversTypes['PriceVariant']>>,
    ParentType,
    ContextType,
    RequireFields<PriceVariantQueriesGetManyArgs, 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']
> = {
  components?: Resolver<
    Maybe<Array<ResolversTypes['Component']>>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  defaultVariant?: Resolver<
    ResolversTypes['ProductVariant'],
    ParentType,
    ContextType
  >
  externalReference?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  hasVersion?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<ProductHasVersionArgs>
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isSubscriptionOnly?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  isVirtual?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  relatingItems?: Resolver<
    Maybe<Array<ResolversTypes['Item']>>,
    ParentType,
    ContextType
  >
  shape?: Resolver<Maybe<ResolversTypes['Shape']>, ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  topics?: Resolver<
    Maybe<Array<ResolversTypes['Topic']>>,
    ParentType,
    ContextType
  >
  tree?: Resolver<Maybe<ResolversTypes['TreeNode']>, ParentType, ContextType>
  type?: Resolver<ResolversTypes['ItemType'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  variant?: Resolver<
    Maybe<ResolversTypes['ProductVariant']>,
    ParentType,
    ContextType,
    RequireFields<ProductVariantArgs, 'sku'>
  >
  variants?: Resolver<
    Array<ResolversTypes['ProductVariant']>,
    ParentType,
    ContextType
  >
  vatType?: Resolver<Maybe<ResolversTypes['VatType']>, ParentType, ContextType>
  vatTypeId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  version?: Resolver<
    Maybe<ResolversTypes['VersionedRecordInfo']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductMutations'] = ResolversParentTypes['ProductMutations']
> = {
  addVariant?: Resolver<
    ResolversTypes['Product'],
    ParentType,
    ContextType,
    RequireFields<
      ProductMutationsAddVariantArgs,
      'input' | 'language' | 'productId'
    >
  >
  create?: Resolver<
    ResolversTypes['Product'],
    ParentType,
    ContextType,
    RequireFields<ProductMutationsCreateArgs, 'input' | 'language'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<ProductMutationsDeleteArgs, 'id'>
  >
  publish?: Resolver<
    ResolversTypes['PublishInfo'],
    ParentType,
    ContextType,
    RequireFields<
      ProductMutationsPublishArgs,
      'id' | 'includeDescendants' | 'language'
    >
  >
  setDefaultVariant?: Resolver<
    ResolversTypes['Product'],
    ParentType,
    ContextType,
    RequireFields<
      ProductMutationsSetDefaultVariantArgs,
      'language' | 'productId'
    >
  >
  unpublish?: Resolver<
    Maybe<ResolversTypes['PublishInfo']>,
    ParentType,
    ContextType,
    RequireFields<
      ProductMutationsUnpublishArgs,
      'id' | 'includeDescendants' | 'language'
    >
  >
  update?: Resolver<
    ResolversTypes['Product'],
    ParentType,
    ContextType,
    RequireFields<ProductMutationsUpdateArgs, 'id' | 'input' | 'language'>
  >
  updateStock?: Resolver<
    ResolversTypes['ProductStockLocation'],
    ParentType,
    ContextType,
    RequireFields<
      ProductMutationsUpdateStockArgs,
      'productId' | 'sku' | 'stock' | 'stockLocationIdentifier'
    >
  >
  updateVariant?: Resolver<
    ResolversTypes['Product'],
    ParentType,
    ContextType,
    RequireFields<
      ProductMutationsUpdateVariantArgs,
      'input' | 'language' | 'productId'
    >
  >
  updateVariantComponent?: Resolver<
    ResolversTypes['Product'],
    ParentType,
    ContextType,
    RequireFields<
      ProductMutationsUpdateVariantComponentArgs,
      'input' | 'language' | 'productId' | 'sku'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductPriceVariantResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductPriceVariant'] = ResolversParentTypes['ProductPriceVariant']
> = {
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  priceList?: Resolver<
    Maybe<ResolversTypes['ProductVariantPriceList']>,
    ParentType,
    ContextType,
    RequireFields<ProductPriceVariantPriceListArgs, 'identifier'>
  >
  priceLists?: Resolver<
    Maybe<Array<ResolversTypes['ProductVariantPriceList']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductQueries'] = ResolversParentTypes['ProductQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Product']>,
    ParentType,
    ContextType,
    RequireFields<ProductQueriesGetArgs, 'id' | 'language' | 'versionLabel'>
  >
  getVariants?: Resolver<
    Maybe<Array<ResolversTypes['ProductVariant']>>,
    ParentType,
    ContextType,
    RequireFields<
      ProductQueriesGetVariantsArgs,
      'language' | 'tenantId' | 'versionLabel'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductStockLocationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductStockLocation'] = ResolversParentTypes['ProductStockLocation']
> = {
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  settings?: Resolver<
    Maybe<ResolversTypes['StockLocationSettings']>,
    ParentType,
    ContextType
  >
  stock?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscription'] = ResolversParentTypes['ProductSubscription']
> = {
  customer?: Resolver<
    Maybe<ResolversTypes['Customer']>,
    ParentType,
    ContextType
  >
  customerIdentifier?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  initial?: Resolver<
    Maybe<ResolversTypes['ProductSubscriptionPhase']>,
    ParentType,
    ContextType
  >
  item?: Resolver<
    ResolversTypes['ProductSubscriptionItem'],
    ParentType,
    ContextType
  >
  payment?: Resolver<Maybe<ResolversTypes['Payment']>, ParentType, ContextType>
  recurring?: Resolver<
    Maybe<ResolversTypes['ProductSubscriptionPhase']>,
    ParentType,
    ContextType
  >
  status?: Resolver<
    ResolversTypes['ProductSubscriptionStatus'],
    ParentType,
    ContextType
  >
  subscriptionPlan?: Resolver<
    Maybe<ResolversTypes['SubscriptionPlan']>,
    ParentType,
    ContextType
  >
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  usage?: Resolver<
    Maybe<Array<ResolversTypes['ProductSubscriptionUsage']>>,
    ParentType,
    ContextType,
    RequireFields<ProductSubscriptionUsageArgs, 'end' | 'start'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionConnection'] = ResolversParentTypes['ProductSubscriptionConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['ProductSubscriptionConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionConnectionEdge'] = ResolversParentTypes['ProductSubscriptionConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<
    ResolversTypes['ProductSubscription'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionHistoryEventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionHistoryEvent'] = ResolversParentTypes['ProductSubscriptionHistoryEvent']
> = {
  __resolveType: TypeResolveFn<
    | 'ProductSubscriptionHistoryEventCancellation'
    | 'ProductSubscriptionHistoryEventRenewal'
    | 'ProductSubscriptionHistoryEventRenewalDueBroadcast',
    ParentType,
    ContextType
  >
  type?: Resolver<
    ResolversTypes['ProductSubscriptionHistoryEventType'],
    ParentType,
    ContextType
  >
}

export type ProductSubscriptionHistoryEventCancellationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionHistoryEventCancellation'] = ResolversParentTypes['ProductSubscriptionHistoryEventCancellation']
> = {
  activeUntil?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  cancelledAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  deactivated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  type?: Resolver<
    ResolversTypes['ProductSubscriptionHistoryEventType'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionHistoryEventRenewalResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionHistoryEventRenewal'] = ResolversParentTypes['ProductSubscriptionHistoryEventRenewal']
> = {
  activeUntil?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  renewedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  type?: Resolver<
    ResolversTypes['ProductSubscriptionHistoryEventType'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionHistoryEventRenewalDueBroadcastResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionHistoryEventRenewalDueBroadcast'] = ResolversParentTypes['ProductSubscriptionHistoryEventRenewalDueBroadcast']
> = {
  broadcastAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  renewAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  type?: Resolver<
    ResolversTypes['ProductSubscriptionHistoryEventType'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionItem'] = ResolversParentTypes['ProductSubscriptionItem']
> = {
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  quantity?: Resolver<ResolversTypes['NonNegativeInt'], ParentType, ContextType>
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionMutations'] = ResolversParentTypes['ProductSubscriptionMutations']
> = {
  cancel?: Resolver<
    ResolversTypes['ProductSubscription'],
    ParentType,
    ContextType,
    RequireFields<ProductSubscriptionMutationsCancelArgs, 'deactivate' | 'id'>
  >
  create?: Resolver<
    ResolversTypes['ProductSubscription'],
    ParentType,
    ContextType,
    RequireFields<ProductSubscriptionMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType,
    RequireFields<ProductSubscriptionMutationsDeleteArgs, 'id'>
  >
  renew?: Resolver<
    ResolversTypes['ProductSubscription'],
    ParentType,
    ContextType,
    RequireFields<ProductSubscriptionMutationsRenewArgs, 'id'>
  >
  update?: Resolver<
    ResolversTypes['ProductSubscription'],
    ParentType,
    ContextType,
    RequireFields<ProductSubscriptionMutationsUpdateArgs, 'id' | 'input'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionPhaseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionPhase'] = ResolversParentTypes['ProductSubscriptionPhase']
> = {
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  unit?: Resolver<
    ResolversTypes['SubscriptionPeriodUnit'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionQueries'] = ResolversParentTypes['ProductSubscriptionQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['ProductSubscription']>,
    ParentType,
    ContextType,
    RequireFields<ProductSubscriptionQueriesGetArgs, 'id'>
  >
  getMany?: Resolver<
    Maybe<ResolversTypes['ProductSubscriptionConnection']>,
    ParentType,
    ContextType,
    RequireFields<
      ProductSubscriptionQueriesGetManyArgs,
      'first' | 'sort' | 'sortField' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionStatusResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionStatus'] = ResolversParentTypes['ProductSubscriptionStatus']
> = {
  activeUntil?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  renewAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductSubscriptionUsageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductSubscriptionUsage'] = ResolversParentTypes['ProductSubscriptionUsage']
> = {
  meteredVariableId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  quantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariant'] = ResolversParentTypes['ProductVariant']
> = {
  attributes?: Resolver<
    Maybe<Array<ResolversTypes['ProductVariantAttribute']>>,
    ParentType,
    ContextType
  >
  components?: Resolver<
    Maybe<Array<ResolversTypes['Component']>>,
    ParentType,
    ContextType
  >
  externalReference?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  images?: Resolver<
    Maybe<Array<ResolversTypes['Image']>>,
    ParentType,
    ContextType
  >
  isDefault?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  price?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType,
    RequireFields<ProductVariantPriceArgs, 'identifier'>
  >
  priceVariants?: Resolver<
    Maybe<Array<ResolversTypes['ProductPriceVariant']>>,
    ParentType,
    ContextType
  >
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  stock?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType,
    RequireFields<ProductVariantStockArgs, 'identifier'>
  >
  stockLocations?: Resolver<
    Maybe<Array<ResolversTypes['ProductStockLocation']>>,
    ParentType,
    ContextType
  >
  subscriptionPlans?: Resolver<
    Maybe<Array<ResolversTypes['ProductVariantSubscriptionPlan']>>,
    ParentType,
    ContextType
  >
  videos?: Resolver<
    Maybe<Array<ResolversTypes['Video']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantAttributeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantAttribute'] = ResolversParentTypes['ProductVariantAttribute']
> = {
  attribute?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantConnection'] = ResolversParentTypes['ProductVariantConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['ProductVariantConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantConnectionEdge'] = ResolversParentTypes['ProductVariantConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantPriceListResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantPriceList'] = ResolversParentTypes['ProductVariantPriceList']
> = {
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  modifier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  modifierType?: Resolver<
    ResolversTypes['PriceListModifierType'],
    ParentType,
    ContextType
  >
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  startDate?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantSubscriptionMeteredVariableResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantSubscriptionMeteredVariable'] = ResolversParentTypes['ProductVariantSubscriptionMeteredVariable']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tierType?: Resolver<ResolversTypes['TierType'], ParentType, ContextType>
  tiers?: Resolver<
    Array<ResolversTypes['ProductVariantSubscriptionPlanTier']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantSubscriptionPlanResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantSubscriptionPlan'] = ResolversParentTypes['ProductVariantSubscriptionPlan']
> = {
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  periods?: Resolver<
    Array<ResolversTypes['ProductVariantSubscriptionPlanPeriod']>,
    ParentType,
    ContextType
  >
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantSubscriptionPlanPeriodResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantSubscriptionPlanPeriod'] = ResolversParentTypes['ProductVariantSubscriptionPlanPeriod']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  initial?: Resolver<
    Maybe<ResolversTypes['ProductVariantSubscriptionPlanPricing']>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  recurring?: Resolver<
    Maybe<ResolversTypes['ProductVariantSubscriptionPlanPricing']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantSubscriptionPlanPricingResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantSubscriptionPlanPricing'] = ResolversParentTypes['ProductVariantSubscriptionPlanPricing']
> = {
  meteredVariables?: Resolver<
    Maybe<Array<ResolversTypes['ProductVariantSubscriptionMeteredVariable']>>,
    ParentType,
    ContextType
  >
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  price?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType,
    RequireFields<ProductVariantSubscriptionPlanPricingPriceArgs, 'identifier'>
  >
  priceVariants?: Resolver<
    Maybe<Array<ResolversTypes['ProductPriceVariant']>>,
    ParentType,
    ContextType
  >
  unit?: Resolver<
    ResolversTypes['SubscriptionPeriodUnit'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProductVariantSubscriptionPlanTierResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ProductVariantSubscriptionPlanTier'] = ResolversParentTypes['ProductVariantSubscriptionPlanTier']
> = {
  price?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType,
    RequireFields<ProductVariantSubscriptionPlanTierPriceArgs, 'identifier'>
  >
  priceVariants?: Resolver<
    Maybe<Array<ResolversTypes['ProductPriceVariant']>>,
    ParentType,
    ContextType
  >
  threshold?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PropertiesTableComponentConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PropertiesTableComponentConfig'] = ResolversParentTypes['PropertiesTableComponentConfig']
> = {
  sections?: Resolver<
    Array<ResolversTypes['PropertiesTableComponentConfigSection']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PropertiesTableComponentConfigSectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PropertiesTableComponentConfigSection'] = ResolversParentTypes['PropertiesTableComponentConfigSection']
> = {
  keys?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PropertiesTableComponentSectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PropertiesTableComponentSection'] = ResolversParentTypes['PropertiesTableComponentSection']
> = {
  properties?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PropertiesTableContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PropertiesTableContent'] = ResolversParentTypes['PropertiesTableContent']
> = {
  sections?: Resolver<
    Maybe<Array<ResolversTypes['PropertiesTableComponentSection']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PublishInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PublishInfo'] = ResolversParentTypes['PublishInfo']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  versionId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  app?: Resolver<ResolversTypes['AppQueries'], ParentType, ContextType>
  currencySummary?: Resolver<
    Maybe<ResolversTypes['CurrencySummaryReport']>,
    ParentType,
    ContextType
  >
  customer?: Resolver<
    ResolversTypes['CustomerQueries'],
    ParentType,
    ContextType
  >
  document?: Resolver<
    ResolversTypes['DocumentQueries'],
    ParentType,
    ContextType
  >
  file?: Resolver<ResolversTypes['FileQueries'], ParentType, ContextType>
  folder?: Resolver<ResolversTypes['FolderQueries'], ParentType, ContextType>
  grid?: Resolver<ResolversTypes['GridQueries'], ParentType, ContextType>
  image?: Resolver<ResolversTypes['ImageQueries'], ParentType, ContextType>
  item?: Resolver<ResolversTypes['ItemQueries'], ParentType, ContextType>
  market?: Resolver<ResolversTypes['MarketQueries'], ParentType, ContextType>
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  order?: Resolver<ResolversTypes['OrderQueries'], ParentType, ContextType>
  pipeline?: Resolver<
    ResolversTypes['PipelineQueries'],
    ParentType,
    ContextType
  >
  priceList?: Resolver<
    ResolversTypes['PriceListQueries'],
    ParentType,
    ContextType
  >
  priceVariant?: Resolver<
    ResolversTypes['PriceVariantQueries'],
    ParentType,
    ContextType
  >
  product?: Resolver<ResolversTypes['ProductQueries'], ParentType, ContextType>
  productSubscription?: Resolver<
    ResolversTypes['ProductSubscriptionQueries'],
    ParentType,
    ContextType
  >
  report?: Resolver<
    Maybe<ResolversTypes['TenantReports']>,
    ParentType,
    ContextType
  >
  search?: Resolver<
    Maybe<ResolversTypes['SearchQueries']>,
    ParentType,
    ContextType
  >
  shape?: Resolver<ResolversTypes['ShapeQueries'], ParentType, ContextType>
  stockLocation?: Resolver<
    ResolversTypes['StockLocationQueries'],
    ParentType,
    ContextType
  >
  subscriptionContract?: Resolver<
    ResolversTypes['SubscriptionContractQueries'],
    ParentType,
    ContextType
  >
  subscriptionContractEvent?: Resolver<
    Maybe<ResolversTypes['SubscriptionContractEventQueries']>,
    ParentType,
    ContextType
  >
  subscriptionPlan?: Resolver<
    ResolversTypes['SubscriptionPlanQueries'],
    ParentType,
    ContextType
  >
  tenant?: Resolver<ResolversTypes['TenantQueries'], ParentType, ContextType>
  topic?: Resolver<ResolversTypes['TopicQueries'], ParentType, ContextType>
  tree?: Resolver<ResolversTypes['TreeQueries'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['UserQueries'], ParentType, ContextType>
  version?: Resolver<
    Maybe<ResolversTypes['VersionedServices']>,
    ParentType,
    ContextType
  >
  webhook?: Resolver<ResolversTypes['WebhookQueries'], ParentType, ContextType>
}

export type ReportMetricResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ReportMetric'] = ResolversParentTypes['ReportMetric']
> = {
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  product?: Resolver<
    Maybe<ResolversTypes['Product']>,
    ParentType,
    ContextType,
    RequireFields<ReportMetricProductArgs, 'language'>
  >
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type RichTextContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RichTextContent'] = ResolversParentTypes['RichTextContent']
> = {
  html?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
  json?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['JSON']>>>,
    ParentType,
    ContextType
  >
  plainText?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SalesReportResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SalesReport'] = ResolversParentTypes['SalesReport']
> = {
  avg?: Resolver<
    Array<Maybe<ResolversTypes['ReportMetric']>>,
    ParentType,
    ContextType,
    RequireFields<
      SalesReportAvgArgs,
      'direction' | 'groupBy' | 'orderBy' | 'resolution'
    >
  >
  sum?: Resolver<
    Array<Maybe<ResolversTypes['ReportMetric']>>,
    ParentType,
    ContextType,
    RequireFields<
      SalesReportSumArgs,
      'direction' | 'groupBy' | 'orderBy' | 'resolution'
    >
  >
  total?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType,
    Partial<SalesReportTotalArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SearchQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SearchQueries'] = ResolversParentTypes['SearchQueries']
> = {
  suggest?: Resolver<
    Maybe<ResolversTypes['SuggestSearchConnection']>,
    ParentType,
    ContextType,
    RequireFields<SearchQueriesSuggestArgs, 'language' | 'tenantId'>
  >
  topics?: Resolver<
    Maybe<ResolversTypes['TopicSearchConnection']>,
    ParentType,
    ContextType,
    RequireFields<SearchQueriesTopicsArgs, 'language' | 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SelectionComponentConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SelectionComponentConfig'] = ResolversParentTypes['SelectionComponentConfig']
> = {
  max?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  min?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  options?: Resolver<
    Array<ResolversTypes['SelectionComponentOptionConfig']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SelectionComponentOptionConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SelectionComponentOptionConfig'] = ResolversParentTypes['SelectionComponentOptionConfig']
> = {
  isPreselected?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SelectionContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SelectionContent'] = ResolversParentTypes['SelectionContent']
> = {
  options?: Resolver<
    Array<ResolversTypes['KeyValuePair']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ShapeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Shape'] = ResolversParentTypes['Shape']
> = {
  components?: Resolver<
    Maybe<Array<ResolversTypes['ShapeComponent']>>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  itemCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  items?: Resolver<
    Maybe<Array<ResolversTypes['Item']>>,
    ParentType,
    ContextType,
    RequireFields<ShapeItemsArgs, 'language'>
  >
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<ShapeMetaPropertyArgs, 'key'>
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['ShapeType'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  variantComponents?: Resolver<
    Maybe<Array<ResolversTypes['ShapeComponent']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ShapeComponentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ShapeComponent'] = ResolversParentTypes['ShapeComponent']
> = {
  config?: Resolver<
    Maybe<ResolversTypes['ComponentConfig']>,
    ParentType,
    ContextType
  >
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['ComponentType'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ShapeMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ShapeMetrics'] = ResolversParentTypes['ShapeMetrics']
> = {
  count?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<ShapeMetricsCountArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ShapeMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ShapeMutations'] = ResolversParentTypes['ShapeMutations']
> = {
  create?: Resolver<
    ResolversTypes['Shape'],
    ParentType,
    ContextType,
    RequireFields<ShapeMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<ShapeMutationsDeleteArgs>
  >
  migrateLegacyId?: Resolver<
    ResolversTypes['Shape'],
    ParentType,
    ContextType,
    RequireFields<
      ShapeMutationsMigrateLegacyIdArgs,
      'id' | 'identifier' | 'tenantId'
    >
  >
  update?: Resolver<
    ResolversTypes['Shape'],
    ParentType,
    ContextType,
    RequireFields<ShapeMutationsUpdateArgs, 'input'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ShapeQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ShapeQueries'] = ResolversParentTypes['ShapeQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Shape']>,
    ParentType,
    ContextType,
    Partial<ShapeQueriesGetArgs>
  >
  getMany?: Resolver<
    Maybe<Array<ResolversTypes['Shape']>>,
    ParentType,
    ContextType,
    RequireFields<ShapeQueriesGetManyArgs, 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SingleLineContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SingleLineContent'] = ResolversParentTypes['SingleLineContent']
> = {
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StockLocationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['StockLocation'] = ResolversParentTypes['StockLocation']
> = {
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  settings?: Resolver<
    ResolversTypes['StockLocationSettings'],
    ParentType,
    ContextType
  >
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StockLocationMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['StockLocationMutations'] = ResolversParentTypes['StockLocationMutations']
> = {
  create?: Resolver<
    ResolversTypes['StockLocation'],
    ParentType,
    ContextType,
    RequireFields<StockLocationMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<StockLocationMutationsDeleteArgs, 'identifier' | 'tenantId'>
  >
  update?: Resolver<
    ResolversTypes['StockLocation'],
    ParentType,
    ContextType,
    RequireFields<
      StockLocationMutationsUpdateArgs,
      'identifier' | 'input' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StockLocationQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['StockLocationQueries'] = ResolversParentTypes['StockLocationQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['StockLocation']>,
    ParentType,
    ContextType,
    RequireFields<StockLocationQueriesGetArgs, 'identifier' | 'tenantId'>
  >
  getMany?: Resolver<
    Maybe<Array<ResolversTypes['StockLocation']>>,
    ParentType,
    ContextType,
    RequireFields<StockLocationQueriesGetManyArgs, 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StockLocationSettingsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['StockLocationSettings'] = ResolversParentTypes['StockLocationSettings']
> = {
  minimum?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  unlimited?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type StripePaymentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['StripePayment'] = ResolversParentTypes['StripePayment']
> = {
  customerId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  orderId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  paymentIntentId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  paymentMethod?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  paymentMethodId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  provider?: Resolver<
    ResolversTypes['PaymentProvider'],
    ParentType,
    ContextType
  >
  subscriptionId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContract'] = ResolversParentTypes['SubscriptionContract']
> = {
  addresses?: Resolver<
    Maybe<Array<ResolversTypes['SubscriptionContractAddress']>>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  customer?: Resolver<
    Maybe<ResolversTypes['Customer']>,
    ParentType,
    ContextType
  >
  customerIdentifier?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  initial?: Resolver<
    Maybe<ResolversTypes['SubscriptionContractPhase']>,
    ParentType,
    ContextType
  >
  item?: Resolver<
    ResolversTypes['SubscriptionContractItem'],
    ParentType,
    ContextType
  >
  payment?: Resolver<Maybe<ResolversTypes['Payment']>, ParentType, ContextType>
  recurring?: Resolver<
    Maybe<ResolversTypes['SubscriptionContractPhase']>,
    ParentType,
    ContextType
  >
  status?: Resolver<
    ResolversTypes['SubscriptionContractStatus'],
    ParentType,
    ContextType
  >
  subscriptionPlan?: Resolver<
    Maybe<ResolversTypes['SubscriptionPlan']>,
    ParentType,
    ContextType
  >
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  usage?: Resolver<
    Maybe<Array<ResolversTypes['SubscriptionContractUsage']>>,
    ParentType,
    ContextType,
    RequireFields<SubscriptionContractUsageArgs, 'end' | 'start'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractAddressResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractAddress'] = ResolversParentTypes['SubscriptionContractAddress']
> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  email?: Resolver<
    Maybe<ResolversTypes['EmailAddress']>,
    ParentType,
    ContextType
  >
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  middleName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  postalCode?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  street2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  streetNumber?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  type?: Resolver<ResolversTypes['AddressType'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractCancelledEventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractCancelledEvent'] = ResolversParentTypes['SubscriptionContractCancelledEvent']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<
    ResolversTypes['SubscriptionContractEventType'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractConnection'] = ResolversParentTypes['SubscriptionContractConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['SubscriptionContractConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractConnectionEdge'] = ResolversParentTypes['SubscriptionContractConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<
    ResolversTypes['SubscriptionContract'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractEventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractEvent'] = ResolversParentTypes['SubscriptionContractEvent']
> = {
  __resolveType: TypeResolveFn<
    | 'SubscriptionContractCancelledEvent'
    | 'SubscriptionContractRenewalDueBroadcastEvent'
    | 'SubscriptionContractRenewedEvent'
    | 'SubscriptionContractUsageTrackedEvent',
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<
    ResolversTypes['SubscriptionContractEventType'],
    ParentType,
    ContextType
  >
}

export type SubscriptionContractEventConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractEventConnection'] = ResolversParentTypes['SubscriptionContractEventConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['SubscriptionContractEventConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractEventConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractEventConnectionEdge'] = ResolversParentTypes['SubscriptionContractEventConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<
    ResolversTypes['SubscriptionContractEvent'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractEventQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractEventQueries'] = ResolversParentTypes['SubscriptionContractEventQueries']
> = {
  getMany?: Resolver<
    Maybe<ResolversTypes['SubscriptionContractEventConnection']>,
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionContractEventQueriesGetManyArgs,
      'first' | 'sort' | 'subscriptionContractId' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractItem'] = ResolversParentTypes['SubscriptionContractItem']
> = {
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractMeteredVariableReferenceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractMeteredVariableReference'] = ResolversParentTypes['SubscriptionContractMeteredVariableReference']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  tierType?: Resolver<
    Maybe<ResolversTypes['TierType']>,
    ParentType,
    ContextType
  >
  tiers?: Resolver<
    Array<ResolversTypes['SubscriptionContractMeteredVariableTierReference']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractMeteredVariableTierReferenceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractMeteredVariableTierReference'] = ResolversParentTypes['SubscriptionContractMeteredVariableTierReference']
> = {
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  threshold?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractMutations'] = ResolversParentTypes['SubscriptionContractMutations']
> = {
  cancel?: Resolver<
    ResolversTypes['SubscriptionContract'],
    ParentType,
    ContextType,
    RequireFields<SubscriptionContractMutationsCancelArgs, 'deactivate' | 'id'>
  >
  create?: Resolver<
    ResolversTypes['SubscriptionContract'],
    ParentType,
    ContextType,
    RequireFields<SubscriptionContractMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType,
    RequireFields<SubscriptionContractMutationsDeleteArgs, 'id'>
  >
  renew?: Resolver<
    ResolversTypes['SubscriptionContract'],
    ParentType,
    ContextType,
    RequireFields<SubscriptionContractMutationsRenewArgs, 'id'>
  >
  trackUsage?: Resolver<
    ResolversTypes['SubscriptionContractUsageTrackedEvent'],
    ParentType,
    ContextType,
    RequireFields<SubscriptionContractMutationsTrackUsageArgs, 'id' | 'input'>
  >
  update?: Resolver<
    ResolversTypes['SubscriptionContract'],
    ParentType,
    ContextType,
    RequireFields<SubscriptionContractMutationsUpdateArgs, 'id' | 'input'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractPhaseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractPhase'] = ResolversParentTypes['SubscriptionContractPhase']
> = {
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  meteredVariables?: Resolver<
    Maybe<
      Array<ResolversTypes['SubscriptionContractMeteredVariableReference']>
    >,
    ParentType,
    ContextType
  >
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  unit?: Resolver<
    ResolversTypes['SubscriptionPeriodUnit'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractQueries'] = ResolversParentTypes['SubscriptionContractQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['SubscriptionContract']>,
    ParentType,
    ContextType,
    RequireFields<SubscriptionContractQueriesGetArgs, 'id'>
  >
  getMany?: Resolver<
    Maybe<ResolversTypes['SubscriptionContractConnection']>,
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionContractQueriesGetManyArgs,
      'first' | 'sort' | 'sortField' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractRenewalDueBroadcastEventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractRenewalDueBroadcastEvent'] = ResolversParentTypes['SubscriptionContractRenewalDueBroadcastEvent']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  data?: Resolver<
    ResolversTypes['SubscriptionContractRenewalDueBroadcastEventData'],
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<
    ResolversTypes['SubscriptionContractEventType'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractRenewalDueBroadcastEventDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractRenewalDueBroadcastEventData'] = ResolversParentTypes['SubscriptionContractRenewalDueBroadcastEventData']
> = {
  broadcastAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  renewAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractRenewedEventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractRenewedEvent'] = ResolversParentTypes['SubscriptionContractRenewedEvent']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<
    ResolversTypes['SubscriptionContractEventType'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractStatusResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractStatus'] = ResolversParentTypes['SubscriptionContractStatus']
> = {
  activeUntil?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  renewAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractUsageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractUsage'] = ResolversParentTypes['SubscriptionContractUsage']
> = {
  meteredVariableId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  quantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractUsageTrackedDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractUsageTrackedData'] = ResolversParentTypes['SubscriptionContractUsageTrackedData']
> = {
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  idempotencyKey?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  meteredVariableId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionContractUsageTrackedEventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionContractUsageTrackedEvent'] = ResolversParentTypes['SubscriptionContractUsageTrackedEvent']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  data?: Resolver<
    Maybe<ResolversTypes['SubscriptionContractUsageTrackedData']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<
    ResolversTypes['SubscriptionContractEventType'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionPlanResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionPlan'] = ResolversParentTypes['SubscriptionPlan']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  meteredVariables?: Resolver<
    Maybe<Array<ResolversTypes['SubscriptionPlanMeteredVariable']>>,
    ParentType,
    ContextType
  >
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  periods?: Resolver<
    Maybe<Array<ResolversTypes['SubscriptionPlanPeriod']>>,
    ParentType,
    ContextType
  >
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionPlanMeteredVariableResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionPlanMeteredVariable'] = ResolversParentTypes['SubscriptionPlanMeteredVariable']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionPlanMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionPlanMutations'] = ResolversParentTypes['SubscriptionPlanMutations']
> = {
  create?: Resolver<
    ResolversTypes['SubscriptionPlan'],
    ParentType,
    ContextType,
    RequireFields<SubscriptionPlanMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionPlanMutationsDeleteArgs,
      'identifier' | 'tenantId'
    >
  >
  update?: Resolver<
    ResolversTypes['SubscriptionPlan'],
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionPlanMutationsUpdateArgs,
      'identifier' | 'input' | 'tenantId'
    >
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionPlanPeriodResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionPlanPeriod'] = ResolversParentTypes['SubscriptionPlanPeriod']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  initial?: Resolver<
    Maybe<ResolversTypes['SubscriptionPlanPhase']>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  recurring?: Resolver<
    ResolversTypes['SubscriptionPlanPhase'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionPlanPhaseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionPlanPhase'] = ResolversParentTypes['SubscriptionPlanPhase']
> = {
  period?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  unit?: Resolver<
    ResolversTypes['SubscriptionPeriodUnit'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionPlanQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubscriptionPlanQueries'] = ResolversParentTypes['SubscriptionPlanQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['SubscriptionPlan']>,
    ParentType,
    ContextType,
    RequireFields<SubscriptionPlanQueriesGetArgs, 'identifier' | 'tenantId'>
  >
  getMany?: Resolver<
    Maybe<Array<ResolversTypes['SubscriptionPlan']>>,
    ParentType,
    ContextType,
    RequireFields<SubscriptionPlanQueriesGetManyArgs, 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SuggestSearchAggregationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SuggestSearchAggregations'] = ResolversParentTypes['SuggestSearchAggregations']
> = {
  totalResults?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  typesAggregation?: Resolver<
    Array<ResolversTypes['SuggestSearchTypesAggregation']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SuggestSearchConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SuggestSearchConnection'] = ResolversParentTypes['SuggestSearchConnection']
> = {
  aggregations?: Resolver<
    ResolversTypes['SuggestSearchAggregations'],
    ParentType,
    ContextType
  >
  edges?: Resolver<
    Maybe<Array<ResolversTypes['SuggestSearchConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SuggestSearchConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SuggestSearchConnectionEdge'] = ResolversParentTypes['SuggestSearchConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<
    ResolversTypes['SuggestSearchResult'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SuggestSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SuggestSearchResult'] = ResolversParentTypes['SuggestSearchResult']
> = {
  __resolveType: TypeResolveFn<
    'GenericSuggestSearchResult' | 'ItemSuggestSearchResult',
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export type SuggestSearchTypesAggregationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SuggestSearchTypesAggregation'] = ResolversParentTypes['SuggestSearchTypesAggregation']
> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TaxResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Tax'] = ResolversParentTypes['Tax']
> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  percent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Tenant'] = ResolversParentTypes['Tenant']
> = {
  authenticationMethod?: Resolver<
    Maybe<ResolversTypes['TenantAuthenticationMethod']>,
    ParentType,
    ContextType
  >
  availableLanguages?: Resolver<
    Maybe<Array<ResolversTypes['Language']>>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  defaults?: Resolver<ResolversTypes['TenantDefaults'], ParentType, ContextType>
  grids?: Resolver<
    Maybe<Array<ResolversTypes['Grid']>>,
    ParentType,
    ContextType,
    RequireFields<TenantGridsArgs, 'language' | 'versionLabel'>
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isTrial?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  logo?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  meta?: Resolver<
    Maybe<Array<ResolversTypes['KeyValuePair']>>,
    ParentType,
    ContextType
  >
  metaProperty?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<TenantMetaPropertyArgs, 'key'>
  >
  metrics?: Resolver<
    Maybe<ResolversTypes['TenantMetrics']>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  preferences?: Resolver<
    Maybe<ResolversTypes['TenantPreferences']>,
    ParentType,
    ContextType
  >
  rootItemId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  shapes?: Resolver<
    Maybe<Array<ResolversTypes['Shape']>>,
    ParentType,
    ContextType
  >
  signatureSecret?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  staticAuthToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  topics?: Resolver<
    Maybe<Array<ResolversTypes['Topic']>>,
    ParentType,
    ContextType,
    RequireFields<TenantTopicsArgs, 'language'>
  >
  tree?: Resolver<
    Maybe<Array<ResolversTypes['TreeNode']>>,
    ParentType,
    ContextType,
    Partial<TenantTreeArgs>
  >
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  users?: Resolver<
    Maybe<Array<ResolversTypes['UserTenantRole']>>,
    ParentType,
    ContextType
  >
  vatTypes?: Resolver<
    Maybe<Array<ResolversTypes['VatType']>>,
    ParentType,
    ContextType
  >
  webhooks?: Resolver<
    Maybe<Array<ResolversTypes['Webhook']>>,
    ParentType,
    ContextType,
    Partial<TenantWebhooksArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantAuthenticationMethodResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantAuthenticationMethod'] = ResolversParentTypes['TenantAuthenticationMethod']
> = {
  catalogue?: Resolver<
    Maybe<ResolversTypes['AuthenticationMethod']>,
    ParentType,
    ContextType
  >
  search?: Resolver<
    Maybe<ResolversTypes['AuthenticationMethod']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantDefaultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantDefaults'] = ResolversParentTypes['TenantDefaults']
> = {
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantFrontendResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantFrontend'] = ResolversParentTypes['TenantFrontend']
> = {
  authentication?: Resolver<
    Maybe<ResolversTypes['TenantFrontendAuthentication']>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  responsive?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantFrontendAuthenticationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantFrontendAuthentication'] = ResolversParentTypes['TenantFrontendAuthentication']
> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantMetrics'] = ResolversParentTypes['TenantMetrics']
> = {
  apiCalls?: Resolver<ResolversTypes['ApiCallMetrics'], ParentType, ContextType>
  bandwidth?: Resolver<
    ResolversTypes['BandwidthUsageMetrics'],
    ParentType,
    ContextType
  >
  items?: Resolver<ResolversTypes['ItemMetrics'], ParentType, ContextType>
  orders?: Resolver<ResolversTypes['OrderMetrics'], ParentType, ContextType>
  shapes?: Resolver<ResolversTypes['ShapeMetrics'], ParentType, ContextType>
  users?: Resolver<ResolversTypes['UserMetrics'], ParentType, ContextType>
  webhooks?: Resolver<ResolversTypes['WebhookMetrics'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantMutations'] = ResolversParentTypes['TenantMutations']
> = {
  addUsers?: Resolver<
    Array<ResolversTypes['UserTenantRole']>,
    ParentType,
    ContextType,
    RequireFields<TenantMutationsAddUsersArgs, 'roles' | 'tenantId'>
  >
  create?: Resolver<
    ResolversTypes['Tenant'],
    ParentType,
    ContextType,
    RequireFields<TenantMutationsCreateArgs, 'input'>
  >
  createCopyTask?: Resolver<
    ResolversTypes['BulkTaskTenantCopyInfo'],
    ParentType,
    ContextType,
    RequireFields<
      TenantMutationsCreateCopyTaskArgs,
      'desiredIdentifier' | 'overwrite' | 'tenantId'
    >
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<TenantMutationsDeleteArgs, 'id'>
  >
  regenerateSecrets?: Resolver<
    ResolversTypes['Tenant'],
    ParentType,
    ContextType,
    RequireFields<TenantMutationsRegenerateSecretsArgs, 'tenantId'>
  >
  regenerateStaticAuthToken?: Resolver<
    ResolversTypes['Tenant'],
    ParentType,
    ContextType,
    RequireFields<TenantMutationsRegenerateStaticAuthTokenArgs, 'tenantId'>
  >
  removeUsers?: Resolver<
    Maybe<Array<ResolversTypes['UserTenantRole']>>,
    ParentType,
    ContextType,
    RequireFields<TenantMutationsRemoveUsersArgs, 'tenantId' | 'userIds'>
  >
  setAuthenticationMethod?: Resolver<
    ResolversTypes['Tenant'],
    ParentType,
    ContextType,
    RequireFields<TenantMutationsSetAuthenticationMethodArgs, 'tenantId'>
  >
  setPreferences?: Resolver<
    ResolversTypes['TenantPreferences'],
    ParentType,
    ContextType,
    RequireFields<TenantMutationsSetPreferencesArgs, 'input' | 'tenantId'>
  >
  update?: Resolver<
    ResolversTypes['Tenant'],
    ParentType,
    ContextType,
    RequireFields<TenantMutationsUpdateArgs, 'id' | 'input'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantPreferencesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantPreferences'] = ResolversParentTypes['TenantPreferences']
> = {
  frontends?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['TenantFrontend']>>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantQueries'] = ResolversParentTypes['TenantQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Tenant']>,
    ParentType,
    ContextType,
    Partial<TenantQueriesGetArgs>
  >
  getMany?: Resolver<
    Maybe<Array<ResolversTypes['Tenant']>>,
    ParentType,
    ContextType,
    Partial<TenantQueriesGetManyArgs>
  >
  getRootTopics?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Topic']>>>,
    ParentType,
    ContextType,
    RequireFields<TenantQueriesGetRootTopicsArgs, 'language' | 'tenantId'>
  >
  suggestIdentifier?: Resolver<
    ResolversTypes['IdentifierSuggestion'],
    ParentType,
    ContextType,
    RequireFields<TenantQueriesSuggestIdentifierArgs, 'desired'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TenantReportsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TenantReports'] = ResolversParentTypes['TenantReports']
> = {
  orders?: Resolver<
    ResolversTypes['OrdersReport'],
    ParentType,
    ContextType,
    RequireFields<TenantReportsOrdersArgs, 'currency' | 'tenantId'>
  >
  sales?: Resolver<
    ResolversTypes['SalesReport'],
    ParentType,
    ContextType,
    RequireFields<TenantReportsSalesArgs, 'currency' | 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Topic'] = ResolversParentTypes['Topic']
> = {
  ancestors?: Resolver<
    Maybe<Array<ResolversTypes['Topic']>>,
    ParentType,
    ContextType
  >
  childCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  children?: Resolver<
    Maybe<Array<ResolversTypes['Topic']>>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  descendants?: Resolver<
    Maybe<Array<ResolversTypes['Topic']>>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  items?: Resolver<
    Maybe<Array<ResolversTypes['Item']>>,
    ParentType,
    ContextType
  >
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  parent?: Resolver<Maybe<ResolversTypes['Topic']>, ParentType, ContextType>
  parentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicConnection'] = ResolversParentTypes['TopicConnection']
> = {
  edges?: Resolver<
    Maybe<Array<ResolversTypes['TopicConnectionEdge']>>,
    ParentType,
    ContextType
  >
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicConnectionEdge'] = ResolversParentTypes['TopicConnectionEdge']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['Topic'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicImagesModifiedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicImagesModified'] = ResolversParentTypes['TopicImagesModified']
> = {
  modified?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicItemsModifiedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicItemsModified'] = ResolversParentTypes['TopicItemsModified']
> = {
  modified?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicMutations'] = ResolversParentTypes['TopicMutations']
> = {
  addImages?: Resolver<
    ResolversTypes['TopicImagesModified'],
    ParentType,
    ContextType,
    RequireFields<TopicMutationsAddImagesArgs, 'imageKeys' | 'topicId'>
  >
  addItems?: Resolver<
    ResolversTypes['TopicItemsModified'],
    ParentType,
    ContextType,
    RequireFields<TopicMutationsAddItemsArgs, 'itemIds' | 'topicId'>
  >
  bulkCreate?: Resolver<
    Array<ResolversTypes['Topic']>,
    ParentType,
    ContextType,
    RequireFields<
      TopicMutationsBulkCreateArgs,
      'input' | 'language' | 'tenantId'
    >
  >
  create?: Resolver<
    ResolversTypes['Topic'],
    ParentType,
    ContextType,
    RequireFields<TopicMutationsCreateArgs, 'input' | 'language'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<TopicMutationsDeleteArgs, 'id'>
  >
  removeImages?: Resolver<
    ResolversTypes['TopicImagesModified'],
    ParentType,
    ContextType,
    RequireFields<TopicMutationsRemoveImagesArgs, 'imageKeys' | 'topicId'>
  >
  removeItems?: Resolver<
    ResolversTypes['TopicItemsModified'],
    ParentType,
    ContextType,
    RequireFields<TopicMutationsRemoveItemsArgs, 'itemIds' | 'topicId'>
  >
  update?: Resolver<
    ResolversTypes['Topic'],
    ParentType,
    ContextType,
    RequireFields<TopicMutationsUpdateArgs, 'id' | 'input' | 'language'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicQueries'] = ResolversParentTypes['TopicQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Topic']>,
    ParentType,
    ContextType,
    RequireFields<TopicQueriesGetArgs, 'language'>
  >
  getRootTopics?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Topic']>>>,
    ParentType,
    ContextType,
    RequireFields<TopicQueriesGetRootTopicsArgs, 'language' | 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicSearchAggregationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicSearchAggregations'] = ResolversParentTypes['TopicSearchAggregations']
> = {
  totalResults?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicSearchConnectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicSearchConnection'] = ResolversParentTypes['TopicSearchConnection']
> = {
  aggregations?: Resolver<
    ResolversTypes['TopicSearchAggregations'],
    ParentType,
    ContextType
  >
  edges?: Resolver<
    Maybe<Array<ResolversTypes['TopicSearchConnectionEdge']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicSearchConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicSearchConnectionEdge'] = ResolversParentTypes['TopicSearchConnectionEdge']
> = {
  node?: Resolver<ResolversTypes['TopicSearchResult'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TopicSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TopicSearchResult'] = ResolversParentTypes['TopicSearchResult']
> = {
  display?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TreeMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TreeMutations'] = ResolversParentTypes['TreeMutations']
> = {
  createNode?: Resolver<
    ResolversTypes['TreeNode'],
    ParentType,
    ContextType,
    RequireFields<TreeMutationsCreateNodeArgs, 'input'>
  >
  deleteNode?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<TreeMutationsDeleteNodeArgs, 'itemId'>
  >
  moveNode?: Resolver<
    ResolversTypes['TreeNode'],
    ParentType,
    ContextType,
    RequireFields<TreeMutationsMoveNodeArgs, 'input' | 'itemId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TreeNodeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TreeNode'] = ResolversParentTypes['TreeNode']
> = {
  ancestors?: Resolver<
    Maybe<Array<ResolversTypes['TreeNode']>>,
    ParentType,
    ContextType
  >
  childCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  children?: Resolver<
    Maybe<Array<ResolversTypes['TreeNode']>>,
    ParentType,
    ContextType
  >
  identifiers?: Resolver<
    Maybe<Array<ResolversTypes['TreeNodeIdentifier']>>,
    ParentType,
    ContextType
  >
  item?: Resolver<
    Maybe<ResolversTypes['Item']>,
    ParentType,
    ContextType,
    Partial<TreeNodeItemArgs>
  >
  itemId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  parent?: Resolver<Maybe<ResolversTypes['TreeNode']>, ParentType, ContextType>
  parentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  path?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<TreeNodePathArgs>
  >
  position?: Resolver<
    Maybe<ResolversTypes['PositiveInt']>,
    ParentType,
    ContextType
  >
  siblings?: Resolver<
    Maybe<Array<ResolversTypes['TreeNode']>>,
    ParentType,
    ContextType
  >
  versionLabel?: Resolver<
    ResolversTypes['VersionLabel'],
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TreeNodeIdentifierResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TreeNodeIdentifier'] = ResolversParentTypes['TreeNodeIdentifier']
> = {
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TreeQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TreeQueries'] = ResolversParentTypes['TreeQueries']
> = {
  getNode?: Resolver<
    Maybe<ResolversTypes['TreeNode']>,
    ParentType,
    ContextType,
    RequireFields<TreeQueriesGetNodeArgs, 'itemId' | 'versionLabel'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UploadFieldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UploadField'] = ResolversParentTypes['UploadField']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  accessTokens?: Resolver<
    Maybe<Array<ResolversTypes['AccessToken']>>,
    ParentType,
    ContextType
  >
  companyName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  createdAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  lastSeenAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  marketingEmailConsentedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  preferences?: Resolver<
    Maybe<ResolversTypes['Preferences']>,
    ParentType,
    ContextType,
    Partial<UserPreferencesArgs>
  >
  role?: Resolver<
    Maybe<ResolversTypes['UserTenantRole']>,
    ParentType,
    ContextType,
    RequireFields<UserRoleArgs, 'tenantId'>
  >
  sub?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  tenants?: Resolver<
    Maybe<Array<ResolversTypes['UserTenantRole']>>,
    ParentType,
    ContextType
  >
  tocReadAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UserMetrics'] = ResolversParentTypes['UserMetrics']
> = {
  count?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<UserMetricsCountArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UserMutations'] = ResolversParentTypes['UserMutations']
> = {
  addTenants?: Resolver<
    Array<ResolversTypes['UserTenantRole']>,
    ParentType,
    ContextType,
    RequireFields<UserMutationsAddTenantsArgs, 'roles' | 'userId'>
  >
  create?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<UserMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<UserMutationsDeleteArgs, 'id'>
  >
  generateAccessToken?: Resolver<
    ResolversTypes['AccessToken'],
    ParentType,
    ContextType,
    RequireFields<UserMutationsGenerateAccessTokenArgs, 'input' | 'userId'>
  >
  grantAdminRights?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<UserMutationsGrantAdminRightsArgs, 'userId'>
  >
  removeTenants?: Resolver<
    Maybe<Array<ResolversTypes['UserTenantRole']>>,
    ParentType,
    ContextType,
    RequireFields<UserMutationsRemoveTenantsArgs, 'tenantIds' | 'userId'>
  >
  revokeAdminRights?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<UserMutationsRevokeAdminRightsArgs, 'userId'>
  >
  update?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<UserMutationsUpdateArgs, 'id'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UserQueries'] = ResolversParentTypes['UserQueries']
> = {
  dev_search?: Resolver<
    Maybe<Array<ResolversTypes['User']>>,
    ParentType,
    ContextType,
    Partial<UserQueriesDev_SearchArgs>
  >
  get?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<UserQueriesGetArgs, 'id'>
  >
  getMany?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserTenantRoleResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UserTenantRole'] = ResolversParentTypes['UserTenantRole']
> = {
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tenant?: Resolver<ResolversTypes['Tenant'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VatTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['VatType'] = ResolversParentTypes['VatType']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  percent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VatTypeMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['VatTypeMutations'] = ResolversParentTypes['VatTypeMutations']
> = {
  create?: Resolver<
    ResolversTypes['VatType'],
    ParentType,
    ContextType,
    RequireFields<VatTypeMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<VatTypeMutationsDeleteArgs, 'id'>
  >
  update?: Resolver<
    ResolversTypes['VatType'],
    ParentType,
    ContextType,
    RequireFields<VatTypeMutationsUpdateArgs, 'id' | 'input'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VersionInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['VersionInfo'] = ResolversParentTypes['VersionInfo']
> = {
  apiVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  commitSha?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VersionedRecordInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['VersionedRecordInfo'] = ResolversParentTypes['VersionedRecordInfo']
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  label?: Resolver<ResolversTypes['VersionLabel'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VersionedServicesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['VersionedServices'] = ResolversParentTypes['VersionedServices']
> = {
  core?: Resolver<ResolversTypes['VersionInfo'], ParentType, ContextType>
  federated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  metrics?: Resolver<
    Maybe<ResolversTypes['VersionInfo']>,
    ParentType,
    ContextType
  >
  reporting?: Resolver<
    Maybe<ResolversTypes['VersionInfo']>,
    ParentType,
    ContextType
  >
  search?: Resolver<
    Maybe<ResolversTypes['VersionInfo']>,
    ParentType,
    ContextType
  >
  subscriptions?: Resolver<
    Maybe<ResolversTypes['VersionInfo']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VideoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Video'] = ResolversParentTypes['Video']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  playlist?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<VideoPlaylistArgs, 'type'>
  >
  playlists?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
  thumbnails?: Resolver<
    Maybe<Array<ResolversTypes['Image']>>,
    ParentType,
    ContextType
  >
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VideoContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['VideoContent'] = ResolversParentTypes['VideoContent']
> = {
  videos?: Resolver<
    Maybe<Array<ResolversTypes['Video']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VideoMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['VideoMutations'] = ResolversParentTypes['VideoMutations']
> = {
  addPlaylists?: Resolver<
    ResolversTypes['Video'],
    ParentType,
    ContextType,
    RequireFields<VideoMutationsAddPlaylistsArgs, 'keys' | 'videoId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type WebhookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Webhook'] = ResolversParentTypes['Webhook']
> = {
  concern?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  createdAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  event?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  graphqlQuery?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  headers?: Resolver<
    Maybe<Array<ResolversTypes['WebhookHeader']>>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  lastInvocation?: Resolver<
    Maybe<ResolversTypes['WebhookInvocation']>,
    ParentType,
    ContextType
  >
  method?: Resolver<ResolversTypes['HttpMethod'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  pastInvocations?: Resolver<
    Maybe<Array<ResolversTypes['WebhookInvocation']>>,
    ParentType,
    ContextType,
    RequireFields<WebhookPastInvocationsArgs, 'limit'>
  >
  tenant?: Resolver<Maybe<ResolversTypes['Tenant']>, ParentType, ContextType>
  tenantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type WebhookHeaderResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WebhookHeader'] = ResolversParentTypes['WebhookHeader']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type WebhookInvocationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WebhookInvocation'] = ResolversParentTypes['WebhookInvocation']
> = {
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  payload?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  response?: Resolver<
    Maybe<ResolversTypes['WebhookInvocationResponse']>,
    ParentType,
    ContextType
  >
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type WebhookInvocationResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WebhookInvocationResponse'] = ResolversParentTypes['WebhookInvocationResponse']
> = {
  body?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  status?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type WebhookMetricsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WebhookMetrics'] = ResolversParentTypes['WebhookMetrics']
> = {
  count?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    Partial<WebhookMetricsCountArgs>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type WebhookMutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WebhookMutations'] = ResolversParentTypes['WebhookMutations']
> = {
  create?: Resolver<
    ResolversTypes['Webhook'],
    ParentType,
    ContextType,
    RequireFields<WebhookMutationsCreateArgs, 'input'>
  >
  delete?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<WebhookMutationsDeleteArgs, 'id'>
  >
  registerInvocation?: Resolver<
    ResolversTypes['WebhookInvocation'],
    ParentType,
    ContextType,
    RequireFields<WebhookMutationsRegisterInvocationArgs, 'webhookId'>
  >
  update?: Resolver<
    ResolversTypes['Webhook'],
    ParentType,
    ContextType,
    RequireFields<WebhookMutationsUpdateArgs, 'id' | 'input'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type WebhookQueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WebhookQueries'] = ResolversParentTypes['WebhookQueries']
> = {
  get?: Resolver<
    Maybe<ResolversTypes['Webhook']>,
    ParentType,
    ContextType,
    RequireFields<WebhookQueriesGetArgs, 'id'>
  >
  getMany?: Resolver<
    Maybe<Array<ResolversTypes['Webhook']>>,
    ParentType,
    ContextType,
    RequireFields<WebhookQueriesGetManyArgs, 'tenantId'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  AcceptedContentType?: AcceptedContentTypeResolvers<ContextType>
  AccessToken?: AccessTokenResolvers<ContextType>
  AccessTokenMutations?: AccessTokenMutationsResolvers<ContextType>
  Address?: AddressResolvers<ContextType>
  ApiCallMetrics?: ApiCallMetricsResolvers<ContextType>
  App?: AppResolvers<ContextType>
  AppConnection?: AppConnectionResolvers<ContextType>
  AppConnectionEdge?: AppConnectionEdgeResolvers<ContextType>
  AppMutations?: AppMutationsResolvers<ContextType>
  AppQueries?: AppQueriesResolvers<ContextType>
  BandwidthUsageMetrics?: BandwidthUsageMetricsResolvers<ContextType>
  BooleanContent?: BooleanContentResolvers<ContextType>
  BulkTaskTenantCopyInfo?: BulkTaskTenantCopyInfoResolvers<ContextType>
  CashPayment?: CashPaymentResolvers<ContextType>
  Component?: ComponentResolvers<ContextType>
  ComponentChoiceComponentConfig?: ComponentChoiceComponentConfigResolvers<ContextType>
  ComponentChoiceContent?: ComponentChoiceContentResolvers<ContextType>
  ComponentConfig?: ComponentConfigResolvers<ContextType>
  ComponentContent?: ComponentContentResolvers<ContextType>
  ContentChunkComponentConfig?: ContentChunkComponentConfigResolvers<ContextType>
  ContentChunkContent?: ContentChunkContentResolvers<ContextType>
  CurrencySummary?: CurrencySummaryResolvers<ContextType>
  CurrencySummaryReport?: CurrencySummaryReportResolvers<ContextType>
  CustomPayment?: CustomPaymentResolvers<ContextType>
  CustomProperties?: CustomPropertiesResolvers<ContextType>
  Customer?: CustomerResolvers<ContextType>
  CustomerConnection?: CustomerConnectionResolvers<ContextType>
  CustomerConnectionEdge?: CustomerConnectionEdgeResolvers<ContextType>
  CustomerMutations?: CustomerMutationsResolvers<ContextType>
  CustomerQueries?: CustomerQueriesResolvers<ContextType>
  Date?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  DatetimeContent?: DatetimeContentResolvers<ContextType>
  DigitalAssetPreferences?: DigitalAssetPreferencesResolvers<ContextType>
  Discount?: DiscountResolvers<ContextType>
  Document?: DocumentResolvers<ContextType>
  DocumentMutations?: DocumentMutationsResolvers<ContextType>
  DocumentQueries?: DocumentQueriesResolvers<ContextType>
  EmailAddress?: GraphQLScalarType
  ExperimentalPreferenceEnabled?: ExperimentalPreferenceEnabledResolvers<ContextType>
  ExperimentalPreferences?: ExperimentalPreferencesResolvers<ContextType>
  File?: FileResolvers<ContextType>
  FileContent?: FileContentResolvers<ContextType>
  FileQueries?: FileQueriesResolvers<ContextType>
  FileSize?: FileSizeResolvers<ContextType>
  FileUploadMutations?: FileUploadMutationsResolvers<ContextType>
  FilesComponentConfig?: FilesComponentConfigResolvers<ContextType>
  FocalPoint?: FocalPointResolvers<ContextType>
  Folder?: FolderResolvers<ContextType>
  FolderMutations?: FolderMutationsResolvers<ContextType>
  FolderQueries?: FolderQueriesResolvers<ContextType>
  GenericSuggestSearchResult?: GenericSuggestSearchResultResolvers<ContextType>
  Grid?: GridResolvers<ContextType>
  GridColumn?: GridColumnResolvers<ContextType>
  GridColumnLayout?: GridColumnLayoutResolvers<ContextType>
  GridMutations?: GridMutationsResolvers<ContextType>
  GridPublishInfo?: GridPublishInfoResolvers<ContextType>
  GridQueries?: GridQueriesResolvers<ContextType>
  GridRelationsContent?: GridRelationsContentResolvers<ContextType>
  GridRow?: GridRowResolvers<ContextType>
  IObjectMetrics?: IObjectMetricsResolvers<ContextType>
  IObjectReports?: IObjectReportsResolvers<ContextType>
  IdentifierSuggestion?: IdentifierSuggestionResolvers<ContextType>
  Image?: ImageResolvers<ContextType>
  ImageConnection?: ImageConnectionResolvers<ContextType>
  ImageConnectionEdge?: ImageConnectionEdgeResolvers<ContextType>
  ImageContent?: ImageContentResolvers<ContextType>
  ImageMutations?: ImageMutationsResolvers<ContextType>
  ImageQueries?: ImageQueriesResolvers<ContextType>
  ImageVariant?: ImageVariantResolvers<ContextType>
  InviteToken?: InviteTokenResolvers<ContextType>
  InviteTokenMutations?: InviteTokenMutationsResolvers<ContextType>
  Item?: ItemResolvers<ContextType>
  ItemConnection?: ItemConnectionResolvers<ContextType>
  ItemConnectionEdge?: ItemConnectionEdgeResolvers<ContextType>
  ItemMetrics?: ItemMetricsResolvers<ContextType>
  ItemMutations?: ItemMutationsResolvers<ContextType>
  ItemQueries?: ItemQueriesResolvers<ContextType>
  ItemRelationsComponentConfig?: ItemRelationsComponentConfigResolvers<ContextType>
  ItemRelationsComponentQuickSelectConfig?: ItemRelationsComponentQuickSelectConfigResolvers<ContextType>
  ItemRelationsComponentQuickSelectFolderConfig?: ItemRelationsComponentQuickSelectFolderConfigResolvers<ContextType>
  ItemRelationsContent?: ItemRelationsContentResolvers<ContextType>
  ItemSuggestSearchResult?: ItemSuggestSearchResultResolvers<ContextType>
  JSON?: GraphQLScalarType
  KeyValuePair?: KeyValuePairResolvers<ContextType>
  KlarnaPayment?: KlarnaPaymentResolvers<ContextType>
  Language?: LanguageResolvers<ContextType>
  LanguageMutations?: LanguageMutationsResolvers<ContextType>
  LocationContent?: LocationContentResolvers<ContextType>
  Market?: MarketResolvers<ContextType>
  MarketConnection?: MarketConnectionResolvers<ContextType>
  MarketConnectionEdge?: MarketConnectionEdgeResolvers<ContextType>
  MarketMutations?: MarketMutationsResolvers<ContextType>
  MarketQueries?: MarketQueriesResolvers<ContextType>
  MeMutations?: MeMutationsResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  NerdyViewPreferences?: NerdyViewPreferencesResolvers<ContextType>
  NonNegativeFloat?: GraphQLScalarType
  NonNegativeInt?: GraphQLScalarType
  NumericComponentConfig?: NumericComponentConfigResolvers<ContextType>
  NumericContent?: NumericContentResolvers<ContextType>
  Order?: OrderResolvers<ContextType>
  OrderConnection?: OrderConnectionResolvers<ContextType>
  OrderConnectionEdge?: OrderConnectionEdgeResolvers<ContextType>
  OrderItem?: OrderItemResolvers<ContextType>
  OrderItemMeteredVariable?: OrderItemMeteredVariableResolvers<ContextType>
  OrderItemSubscription?: OrderItemSubscriptionResolvers<ContextType>
  OrderMetrics?: OrderMetricsResolvers<ContextType>
  OrderMutations?: OrderMutationsResolvers<ContextType>
  OrderPipeline?: OrderPipelineResolvers<ContextType>
  OrderQueries?: OrderQueriesResolvers<ContextType>
  OrdersReport?: OrdersReportResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  ParagraphCollectionContent?: ParagraphCollectionContentResolvers<ContextType>
  ParagraphContent?: ParagraphContentResolvers<ContextType>
  Payment?: PaymentResolvers<ContextType>
  PaymentType?: PaymentTypeResolvers<ContextType>
  PaypalPayment?: PaypalPaymentResolvers<ContextType>
  PhoneNumber?: GraphQLScalarType
  Pipeline?: PipelineResolvers<ContextType>
  PipelineConnection?: PipelineConnectionResolvers<ContextType>
  PipelineConnectionEdge?: PipelineConnectionEdgeResolvers<ContextType>
  PipelineMutations?: PipelineMutationsResolvers<ContextType>
  PipelineQueries?: PipelineQueriesResolvers<ContextType>
  PipelineStage?: PipelineStageResolvers<ContextType>
  PositiveInt?: GraphQLScalarType
  Preference?: PreferenceResolvers<ContextType>
  Preferences?: PreferencesResolvers<ContextType>
  PresignedUploadRequest?: PresignedUploadRequestResolvers<ContextType>
  Price?: PriceResolvers<ContextType>
  PriceList?: PriceListResolvers<ContextType>
  PriceListConnection?: PriceListConnectionResolvers<ContextType>
  PriceListConnectionEdge?: PriceListConnectionEdgeResolvers<ContextType>
  PriceListMutations?: PriceListMutationsResolvers<ContextType>
  PriceListPriceVariant?: PriceListPriceVariantResolvers<ContextType>
  PriceListProduct?: PriceListProductResolvers<ContextType>
  PriceListQueries?: PriceListQueriesResolvers<ContextType>
  PriceListSelectedProductVariants?: PriceListSelectedProductVariantsResolvers<ContextType>
  PriceListTargetAudience?: PriceListTargetAudienceResolvers<ContextType>
  PriceVariant?: PriceVariantResolvers<ContextType>
  PriceVariantMutations?: PriceVariantMutationsResolvers<ContextType>
  PriceVariantQueries?: PriceVariantQueriesResolvers<ContextType>
  Product?: ProductResolvers<ContextType>
  ProductMutations?: ProductMutationsResolvers<ContextType>
  ProductPriceVariant?: ProductPriceVariantResolvers<ContextType>
  ProductQueries?: ProductQueriesResolvers<ContextType>
  ProductStockLocation?: ProductStockLocationResolvers<ContextType>
  ProductSubscription?: ProductSubscriptionResolvers<ContextType>
  ProductSubscriptionConnection?: ProductSubscriptionConnectionResolvers<ContextType>
  ProductSubscriptionConnectionEdge?: ProductSubscriptionConnectionEdgeResolvers<ContextType>
  ProductSubscriptionHistoryEvent?: ProductSubscriptionHistoryEventResolvers<ContextType>
  ProductSubscriptionHistoryEventCancellation?: ProductSubscriptionHistoryEventCancellationResolvers<ContextType>
  ProductSubscriptionHistoryEventRenewal?: ProductSubscriptionHistoryEventRenewalResolvers<ContextType>
  ProductSubscriptionHistoryEventRenewalDueBroadcast?: ProductSubscriptionHistoryEventRenewalDueBroadcastResolvers<ContextType>
  ProductSubscriptionItem?: ProductSubscriptionItemResolvers<ContextType>
  ProductSubscriptionMutations?: ProductSubscriptionMutationsResolvers<ContextType>
  ProductSubscriptionPhase?: ProductSubscriptionPhaseResolvers<ContextType>
  ProductSubscriptionQueries?: ProductSubscriptionQueriesResolvers<ContextType>
  ProductSubscriptionStatus?: ProductSubscriptionStatusResolvers<ContextType>
  ProductSubscriptionUsage?: ProductSubscriptionUsageResolvers<ContextType>
  ProductVariant?: ProductVariantResolvers<ContextType>
  ProductVariantAttribute?: ProductVariantAttributeResolvers<ContextType>
  ProductVariantConnection?: ProductVariantConnectionResolvers<ContextType>
  ProductVariantConnectionEdge?: ProductVariantConnectionEdgeResolvers<ContextType>
  ProductVariantPriceList?: ProductVariantPriceListResolvers<ContextType>
  ProductVariantSubscriptionMeteredVariable?: ProductVariantSubscriptionMeteredVariableResolvers<ContextType>
  ProductVariantSubscriptionPlan?: ProductVariantSubscriptionPlanResolvers<ContextType>
  ProductVariantSubscriptionPlanPeriod?: ProductVariantSubscriptionPlanPeriodResolvers<ContextType>
  ProductVariantSubscriptionPlanPricing?: ProductVariantSubscriptionPlanPricingResolvers<ContextType>
  ProductVariantSubscriptionPlanTier?: ProductVariantSubscriptionPlanTierResolvers<ContextType>
  PropertiesTableComponentConfig?: PropertiesTableComponentConfigResolvers<ContextType>
  PropertiesTableComponentConfigSection?: PropertiesTableComponentConfigSectionResolvers<ContextType>
  PropertiesTableComponentSection?: PropertiesTableComponentSectionResolvers<ContextType>
  PropertiesTableContent?: PropertiesTableContentResolvers<ContextType>
  PublishInfo?: PublishInfoResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  ReportMetric?: ReportMetricResolvers<ContextType>
  RichTextContent?: RichTextContentResolvers<ContextType>
  SalesReport?: SalesReportResolvers<ContextType>
  SearchQueries?: SearchQueriesResolvers<ContextType>
  SelectionComponentConfig?: SelectionComponentConfigResolvers<ContextType>
  SelectionComponentOptionConfig?: SelectionComponentOptionConfigResolvers<ContextType>
  SelectionContent?: SelectionContentResolvers<ContextType>
  Shape?: ShapeResolvers<ContextType>
  ShapeComponent?: ShapeComponentResolvers<ContextType>
  ShapeMetrics?: ShapeMetricsResolvers<ContextType>
  ShapeMutations?: ShapeMutationsResolvers<ContextType>
  ShapeQueries?: ShapeQueriesResolvers<ContextType>
  SingleLineContent?: SingleLineContentResolvers<ContextType>
  StockLocation?: StockLocationResolvers<ContextType>
  StockLocationMutations?: StockLocationMutationsResolvers<ContextType>
  StockLocationQueries?: StockLocationQueriesResolvers<ContextType>
  StockLocationSettings?: StockLocationSettingsResolvers<ContextType>
  StripePayment?: StripePaymentResolvers<ContextType>
  SubscriptionContract?: SubscriptionContractResolvers<ContextType>
  SubscriptionContractAddress?: SubscriptionContractAddressResolvers<ContextType>
  SubscriptionContractCancelledEvent?: SubscriptionContractCancelledEventResolvers<ContextType>
  SubscriptionContractConnection?: SubscriptionContractConnectionResolvers<ContextType>
  SubscriptionContractConnectionEdge?: SubscriptionContractConnectionEdgeResolvers<ContextType>
  SubscriptionContractEvent?: SubscriptionContractEventResolvers<ContextType>
  SubscriptionContractEventConnection?: SubscriptionContractEventConnectionResolvers<ContextType>
  SubscriptionContractEventConnectionEdge?: SubscriptionContractEventConnectionEdgeResolvers<ContextType>
  SubscriptionContractEventQueries?: SubscriptionContractEventQueriesResolvers<ContextType>
  SubscriptionContractItem?: SubscriptionContractItemResolvers<ContextType>
  SubscriptionContractMeteredVariableReference?: SubscriptionContractMeteredVariableReferenceResolvers<ContextType>
  SubscriptionContractMeteredVariableTierReference?: SubscriptionContractMeteredVariableTierReferenceResolvers<ContextType>
  SubscriptionContractMutations?: SubscriptionContractMutationsResolvers<ContextType>
  SubscriptionContractPhase?: SubscriptionContractPhaseResolvers<ContextType>
  SubscriptionContractQueries?: SubscriptionContractQueriesResolvers<ContextType>
  SubscriptionContractRenewalDueBroadcastEvent?: SubscriptionContractRenewalDueBroadcastEventResolvers<ContextType>
  SubscriptionContractRenewalDueBroadcastEventData?: SubscriptionContractRenewalDueBroadcastEventDataResolvers<ContextType>
  SubscriptionContractRenewedEvent?: SubscriptionContractRenewedEventResolvers<ContextType>
  SubscriptionContractStatus?: SubscriptionContractStatusResolvers<ContextType>
  SubscriptionContractUsage?: SubscriptionContractUsageResolvers<ContextType>
  SubscriptionContractUsageTrackedData?: SubscriptionContractUsageTrackedDataResolvers<ContextType>
  SubscriptionContractUsageTrackedEvent?: SubscriptionContractUsageTrackedEventResolvers<ContextType>
  SubscriptionPlan?: SubscriptionPlanResolvers<ContextType>
  SubscriptionPlanMeteredVariable?: SubscriptionPlanMeteredVariableResolvers<ContextType>
  SubscriptionPlanMutations?: SubscriptionPlanMutationsResolvers<ContextType>
  SubscriptionPlanPeriod?: SubscriptionPlanPeriodResolvers<ContextType>
  SubscriptionPlanPhase?: SubscriptionPlanPhaseResolvers<ContextType>
  SubscriptionPlanQueries?: SubscriptionPlanQueriesResolvers<ContextType>
  SuggestSearchAggregations?: SuggestSearchAggregationsResolvers<ContextType>
  SuggestSearchConnection?: SuggestSearchConnectionResolvers<ContextType>
  SuggestSearchConnectionEdge?: SuggestSearchConnectionEdgeResolvers<ContextType>
  SuggestSearchResult?: SuggestSearchResultResolvers<ContextType>
  SuggestSearchTypesAggregation?: SuggestSearchTypesAggregationResolvers<ContextType>
  Tax?: TaxResolvers<ContextType>
  Tenant?: TenantResolvers<ContextType>
  TenantAuthenticationMethod?: TenantAuthenticationMethodResolvers<ContextType>
  TenantDefaults?: TenantDefaultsResolvers<ContextType>
  TenantFrontend?: TenantFrontendResolvers<ContextType>
  TenantFrontendAuthentication?: TenantFrontendAuthenticationResolvers<ContextType>
  TenantMetrics?: TenantMetricsResolvers<ContextType>
  TenantMutations?: TenantMutationsResolvers<ContextType>
  TenantPreferences?: TenantPreferencesResolvers<ContextType>
  TenantQueries?: TenantQueriesResolvers<ContextType>
  TenantReports?: TenantReportsResolvers<ContextType>
  Topic?: TopicResolvers<ContextType>
  TopicConnection?: TopicConnectionResolvers<ContextType>
  TopicConnectionEdge?: TopicConnectionEdgeResolvers<ContextType>
  TopicImagesModified?: TopicImagesModifiedResolvers<ContextType>
  TopicItemsModified?: TopicItemsModifiedResolvers<ContextType>
  TopicMutations?: TopicMutationsResolvers<ContextType>
  TopicQueries?: TopicQueriesResolvers<ContextType>
  TopicSearchAggregations?: TopicSearchAggregationsResolvers<ContextType>
  TopicSearchConnection?: TopicSearchConnectionResolvers<ContextType>
  TopicSearchConnectionEdge?: TopicSearchConnectionEdgeResolvers<ContextType>
  TopicSearchResult?: TopicSearchResultResolvers<ContextType>
  TreeMutations?: TreeMutationsResolvers<ContextType>
  TreeNode?: TreeNodeResolvers<ContextType>
  TreeNodeIdentifier?: TreeNodeIdentifierResolvers<ContextType>
  TreeQueries?: TreeQueriesResolvers<ContextType>
  UploadField?: UploadFieldResolvers<ContextType>
  User?: UserResolvers<ContextType>
  UserMetrics?: UserMetricsResolvers<ContextType>
  UserMutations?: UserMutationsResolvers<ContextType>
  UserQueries?: UserQueriesResolvers<ContextType>
  UserTenantRole?: UserTenantRoleResolvers<ContextType>
  VatType?: VatTypeResolvers<ContextType>
  VatTypeMutations?: VatTypeMutationsResolvers<ContextType>
  VersionInfo?: VersionInfoResolvers<ContextType>
  VersionedRecordInfo?: VersionedRecordInfoResolvers<ContextType>
  VersionedServices?: VersionedServicesResolvers<ContextType>
  Video?: VideoResolvers<ContextType>
  VideoContent?: VideoContentResolvers<ContextType>
  VideoMutations?: VideoMutationsResolvers<ContextType>
  Webhook?: WebhookResolvers<ContextType>
  WebhookHeader?: WebhookHeaderResolvers<ContextType>
  WebhookInvocation?: WebhookInvocationResolvers<ContextType>
  WebhookInvocationResponse?: WebhookInvocationResponseResolvers<ContextType>
  WebhookMetrics?: WebhookMetricsResolvers<ContextType>
  WebhookMutations?: WebhookMutationsResolvers<ContextType>
  WebhookQueries?: WebhookQueriesResolvers<ContextType>
}
