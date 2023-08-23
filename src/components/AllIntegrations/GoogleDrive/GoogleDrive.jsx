/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { setGrantTokenResponse } from '../IntegrationHelpers/GoogleIntegrationHelpers'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import GoogleDriveAuthorization from './GoogleDriveAuthorization'
import GoogleDriveIntegLayout from './GoogleDriveIntegLayout'

function GoogleDrive({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { flowID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [googleDriveConf, setGoogleDriveConf] = useState({
    name: 'Google Drive',
    type: 'Google Drive',
    clientId: process.env.NODE_ENV === 'development' ? '169745940494-ambvaatv48bcnoebo0cqqg6u4427mbcf.apps.googleusercontent.com' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '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' : '',
    field_map: [{ formField: '', googleDriveFormField: '' }],
    foldersList: [],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('googleDrive')
  }, [])

  const saveConfig = () => {
    saveActionConf({ flow, setFlow, allIntegURL, conf: googleDriveConf, navigate, setIsLoading, setSnackbar })
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <GoogleDriveAuthorization
        flowID={flowID}
        googleDriveConf={googleDriveConf}
        setGoogleDriveConf={setGoogleDriveConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: 'auto',
            overflow: 'visible',
          }),
        }}
      >
        <GoogleDriveIntegLayout
          flowID={flowID}
          formFields={formFields}
          googleDriveConf={googleDriveConf}
          setGoogleDriveConf={setGoogleDriveConf}
        />

        <button
          onClick={() => setStep(3)}
          disabled={googleDriveConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
      />
    </div>
  )
}

export default GoogleDrive
