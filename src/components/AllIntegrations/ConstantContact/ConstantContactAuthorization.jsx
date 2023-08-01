import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import CopyText from '../../Utilities/CopyText'
import { handleConstantContactAuthorize } from './ConstantContactCommonFunc'

export default function ConstantContactAuthorization({ constantContactConf, setConstantContactConf, step, setstep, isLoading, setIsLoading, setSnackbar, redirectLocation, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({
    dataCenter: '',
    clientId: '',
    clientSecret: '',
  })
  const scopes = 'account_read account_update contact_data offline_access campaign_data'
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setstep(2)
  }

  const handleInput = (e) => {
    const newConf = { ...constantContactConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setConstantContactConf(newConf)
  }

  const note = `
  <h4> Step of get API Key(Client Id) And Client Secret:</h4>
  <ul>
    <li>Goto <a href="https://app.constantcontact.com/pages/dma/portal/?_ga=2.91540634.1868552181.1667660766-5cc88792-fd06-40a8-9b8c-e27659667215">Constant Contact Application</a></li>
    <li>Then create a new application.</li>
    <li>Select  <b>(Authorization Code Flow and Implicit Flow)</b> and <b>(Rotating Refresh Tokens or Long Lived Refresh Tokens).</b></li>
    <li>Copy the <b>Authorized Redirect URIs</b> from here and paste it into the Constant Contact application form.</li> 
    <li>Then generate <b>Client Secret</b> from the Constant Contact application</li>
    <li>Copy the <b>Client Id</b> and <b>Client Secret</b> from Constant Contact application and paste into this authorization form.</li>
    <li>Finally, click <b>Authorize</b> button.</li>
</ul>
`

  return (
    <div
      className="btcd-stp-page"
      style={{
        ...{ width: step === 1 && 900 },
        ...{ height: step === 1 && 'auto' },
      }}
    >
      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={constantContactConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />

      <div className="mt-3">
        <b>{__('Homepage URL:', 'bit-integrations')}</b>
      </div>
      <CopyText
        value={`${window.location.origin}`}
        className="field-key-cpy w-6 ml-0"
        readOnly={isInfo}
        setSnackbar={setSnackbar}
      />

      <div className="mt-3">
        <b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b>
      </div>
      <CopyText
        value={redirectLocation || `${btcbi.api.base}/redirect`}
        setSnackbar={setSnackbar}
        className="field-key-cpy w-6 ml-0"
        readOnly={isInfo}
      />

      <small className="d-blk mt-5">
        {__('To get Client ID and SECRET , Please Visit', 'bit-integrations')}
        {' '}
        <a
          className="btcd-link"
          href="https://app.constantcontact.com/pages/dma/portal/?_ga=2.91540634.1868552181.1667660766-5cc88792-fd06-40a8-9b8c-e27659667215"
          target="_blank"
          rel="noreferrer"
        >
          {__('Constant Contact Application', 'bit-integrations')}
        </a>
      </small>

      <div className="mt-3">
        <b>{__('Client id:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="clientId"
        value={constantContactConf.clientId}
        type="text"
        placeholder={__('Client id...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientId}</div>
      <div className="mt-3">
        <b>{__('Client secret:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="clientSecret"
        value={constantContactConf.clientSecret}
        type="text"
        placeholder={__('Client secret...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.clientSecret}</div>
      {!isInfo && (
        <>
          <button
            onClick={() => handleConstantContactAuthorize(
              'constantContact',
              'cContact',
              scopes,
              constantContactConf,
              setConstantContactConf,
              setError,
              setisAuthorized,
              setIsLoading,
              setSnackbar,
              btcbi,
            )}
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading.auth}
          >
            {isAuthorized
              ? __('Authorized ✔', 'bit-integrations')
              : __('Authorize', 'bit-integrations')}
            {isLoading.auth && (
              <LoaderSm size={20} clr="#022217" className="ml-2" />
            )}
          </button>
          <br />
          <button
            onClick={nextPage}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={!isAuthorized}
          >
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
      <Note note={note} />
    </div>
  )
}
