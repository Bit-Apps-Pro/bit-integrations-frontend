// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import EnchargeAutorization from './EnchargeAuthorization'
import { checkMappedFields } from './EnchargeCommonFunc'
import EnchargeIntegLayout from './EnchargeIntegLayout'

function Encharge({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [enchargeConf, setEnchargeConf] = useState({
    name: 'Encharge',
    type: 'Encharge',
    tags: '',
    api_key: process.env.NODE_ENV === 'development' ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjE1MjkyLCJuYW1lIjoiYmFzZSJ9.yZ0PHY7bfPvYP-laE2ES92kt-lwmvJajKk_U9FCm-Bs' : '',
    field_map: [
      { formField: '', enChargeFields: '' },
    ],
    actions: {},
  })
  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(enchargeConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (enchargeConf.name !== '' && enchargeConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <EnchargeAutorization
        formID={formID}
        enchargeConf={enchargeConf}
        setEnchargeConf={setEnchargeConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, minHeight: step === 2 && '200', height: step === 2 && 'auto' }}>
        <EnchargeIntegLayout
          formID={formID}
          formFields={formFields}
          enchargeConf={enchargeConf}
          setEnchargeConf={setEnchargeConf}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={enchargeConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          &nbsp;
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, enchargeConf, navigate, '', '', setIsLoading)}
        isLoading={isLoading}
        dataConf={enchargeConf}
        setDataConf={setEnchargeConf}
        formFields={formFields}
      />
    </div>
  )
}
export default Encharge
