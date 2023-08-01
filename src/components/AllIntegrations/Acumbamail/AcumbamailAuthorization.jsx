import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import { fetchAllList, handleAuthorize } from './AcumbamailCommonFunc'

export default function AcumbamailAuthorization({ formID, acumbamailConf, setAcumbamailConf, step, setstep, isLoading, setIsLoading, setSnackbar, redirectLocation, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ dataCenter: '', clientId: '' })
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
    fetchAllList(acumbamailConf, setAcumbamailConf, setIsLoading, setSnackbar)
  }

  const handleInput = e => {
    const newConf = { ...acumbamailConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setAcumbamailConf(newConf)
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={acumbamailConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <small className="d-blk mt-3">
        {__('To Get Client Auth token, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href="https://acumbamail.com/en/apidoc/" target="_blank" rel="noreferrer">{__('Acumbamail doc', 'bit-integrations')}</a>
      </small>

      <div className="mt-3"><b>{__('Auth Token:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="auth_token" value={acumbamailConf.auth_token} type="text" placeholder={__('Auth Token...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.auth_token}</div>

      {!isInfo && (
        <>
          <button
            onClick={() => handleAuthorize(
              acumbamailConf,
              setAcumbamailConf,
              setError,
              setisAuthorized,
              setIsLoading,
              setSnackbar,
            )}
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}
          >
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={nextPage} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
    </div>
  )
}
