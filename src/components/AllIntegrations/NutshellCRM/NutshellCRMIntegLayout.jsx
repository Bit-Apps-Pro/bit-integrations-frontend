/* eslint-disable no-unused-vars */
import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import NutshellCRMActions from './NutshellCRMActions'
import { generateMappedField } from './NutshellCRMCommonFunc'
import NutshellCRMFieldMap from './NutshellCRMFieldMap'

export default function NutshellCRMIntegLayout({ formFields, handleInput, nutshellCRMConf, setNutshellCRMConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    setNutshellCRMConf(prevConf => create(prevConf, (draftConf) => {
      const { name } = e.target

      if (e.target.value !== '') {
        draftConf.actionName = e.target.value

        if (draftConf.actionName === "customer") {
          draftConf.nutshellCRMFields = draftConf.customerFields
        } else if (draftConf.actionName === "contact") {
          draftConf.nutshellCRMFields = draftConf.contactFields
        } else if (draftConf.actionName === "lead") {
          draftConf.nutshellCRMFields = draftConf.leadFields
          draftConf.leadStatus = ['Lead', 'Open', 'Replied', 'Opportunity', 'Quotation', 'Lost Quotation', 'Interested', 'Converted', 'Do Not Contact']
        }
        draftConf.field_map = generateMappedField(draftConf)

      } else {
        delete draftConf[name]
      }
    }))
  }

  const setChanges = (val, name) => {
    const newConf = { ...nutshellCRMConf }
    newConf[name] = val

    setNutshellCRMConf({ ...newConf })
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={nutshellCRMConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="lead" data-action_name="lead">{__('Create Lead', 'bit-integrations')}</option>
        <option value="customer" data-action_name="customer">{__('Create Customer', 'bit-integrations')}</option>
        <option value="contact" data-action_name="contact">{__('Create Contact', 'bit-integrations')}</option>
      </select>
      <br />
      {nutshellCRMConf.actionName === 'lead'
        && (
          <>
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Lead Status:', 'bit-integrations')}</b>
              <MultiSelect
                options={nutshellCRMConf?.leadStatus.map(status => ({ label: status, value: status }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={nutshellCRMConf?.selectedLeadStatus}
                onChange={val => setChanges(val, 'selectedLeadStatus')}
                disabled={isLoading}
                singleSelect
                closeOnSelect
              />
            </div>
          </>
        )}
      {nutshellCRMConf.actionName === 'customer'
        && (
          <>
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Customer Type:', 'bit-integrations')}</b>
              <MultiSelect
                options={['Company', 'Individual']?.map(type => ({ label: type, value: type }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={nutshellCRMConf?.selectedCustomerType}
                onChange={val => setChanges(val, 'selectedCustomerType')}
                disabled={isLoading}
                singleSelect
                closeOnSelect
              />
            </div>
          </>
        )}

      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {nutshellCRMConf.actionName && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('NutshellCRM Fields', 'bit-integrations')}</b></div>
          </div>

          {nutshellCRMConf?.field_map.map((itm, i) => (
            <NutshellCRMFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              nutshellCRMConf={nutshellCRMConf}
              formFields={formFields}
              setNutshellCRMConf={setNutshellCRMConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(nutshellCRMConf.field_map.length, nutshellCRMConf, setNutshellCRMConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <NutshellCRMActions
            nutshellCRMConf={nutshellCRMConf}
            setNutshellCRMConf={setNutshellCRMConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}

