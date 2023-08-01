/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import WebHooksIntegration from '../IntegrationHelpers/WebHook/WebHooksIntegration'
import WebHooksStepTwo from '../IntegrationHelpers/WebHook/WebHooksStepTwo'

function EditPabbly({ allIntegURL }) {
  const { formID } = useParams()
  const [snack, setSnackbar] = useState({ show: false })

  const [isLoading, setIsLoading] = useState(false)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)

  const [pabbly, setPabbly] = useRecoilState($actionConf)

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      {flow.triggered_entity !== 'Webhook' ? (
        <EditFormInteg
          setSnackbar={setSnackbar}
        />
      ) : (
        <EditWebhookInteg
          setSnackbar={setSnackbar}
        />
      )}

      <div className="mt-3">
        <WebHooksIntegration
          formID={formID}
          formFields={formFields}
          webHooks={pabbly}
          setWebHooks={setPabbly}
          setSnackbar={setSnackbar}
        />
      </div>

      <WebHooksStepTwo
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: pabbly, edit: 1, setIsLoading, setSnackbar })}
        isLoading={isLoading}
      />
      <br />
    </div>
  )
}

export default EditPabbly
