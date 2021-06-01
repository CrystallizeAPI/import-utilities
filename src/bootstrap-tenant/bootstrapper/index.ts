import { EventEmitter } from 'events'

import { JsonSpec } from '../json-spec'

export * from './utils'
import { callPIM, EVENT_NAMES, setAccessTokens, setTenantId } from './utils'
import { updateShapes } from './update-shapes'

export class Bootstrapper extends EventEmitter {
  CRYSTALLIZE_ACCESS_TOKEN_ID: string = ''
  CRYSTALLIZE_ACCESS_TOKEN_SECRET: string = ''
  SPEC: JsonSpec | null = null
  tenantId: string = ''
  tenantIdentifier: string = ''

  setAccessToken = setAccessTokens
  setSpec(spec: JsonSpec) {
    this.SPEC = spec
  }
  setTenantIdentifier(tenantIdentifier: string) {
    this.tenantIdentifier = tenantIdentifier
  }
  async getTenantId() {
    const r = await callPIM({
      query: `
        {
          me {
            tenants {
              tenant {
                id
                identifier
              }
            }
          }
        }
      `,
    })

    this.tenantId = r?.data?.me?.tenants?.find(
      (t: { tenant: { identifier: string } }) =>
        t.tenant.identifier === this.tenantIdentifier
    )?.tenant.identifier
    if (!this.tenantId) {
      throw new Error(`No access to tenant "${this.tenantIdentifier}"`)
    }
    setTenantId(this.tenantId)
  }
  async start() {
    this.getTenantId().then(() => {
      this.updateShapes()
      this.on(EVENT_NAMES.SHAPES_DONE, () => this.emit(EVENT_NAMES.DONE))
    })
  }
  async updateShapes() {
    await updateShapes({
      spec: this.SPEC,
      onUpdate: (status) => {
        this.emit(EVENT_NAMES.SHAPES_UPDATE, status.message)
      },
    })
    this.emit(EVENT_NAMES.SHAPES_DONE)
  }
}
