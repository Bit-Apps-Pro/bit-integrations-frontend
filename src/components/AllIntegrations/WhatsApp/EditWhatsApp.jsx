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
import { handleInput } from './WhatsAppCommonFunc'
import WhatsAppIntegLayout from './WhatsAppIntegLayout'

function EditWhatsApp({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [whatsAppConf, setWhatsAppConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const disabledButton = whatsAppConf.messageTypeId === '1' ? whatsAppConf.body === '' : whatsAppConf.templateName === ''

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, whatsAppConf, setWhatsAppConf)} name="name" value={whatsAppConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      <br />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}
      <WhatsAppIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, whatsAppConf, setWhatsAppConf, setIsLoading, setSnackbar)}
        whatsAppConf={whatsAppConf}
        setWhatsAppConf={setWhatsAppConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, allIntegURL, conf: whatsAppConf, navigate, edit: 1, setIsLoading, setSnackbar })}
        disabled={disabledButton || isLoading}
        isLoading={isLoading}
        dataConf={whatsAppConf}
        setDataConf={setWhatsAppConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditWhatsApp
