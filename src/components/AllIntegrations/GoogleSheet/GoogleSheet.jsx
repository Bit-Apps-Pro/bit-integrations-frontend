import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { setGrantTokenResponse } from '../IntegrationHelpers/GoogleIntegrationHelpers'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import GoogleSheetAuthorization from './GoogleSheetAuthorization'
import { handleInput, checkMappedFields } from './GoogleSheetCommonFunc'
import GoogleSheetIntegLayout from './GoogleSheetIntegLayout'

function GoogleSheet({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [sheetConf, setSheetConf] = useState({
    name: 'Google Sheet',
    type: 'Google Sheet',
    clientId: process.env.NODE_ENV === 'development' ? '169745940494-ambvaatv48bcnoebo0cqqg6u4427mbcf.apps.googleusercontent.com' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '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' : '',
    spreadsheetId: '',
    worksheetName: '',
    field_map: [
      { formField: '', googleSheetField: '' },
    ],
    header: 'ROWS',
    headerRow: 'A1',
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('googleSheet')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(sheetConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (sheetConf.spreadsheetId !== '' && sheetConf.worksheetName !== '' && sheetConf.field_map.length > 0) {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <GoogleSheetAuthorization
        formID={formID}
        sheetConf={sheetConf}
        setSheetConf={setSheetConf}
        step={step}
        setstep={setstep}
        setSnackbar={setSnackbar}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <GoogleSheetIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, sheetConf, setSheetConf, formID, setIsLoading, setSnackbar)}
          sheetConf={sheetConf}
          setSheetConf={setSheetConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!sheetConf.spreadsheetId || !sheetConf.worksheetName || sheetConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: sheetConf, navigate, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={sheetConf}
        setDataConf={setSheetConf}
        formFields={formFields}
      />
    </div>
  )
}

export default GoogleSheet
