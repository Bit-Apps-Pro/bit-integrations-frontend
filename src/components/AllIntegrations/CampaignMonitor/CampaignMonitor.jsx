// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import CampaignMonitorAuthorization from './CampaignMonitorAuthorization'
import { checkMappedFields } from './CampaignMonitorCommonFunc'
import CampaignMonitorIntegLayout from './CampaignMonitorIntegLayout'

function CampaignMonitor({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const subscriberFields = [
    { key: 'Name', label: 'Name', required: false },
    { key: 'EmailAddress', label: 'Email Address', required: true },
  ]

  const [campaignMonitorConf, setCampaignMonitorConf] = useState({
    name: 'CampaignMonitor',
    type: 'CampaignMonitor',
    client_id: process.env.NODE_ENV === 'development' ? 'cfd7b57a6c131b44076ebf4f533c2799' : '',
    api_key: process.env.NODE_ENV === 'development' ? '25SmS5TO21Ot5EXyLT0KbHbjejn0ykGi00q6LpzQh0TWAUal/OqaO59yDWJ9ZloY+NF9WUcOOaJjtxNVAszH85+R0Q8uDBbwKCkCh1pYO/ENPnqmBBzcJINUXplb/vJpj7Ywb3KBAnjscIP50udrnA==' : '',
    field_map: [
      { formField: '', campaignMonitorField: '' },
    ],
    subscriberFields,
    actions: {},
  })

  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(campaignMonitorConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (!campaignMonitorConf?.listId) {
        setSnackbar({ show: true, msg: 'Please select list to continue.' })
        return
      }
      if (campaignMonitorConf.name !== '' && campaignMonitorConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <CampaignMonitorAuthorization
        formID={formID}
        campaignMonitorConf={campaignMonitorConf}
        setCampaignMonitorConf={setCampaignMonitorConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <CampaignMonitorIntegLayout
          formID={formID}
          formFields={formFields}
          campaignMonitorConf={campaignMonitorConf}
          setCampaignMonitorConf={setCampaignMonitorConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!campaignMonitorConf?.listId || campaignMonitorConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, campaignMonitorConf, navigate, '', '', setIsLoading)}
        isLoading={isLoading}
        dataConf={campaignMonitorConf}
        setDataConf={setCampaignMonitorConf}
        formFields={formFields}
      />
    </div>
  )
}

export default CampaignMonitor
