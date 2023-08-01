/* eslint-disable no-param-reassign */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import EditWebhookInteg from '../EditWebhookInteg'
import { checkWebhookIntegrationsExist, saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, isDisabled } from './SendFoxCommonFunc'
import SendFoxIntegLayout from './SendFoxIntegLayout'

function EditSendFox({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [sendFoxConf, setSendFoxConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, sendFoxConf, setSendFoxConf)} name="name" value={sendFoxConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      <br />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}

      <SendFoxIntegLayout
        formFields={formFields}
        handleInput={(e) => handleInput(e, sendFoxConf, setSendFoxConf, setIsLoading, setSnackbar, formID)}
        sendFoxConf={sendFoxConf}
        setSendFoxConf={setSendFoxConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, allIntegURL, conf: sendFoxConf, navigate, edit: 1, setIsLoading, setSnackbar })}
        disabled={isDisabled(sendFoxConf)}
        isLoading={isLoading}
        dataConf={sendFoxConf}
        setDataConf={setSendFoxConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditSendFox
