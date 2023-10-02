import { useState } from 'react'
import { toast } from 'react-hot-toast'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { refreshSendPulseList } from './SendPulseCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function SendPulseAuthorization({ formID, sendPulseConf, setSendPulseConf, step, setstep, setSnackbar, isInfo, isLoading, setIsLoading }) {

  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', client_secret: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const { sendPulse } = tutorialLinks

  const handleAuthorize = () => {
    const newConf = { ...sendPulseConf }
    if (!newConf.name || !newConf.client_secret) {
      setError({
        name: !newConf.name ? __('Integration name cann\'t be empty', 'bit-integrations') : '',
        client_id: !newConf.client_id ? __('Access Client ID cann\'t be empty', 'bit-integrations') : '',
        client_secret: !newConf.client_secret ? __('Access Client Secret Key cann\'t be empty', 'bit-integrations') : '',
      })
      return
    }
    setIsLoading('auth')
    const data = {
      client_id: newConf.client_id,
      client_secret: newConf.client_secret,
    }
    bitsFetch(data, 'sendPulse_authorize')
      .then(result => {
        if (result && result.success) {
          const newConf = { ...sendPulseConf }
          newConf.tokenDetails = result.data
          setSendPulseConf(newConf)
          setisAuthorized(true)
          toast.success(__('Authorized Successfully', 'bit-integrations'))
        } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
          toast.error(`${__('Authorization failed Cause:', 'bit-integrations')}${result.data.data || result.data}. ${__('please try again', 'bit-integrations')}`)
        } else {
          toast.error(__('Authorization failed. please try again', 'bit-integrations'))
        }
        setShowAuthMsg(true)
        setIsLoading(false)
      })
  }
  const handleInput = e => {
    const newConf = { ...sendPulseConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setSendPulseConf(newConf)
  }

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    refreshSendPulseList(sendPulseConf, setSendPulseConf, setIsLoading, setSnackbar)
    setstep(2)
  }

  const ActiveInstructions = `
            <h4>Get client id and client secret key</h4>
            <ul>
                <li>First go to your SendPulse dashboard.</li>
                <li>Click "Integrations", Then click "Api Keys"</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {sendPulse?.youTubeLink && (
        <TutorialLink
          title={sendPulse?.title}
          youTubeLink={sendPulse?.youTubeLink}
        />
      )}
      {sendPulse?.docLink && (
        <TutorialLink
          title={sendPulse?.title}
          docLink={sendPulse?.docLink}
        />
      )}

      <div className="mt-3 wdt-200"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={sendPulseConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.name}</div>

      <div className="mt-3 wdt-200"><b>{__('Access Client ID:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="client_id" value={sendPulseConf.client_id} type="text" placeholder={__('Access Client ID...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.client_id}</div>

      <div className="mt-3 wdt-250"><b>{__('Access Client Secret Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="client_secret" value={sendPulseConf.client_secret} type="text" placeholder={__('Access Client Secret Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.client_secret}</div>

      <small className="d-blk mt-3">
        {__('To Get Client Id and Client Secret Key, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href="https://login.sendpulse.com/settings/#api" target="_blank" rel="noreferrer">{__('Send Pulse API Token', 'bit-integrations')}</a>
      </small>
      <br />
      <br />
      {isLoading === 'auth' && (
        <div className="flx mt-5">
          <LoaderSm size={25} clr="#022217" className="mr-2" />
          Checking Client Secret Key!!!
        </div>
      )}

      {(showAuthMsg && !isAuthorized && !isLoading) && (
        <div className="flx mt-5" style={{ color: 'red' }}>
          <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
            &times;
          </span>
          Sorry, Client Secret key is invalid
        </div>
      )}
      {!isInfo && (
        <>
          <button onClick={handleAuthorize} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button onClick={() => nextPage(2)} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
            {__('Next', 'bit-integrations')}
            <BackIcn className="ml-1 rev-icn" />
          </button>
        </>
      )}
      <Note note={ActiveInstructions} />
    </div>
  )
}
