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
import { checkMappedFields, handleInput } from './NutshellCRMCommonFunc'
import NutshellCRMIntegLayout from './NutshellCRMIntegLayout'

function EditNutshellCRM({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [nutshellCRMConf, setNutshellCRMConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(nutshellCRMConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (nutshellCRMConf.actionName === 'customer' && !nutshellCRMConf.selectedCustomerType) {
      toast.error('Please select Customer Type')
      return
    }
    if (nutshellCRMConf.actionName === 'lead' && !nutshellCRMConf.selectedLeadStatus) {
      toast.error('Please select Lead Status')
      return
    }

    saveActionConf({ flow, allIntegURL, conf: nutshellCRMConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, nutshellCRMConf, setNutshellCRMConf)} name="name" value={nutshellCRMConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}
      <NutshellCRMIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, nutshellCRMConf, setNutshellCRMConf, setLoading, setSnackbar)}
        nutshellCRMConf={nutshellCRMConf}
        setNutshellCRMConf={setNutshellCRMConf}
        loading={loading}
        setLoading={setLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(nutshellCRMConf)}
        isLoading={isLoading}
        dataConf={nutshellCRMConf}
        setDataConf={setNutshellCRMConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditNutshellCRM
