import { useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import { deepCopy } from '../../../Utils/Helpers'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'

export default function AcademyLmsAuthorization({ academyLmsConf, setAcademyLmsConf, step, setStep, setSnackbar }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthMsg, setShowAuthMsg] = useState(false)

  const authorizeHandler = () => {
    setIsLoading('auth')
    bitsFetch({}, 'academy_lms_authorize')
      .then(result => {
        if (result?.success) {
          setisAuthorized(true)
          setSnackbar({ show: true, msg: __('Connected with Academy Lms Successfully', 'bit-integrations') })
        }
        setIsLoading(false)
        setShowAuthMsg(true)
      })
  }

  const handleInput = e => {
    const newConf = deepCopy(academyLmsConf)
    newConf[e.target.name] = e.target.value
    setAcademyLmsConf(newConf)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{
        width: step === 1 && 900,
        height: step === 1 && 'auto',
      }}
    >
      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input className="btcd-paper-inp w-6 mt-1" onChange={handleInput} name="name" value={academyLmsConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />

      {isLoading === 'auth' && (
        <div className="flx mt-5">
          <LoaderSm size={25} clr="#022217" className="mr-2" />
          Checking if Academy Lms is active!!!
        </div>
      )}

      {(showAuthMsg && !isAuthorized && !isLoading) && (
        <div className="flx mt-5" style={{ color: 'red' }}>
          <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
            &times;
          </span>
          Academy Lms plugin must be activated to integrate with Bit Integrations.
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
