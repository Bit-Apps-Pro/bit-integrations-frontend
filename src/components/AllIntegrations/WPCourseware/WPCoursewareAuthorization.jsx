/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import LoaderSm from '../../Loaders/LoaderSm'
import BackIcn from '../../../Icons/BackIcn'

export default function WPCoursewareAuthorization({ formID, wpCoursewareConf, setWPCoursewareConf, step, nextPage, setSnackbar, isInfo }) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ integrationName: '' })
  const [showAuthMsg, setShowAuthMsg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(true)
  useEffect(() => () => {
    setIsMounted(false)
  }, [])

  const handleAuthorize = () => {
    setIsLoading('auth')
    bitsFetch({}, 'wpCourseware_authorize')
      .then(result => {
        if (isMounted) {
          if (result?.success) {
            setisAuthorized(true)
            setSnackbar({ show: true, msg: __('Connect Successfully', 'bit-integrations') })
          }
          setShowAuthMsg(true)
          setIsLoading(false)
        }
      })
  }
  const handleInput = e => {
    const newConf = { ...wpCoursewareConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setWPCoursewareConf(newConf)
  }

  return (
    <>
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
        <div className="mt-3"><b>{__('Integration Name:', 'bit-integrations')}</b></div>
        <input className="btcd-paper-inp w-5 mt-1" onChange={handleInput} name="name" value={wpCoursewareConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} disabled={isInfo} />

        {(showAuthMsg && !isAuthorized && !isLoading) && (
          <div className="flx mt-4" style={{ color: 'red' }}>
            <span className="btcd-icn mr-2" style={{ fontSize: 30, marginTop: -5 }}>
              &times;
            </span>
            Please! First Install or Active WP Courseware Plugin
          </div>
        )}
        {!isInfo && (
          <>
            <button onClick={handleAuthorize} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={isAuthorized || isLoading}>
              {isAuthorized ? __('Connected ✔', 'bit-integrations') : __('Connect to WP Courseware', 'bit-integrations')}
              {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
            </button>
            <br />
            <button onClick={() => nextPage(2)} className="btn f-right btcd-btn-lg green sh-sm flx" type="button" disabled={!isAuthorized}>
              {__('Next', 'bit-integrations')}
              <BackIcn className="ml-1 rev-icn" />
            </button>
          </>
        )}
      </div>
    </>
  )
}
