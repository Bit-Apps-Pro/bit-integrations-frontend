/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import { perfexCRMAuthentication } from './PerfexCRMCommonFunc'
import Note from '../../Utilities/Note'
import { toast } from 'react-hot-toast'

export default function PerfexCRMAuthorization({ perfexCRMConf, setPerfexCRMConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ api_token: '' })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !perfexCRMConf?.default
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...perfexCRMConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setPerfexCRMConf(newConf)
  }

  const handleApiTokenLink = () => {
    perfexCRMConf.domain
      ? window.open(
        `${perfexCRMConf.domain}/admin/api/api_management`,
        '_blank',
        'noreferrer'
      )
      : toast.error(
        __("Access API URL is required!", "bit-integrations")
      )
  }

  const ActiveInstructions = `
            <h4>Get API Token</h4>
            <ul>
                <li>Go to your Perfex CRM's Admin area and select the following menu item: "SETUP → MODULES".</li>
                <li>Select the extracted upload.zip at Module installation selection prompt and press "INSTALL".</li>
                <li>Find the newly installed module in the list, press "ACTIVATE" and enter your license key.</li>
                <li>Go to your Perfex's CRM backend as an admin, go to "API → API Management", and create a new token.</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={perfexCRMConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Access API URL:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="domain" value={perfexCRMConf.domain} type="text" placeholder={__('Access API URL...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.domain}</div>

      <div className="mt-3"><b>{__('API Token:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_token" value={perfexCRMConf.api_token} type="text" placeholder={__('API Token...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_token}</div>

      <small className="d-blk mt-3">
        {__('To Get API Token, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" onClick={handleApiTokenLink}>{__('PerfexCRM API Token', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => perfexCRMAuthentication(perfexCRMConf, setPerfexCRMConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {loading.auth && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={nextPage} className="btn ml-auto btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </div>
      )}
      <Note note={ActiveInstructions} />
    </div>
  )
}

