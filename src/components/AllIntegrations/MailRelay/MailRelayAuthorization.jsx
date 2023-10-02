/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import { mailRelayAuthentication } from './MailRelayCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function MailRelayAuthorization({ mailRelayConf, setMailRelayConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', auth_token: '' })
  const { mailRelay } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !mailRelayConf?.default
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...mailRelayConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setMailRelayConf(newConf)
  }

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {mailRelay?.youTubeLink && (
        <TutorialLink
          title={mailRelay?.title}
          youTubeLink={mailRelay?.youTubeLink}
        />
      )}
      {mailRelay?.docLink && (
        <TutorialLink
          title={mailRelay?.title}
          docLink={mailRelay?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={mailRelayConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('Your Domain Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="domain" value={mailRelayConf.domain} type="text" placeholder={__('Your Account', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.domain}</div>
      <small className="d-blk mt-3">
        {__('Example: bitapps.ipzmarketing.com', 'bit-integrations')}
      </small>
      <div className="mt-3"><b>{__('API Token:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="auth_token" value={mailRelayConf.auth_token} type="text" placeholder={__('API Token...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.auth_token}</div>
      {mailRelayConf.domain && (
        <small className="d-blk mt-3">
          {__('To Get API token, Please Visit', 'bit-integrations')}
          &nbsp;
          <a className="btcd-link" href={`https://${mailRelayConf.domain}.ipzmarketing.com/admin/api_keys`} target="_blank" rel="noreferrer">{__('MailRelay API Token', 'bit-integrations')}</a>
        </small>
      )}
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => mailRelayAuthentication(mailRelayConf, setMailRelayConf, setError, setIsAuthorized, loading, setLoading, 'authentication')} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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
    </div>
  )
}
