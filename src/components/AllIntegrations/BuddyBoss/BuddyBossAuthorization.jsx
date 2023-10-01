import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import TutorialLink from '../../Utilities/TutorialLink'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'

export default function BuddyBossAuthorization({ formID,
  buddyBossConf,
  setBuddyBossConf,
  step,
  setStep,
  isLoading,
  setIsLoading,
  setSnackbar }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const { buddyBoss } = tutorialLinks

  const authorizeHandler = () => {
    setIsLoading('auth')
    bitsFetch({}, 'buddyBoss_authorize').then((result) => {
      if (result?.success) {
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Connected with BuddyBoss Successfully', 'bit-integrations') })
      }
      setIsLoading(false)
      setShowAuthMsg(true)
    })
  }

  const handleInput = (e) => {
    const newConf = deepCopy(buddyBossConf)
    newConf[e.target.name] = e.target.value
    setBuddyBossConf(newConf)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{
        width: step === 1 && 900,
        height: step === 1 && 'auto',
      }}
    >
      {buddyBoss?.youTubeLink && (
        <TutorialLink
          title={buddyBoss?.title}
          youTubeLink={buddyBoss?.youTubeLink}
        />
      )}
      {buddyBoss?.docLink && (
        <TutorialLink
          title={buddyBoss?.title}
          docLink={buddyBoss?.docLink}
        />
      )}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={buddyBossConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
      />

      {isLoading === 'auth' && (
        <div className="flx mt-5">
          <LoaderSm size={25} clr="#022217" className="mr-2" />
          Checking if BuddyBoss is active!!!
        </div>
      )}

      {showAuthMsg && !isAuthorized && !isLoading && (
        <div className="flx mt-5" style={{ color: 'red' }}>
          <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
            &times;
          </span>
          BuddyBoss plugin must be activated to integrate with Bit Integrations.
        </div>
      )}

      {!isAuthorized && (
        <button onClick={authorizeHandler} className="btn btcd-btn-lg green sh-sm flx mt-5" type="button">
          {__('Connect', 'bit-integrations')}
        </button>
      )}

      {isAuthorized && (
        <button onClick={() => setStep(2)} className="btn btcd-btn-lg green sh-sm flx mt-5" type="button" disabled={!isAuthorized}>
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>
      )}
    </div>
  )
}
