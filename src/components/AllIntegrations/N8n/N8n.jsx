// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksIntegration from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function N8n({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const { n8nLinks } = tutorialLinks
  const [n8n, setN8n] = useState({
    name: 'N8n Web Hooks',
    type: 'N8n',
    method: 'POST',
    url: process.env.NODE_ENV === 'development' ? 'https://connect.n8n.com/workflow/sendwebhookdata/IjIyMjIxNiI_3D' : '',
    apiConsole: 'https://connect.n8n.com/dashboard',
  })

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={2} active={step} /></div>

      {/* STEP 1 */}
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 1100 }, ...{ height: step === 1 && 'auto' } }}>
        {n8nLinks?.youTubeLink && (
          <TutorialLink
            title={n8nLinks?.title}
            youTubeLink={n8nLinks?.youTubeLink}
          />
        )}
        {n8nLinks?.docLink && (
          <TutorialLink
            title={n8nLinks?.title}
            docLink={n8nLinks?.docLink}
          />
        )}

        <WebHooksIntegration
          formID={formID}
          formFields={formFields}
          webHooks={n8n}
          setWebHooks={setN8n}
          step={step}
          setStep={setStep}
          setSnackbar={setSnackbar}
          create
        />
      </div>

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && `${100}%`, height: step === 2 && 'auto' }}>

        <WebHooksStepTwo
          step={step}
          saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, n8n, navigate, '', '', setIsLoading)}
          isLoading={isLoading}
        />

      </div>
    </div>
  )
}

export default N8n
