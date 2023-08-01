// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshSendPulseHeader, refreshSendPulseList } from './SendPulseCommonFunc'
import SendPulseFieldMap from './SendPulseFieldMap'

export default function SendPulseIntegLayout({ formFields, sendPulseConf, setSendPulseConf, isLoading, setIsLoading, setSnackbar }) {

  const handleInput = (e) => {
    const listid = e.target.value
    const newConf = { ...sendPulseConf }
    if (listid) {
      newConf.listId = listid
    }

    refreshSendPulseHeader(newConf, setSendPulseConf, setIsLoading, setSnackbar)
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('List:', 'bit-integrations')}</b>
      <select value={sendPulseConf?.listId} name="listId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select List', 'bit-integrations')}</option>
        {
          sendPulseConf?.default?.sendPulseLists && Object.keys(sendPulseConf.default.sendPulseLists).map(listName => (
            <option key={`${listName + 1}`} value={sendPulseConf.default.sendPulseLists[listName].listId}>
              {sendPulseConf.default.sendPulseLists[listName].listName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshSendPulseList(sendPulseConf, setSendPulseConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh SendPulse list"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />

      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          translist: 'scale(0.7)',
        }}
        />
      )}

      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        <button onClick={() => refreshSendPulseHeader(sendPulseConf, setSendPulseConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh SendPulse Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {
        (sendPulseConf?.listId || sendPulseConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('List Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('SendPulse Fields', 'bit-integrations')}</b></div>
            </div>

            {sendPulseConf.field_map.map((itm, i) => (
              <SendPulseFieldMap
                key={`SendPulse-m-${i + 9}`}
                i={i}
                field={itm}
                sendPulseConf={sendPulseConf}
                formFields={formFields}
                setSendPulseConf={setSendPulseConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(sendPulseConf.field_map.length, sendPulseConf, setSendPulseConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
          </>
        )
      }
    </>
  )
}
