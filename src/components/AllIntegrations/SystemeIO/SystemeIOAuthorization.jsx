/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import Note from '../../Utilities/Note'
import { systemeIOAuthentication, getAllTags } from './SystemeIOCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

export default function SystemeIOAuthorization({ systemeIOConf, setSystemeIOConf, step, setStep, loading, setLoading, isInfo }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const { systemeIO } = tutorialLinks
  const [error, setError] = useState({ api_key: '' })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    !systemeIOConf?.default
    setStep(2)
    getAllTags(systemeIOConf, setSystemeIOConf, setLoading)
  }

  const handleInput = e => {
    const newConf = { ...systemeIOConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setSystemeIOConf(newConf)
  }

  const ActiveInstructions = `
            <h4>To Get API Key & API Secret</h4>
            <ul>
                <li>First go to your SystemeIO dashboard.</li>
                <li>Click go to "Settings" from Right Top corner</li>
                <li>Then Click "Public API Keys" from the "Settings Menu"</li>
                <li>Then Click "Create Api key"</li>
                <li>Then copy "API Token"</li>
            </ul>`

  return (
    <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {systemeIO?.youTubeLink && (
        <TutorialLink
          title={systemeIO?.title}
          youTubeLink={systemeIO?.youTubeLink}
        />
      )}
      {systemeIO?.docLink && (
        <TutorialLink
          title={systemeIO?.title}
          docLink={systemeIO?.docLink}
        />
      )}

      <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={systemeIOConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

      <div className="mt-3"><b>{__('API Key:', 'bit-integrations')}</b></div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="api_key" value={systemeIOConf.api_key} type="text" placeholder={__('API Key...', 'bit-integrations')} disabled={isInfo} />
      <div style={{ color: 'red', fontSize: '15px' }}>{error.api_key}</div>

      <small className="d-blk mt-3">
        {__('To Get API Key & API Secret, Please Visit', 'bit-integrations')}
        &nbsp;
        <a className="btcd-link" href='https://systeme.io/dashboard/profile/public-api-settings' target='_blank'>{__('SystemeIO API Key & Secret', 'bit-integrations')}</a>
      </small>
      <br />
      <br />

      {!isInfo && (
        <div>
          <button onClick={() => systemeIOAuthentication(systemeIOConf, setSystemeIOConf, setError, setIsAuthorized, loading, setLoading)} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || loading.auth}>
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

