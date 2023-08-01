import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './GamiPressCommonFunc'
import GamiPressIntegLayout from './GamiPressIntegLayout'
import { $btcbi } from '../../../GlobalStates'
import GamiPressAuthorization from './GamiPressAuthorization'

function GamiPress({ formFields, setFlow, flow, allIntegURL, isInfo, edit }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const btcbi = useRecoilValue($btcbi)
  const { siteURL } = btcbi

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Award rank to the user' },
    { key: '2', label: 'Award an achievement to the user' },
    { key: '3', label: 'Award a points to the user' },
    { key: '4', label: 'Revoke a rank form the user' },
    { key: '5', label: 'Revoke an achievement form the user' },
    { key: '6', label: 'Revoke points from the user' },
  ]

  const pointFields = [
    { key: 'point', label: 'Point', required: true },
  ]

  const [gamiPressConf, setGamiPressConf] = useState({
    name: 'GamiPress',
    type: 'GamiPress',
    mainAction: '',
    field_map: [
      { formField: '', gamiPressFormField: '' },
    ],
    pointFields,
    allActions,
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    // if (['3', '6'].includes(gamiPressConf.mainAction) && checkMappedFields(gamiPressConf)) {
    //   setSnackbar({ show: true, msg: 'Please map fields to continue.' })
    //   return
    // }
    if (gamiPressConf.mainAction !== '') {
      setStep(3)
    }
  }

  function isDisabled() {
    switch (gamiPressConf.mainAction) {
      case '1':
        return gamiPressConf.selectedRank === undefined || gamiPressConf.selectedRank === ''
      case '2':
        return gamiPressConf.selectedAchievement === undefined || gamiPressConf.selectedAchievement === ''
      case '3':
        return gamiPressConf.selectedPointType === undefined || gamiPressConf.selectedPointType === ''
      case '4':
        return gamiPressConf.selectedRank === undefined || gamiPressConf.selectedRank === ''
      case '5':
        return gamiPressConf.selectedAchievement === undefined || gamiPressConf.selectedAchievement === ''
      case '6':
        return gamiPressConf.selectedPointType === undefined || gamiPressConf.selectedPointType === ''
      default:
        return false
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <GamiPressAuthorization
        formID={formID}
        gamiPressConf={gamiPressConf}
        setGamiPressConf={setGamiPressConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <GamiPressIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, gamiPressConf, setGamiPressConf, setIsLoading, setSnackbar, formID)}
          gamiPressConf={gamiPressConf}
          setGamiPressConf={setGamiPressConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          allIntegURL={allIntegURL}
          isInfo={isInfo}
          edit={edit}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!gamiPressConf.mainAction || isLoading || isDisabled()}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: gamiPressConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={gamiPressConf}
        setDataConf={setGamiPressConf}
        formFields={formFields}
      />

    </div>
  )
}

export default GamiPress
