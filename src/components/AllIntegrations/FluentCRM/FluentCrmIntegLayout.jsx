import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import FluentCrmActions from './FluentCrmActions'
import { refreshCrmList, refreshCrmTag } from './FluentCrmCommonFunc'
import FluentCrmFieldMap from './FluentCrmFieldMap'

export default function FluentCrmIntegLayout({ formID, formFields, fluentCrmConf, setFluentCrmConf, isLoading, setIsLoading, setSnackbar }) {
  const tags = (val) => {
    const newConf = { ...fluentCrmConf }
    if (val) {
      newConf.tags = val ? val.split(',') : []
    } else {
      delete newConf.tags
    }
    setFluentCrmConf({ ...newConf })
  }
  const action = [
    { value: 'add-tag', label: 'Add tag to a user' },
    { value: 'remove-tag', label: 'Remove tag from a user' },
    { value: 'add-user', label: 'Add user to a list' },
    { value: 'remove-user', label: 'Remove user from a list' },
  ]

  const inputHendler = (e) => {
    const newConf = { ...fluentCrmConf }
    newConf.list_id = e.target.value
    setFluentCrmConf({ ...newConf })
  }

  const handleAction = (e) => {
    const newConf = { ...fluentCrmConf }
    const { name, value } = e.target
    if (e.target.value !== '') {
      newConf[name] = value

      const tmp = {
        name: 'Fluent CRM',
        type: 'Fluent Crm',
        actionName: value,
        field_map: [
          { formField: '', fluentCRMField: '' },
        ],
        actions: {},
      }
      setFluentCrmConf(tmp)
    } else {
      delete newConf[name]
      setFluentCrmConf({ ...newConf })
    }
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select onChange={handleAction} name="actionName" value={fluentCrmConf?.actionName} className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {
            action.map(({ label, value }) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))
          }
        </select>
      </div>
      <br />
      {(fluentCrmConf?.actionName === 'add-user' || fluentCrmConf?.actionName === 'remove-user') && (
        <div className="flx">
          <b className="wdt-200 d-in-b">{__('Fluent CRM List:', 'bit-integrations')}</b>
          <select onChange={(e) => inputHendler(e)} name="list_id" value={fluentCrmConf.list_id} className="btcd-paper-inp w-5">
            <option value="">{__('Select Fluent CRM list', 'bit-integrations')}</option>
            {
              fluentCrmConf?.default?.fluentCrmList && Object.keys(fluentCrmConf.default.fluentCrmList).map(fluentCrmListName => (
                <option key={fluentCrmListName} value={fluentCrmConf.default.fluentCrmList[fluentCrmListName].id}>
                  {fluentCrmConf.default.fluentCrmList[fluentCrmListName].title}
                </option>
              ))
            }
          </select>
          <button onClick={() => refreshCrmList(formID, fluentCrmConf, setFluentCrmConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh List, Tag & Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
        </div>
      )}
      {(fluentCrmConf?.actionName && fluentCrmConf?.actionName !== 'remove-user') && (
        <div className="flx mt-5">
          <b className="wdt-200 d-in-b">{__('Fluent CRM Tags: ', 'bit-integrations')}</b>
          <MultiSelect
            defaultValue={fluentCrmConf?.tags}
            className="btcd-paper-drpdwn w-5"
            options={fluentCrmConf?.default?.fluentCrmTags && Object.keys(fluentCrmConf.default.fluentCrmTags).map(tag => ({ label: fluentCrmConf.default.fluentCrmTags[tag].title, value: fluentCrmConf.default.fluentCrmTags[tag].id.toString() }))}
            onChange={val => tags(val)}
          />
          <button onClick={() => refreshCrmTag(formID, fluentCrmConf, setFluentCrmConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Tag & Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>

        </div>
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
      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Fluent CRM Fields', 'bit-integrations')}</b></div>
      </div>

      {fluentCrmConf.field_map.map((itm, i) => (
        <FluentCrmFieldMap
          key={`fluentcrm-m-${i + 9}`}
          i={i}
          field={itm}
          fluentCrmConf={fluentCrmConf}
          formFields={formFields}
          setFluentCrmConf={setFluentCrmConf}
        />
      ))}
      {fluentCrmConf?.actionName === 'add-user' && (
        <>
          <div className="txt-center btcbi-field-map-button mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(fluentCrmConf.field_map.length, fluentCrmConf, setFluentCrmConf)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />

          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <FluentCrmActions
            fluentCrmConf={fluentCrmConf}
            setFluentCrmConf={setFluentCrmConf}
            setIsLoading={setIsLoading}
            setSnackbar={setSnackbar}
          />

        </>
      )}
    </>
  )
}
