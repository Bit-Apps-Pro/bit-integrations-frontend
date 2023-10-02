/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { mailBlusterAuthentication } from './MailBlusterCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function MailBlusterAuthorization({ mailBlusterConf, setMailBlusterConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', auth_token: '' })
  const { mailBluster } = tutorialLinks

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !mailBlusterConf?.default
    setStep(2)
  }

  const handleInput = e => {
    const newConf = { ...mailBlusterConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setMailBlusterConf(newConf)
  }

  const note = `
    <h4> Step of generate API token:</h4>
    <ul>
      <li>Goto <a target="_blank" href="https://app.mailbluster.com/vM7N8vG0Pp/settings/api-keys">Generate API Token</a></li>
      <li>Copy the <b>Token</b> and paste into <b>API Token</b> field of your authorization form.</li>
      <li>Finally, click <b>Authorize</b> button.</li>
  </ul>
  `

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {mailBluster?.youTubeLink && (
        <TutorialLink
          title={mailBluster?.title}
          youTubeLink={mailBluster?.youTubeLink}
        />
      )}
      {mailBluster?.docLink && (
        <TutorialLink
          title={mailBluster?.title}
          docLink={mailBluster?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={mailBlusterConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('API Token:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="auth_token" value={mailBlusterConf.auth_token} type="text" placeholder={__('API Token...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.auth_token}</div>

      <small className="d-blk mt-3">
        {__('To Get API token, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href="https://app.mailbluster.com/vM7N8vG0Pp/settings/api-keys" target="_blank" rel="noreferrer">{__('MailBluster API Token', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => mailBlusterAuthentication(mailBlusterConf, setMailBlusterConf, setError, setIsAuthorized, loading, setLoading, 'authentication')} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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
      <Note note={note} />
    </div>
  )
}
