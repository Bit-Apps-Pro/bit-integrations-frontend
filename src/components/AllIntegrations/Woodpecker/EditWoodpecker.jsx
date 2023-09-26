/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import EditWebhookInteg from '../EditWebhookInteg'
import { checkWebhookIntegrationsExist, saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './WoodpeckerCommonFunc'
import WoodpeckerIntegLayout from './WoodpeckerIntegLayout'

function EditWoodpecker({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [woodpeckerConf, setWoodpeckerConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(woodpeckerConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (woodpeckerConf.actionName === 'opportunities') {
      if (!woodpeckerConf.selectedAccount) {
        toast.error('Please select an Account')
        return
      }
      if (!woodpeckerConf.selectedPipeline) {
        toast.error('Please select a Pipeline')
        return
      }
      if (woodpeckerConf.selectedPipeline && !woodpeckerConf.selectedStage) {
        toast.error('Please select a Stage')
        return
      }
    }

    saveActionConf({ flow, allIntegURL, conf: woodpeckerConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, woodpeckerConf, setWoodpeckerConf)} name="name" value={woodpeckerConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}
      <WoodpeckerIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, woodpeckerConf, setWoodpeckerConf, setLoading, setSnackbar)}
        woodpeckerConf={woodpeckerConf}
        setWoodpeckerConf={setWoodpeckerConf}
        loading={loading}
        setLoading={setLoading}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(woodpeckerConf)}
        isLoading={isLoading}
        dataConf={woodpeckerConf}
        setDataConf={setWoodpeckerConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditWoodpecker
