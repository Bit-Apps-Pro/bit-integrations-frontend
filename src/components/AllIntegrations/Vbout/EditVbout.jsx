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
import { checkMappedFields, handleInput } from './VboutCommonFunc'
import VboutIntegLayout from './VboutIntegLayout'

function EditVbout({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [vboutConf, setVboutConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    list: false,
    field: false,
    auth: false,
  })

  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(vboutConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveActionConf({ flow, allIntegURL, conf: vboutConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, vboutConf, setVboutConf)} name="name" value={vboutConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}
      <VboutIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, vboutConf, setVboutConf, setIsLoading, setSnackbar)}
        vboutConf={vboutConf}
        setVboutConf={setVboutConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={vboutConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={vboutConf}
        setDataConf={setVboutConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditVbout
