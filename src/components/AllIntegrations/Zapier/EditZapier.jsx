/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import EditWebhookInteg from '../EditWebhookInteg'
import { checkWebhookIntegrationsExist, saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksLayouts from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'

function EditZapier({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)

  const [zapier, setZapier] = useRecoilState($actionConf)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}
      <div className="mt-3">
        <WebHooksLayouts
          formID={formID}
          formFields={formFields}
          webHooks={zapier}
          setWebHooks={setZapier}
          setSnackbar={setSnackbar}
        />
      </div>

      <WebHooksStepTwo
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: zapier, navigate, edit: 1, setIsLoading, setSnackbar })}
        isLoading={isLoading}
      />
      <br />
    </div>
  )
}

export default EditZapier
