/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkWebhookIntegrationsExist, saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import { handleInput } from './ConvertKitCommonFunc'
import ConvertKitIntegLayout from './ConvertKitIntegLayout'
import EditFormInteg from '../EditFormInteg'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import EditWebhookInteg from '../EditWebhookInteg'

function EditConvertKit({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [convertKitConf, setConvertKitConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, convertKitConf, setConvertKitConf)} name="name" value={convertKitConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}
      <ConvertKitIntegLayout
        formID={formID}
        formFields={formFields}
        convertKitConf={convertKitConf}
        setConvertKitConf={setConvertKitConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: convertKitConf, edit: 1, setIsLoading, setSnackbar })}
        disabled={convertKitConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={convertKitConf}
        setDataConf={setConvertKitConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditConvertKit
