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
import OneDriveAuthorization from './OneDriveAuthorization'
// import { handleInput } from './OneDriveCommonFunc'
import OneDriveIntegLayout from './OneDriveIntegLayout'

function OneDrive({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { flowID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [oneDriveConf, setOneDriveConf] = useState({
    name: 'OneDrive',
    type: 'OneDrive',
    clientId: process.env.NODE_ENV === 'development' ? '91e6cdfd-fe9b-44c7-ab6d-5ee077accc7a' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? 'VaP7Q~ATIStGXRn1oOQrAz1tKv-fMUM2g7Ku7' : '',
    field_map: [{ formField: '', OneDriveFormField: '' }],
    folder: '',
    folderMap: [],
    foldersList: [],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('oneDrive')
  }, [])

  const saveConfig = () => {
    saveActionConf({ flow, setFlow, allIntegURL, conf: oneDriveConf, navigate, setIsLoading, setSnackbar })
  }

  setTimeout(() => {
    document.getElementById('btcd-settings-wrp').scrollTop = 0
  }, 300)

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <OneDriveAuthorization
        flowID={flowID}
        oneDriveConf={oneDriveConf}
        setOneDriveConf={setOneDriveConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

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
        <OneDriveIntegLayout
          flowID={flowID}
          formFields={formFields}
          oneDriveConf={oneDriveConf}
          setOneDriveConf={setOneDriveConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => setStep(3)}
          disabled={!oneDriveConf.actions.attachments || !oneDriveConf.folder}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
      />
    </div>
  )
}

export default OneDrive
