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
import ConvertKitAuthorization from './ConvertKitAuthorization'
import { checkMappedFields } from './ConvertKitCommonFunc'
import ConvertKitIntegLayout from './ConvertKitIntegLayout'

function ConvertKit({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [convertKitConf, setConvertKitConf] = useState({
    name: 'ConvertKit',
    type: 'ConvertKit',
    api_secret: process.env.NODE_ENV === 'development' ? 'm4iHyMa_gu65b16dJMnYJJzOlSFpj3wl1pB3k_IvOhc' : '',
    field_map: [
      { formField: '', convertKitField: '' },
    ],
    actions: {},
  })

  const nextPage = (val) => {
    // setIsLoading(true)
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(convertKitConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (!convertKitConf?.formId) {
        setSnackbar({ show: true, msg: 'Please select form to continue.' })
        return
      }
      if (convertKitConf.name !== '' && convertKitConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ConvertKitAuthorization
        formID={formID}
        convertKitConf={convertKitConf}
        setConvertKitConf={setConvertKitConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <ConvertKitIntegLayout
          formID={formID}
          formFields={formFields}
          convertKitConf={convertKitConf}
          setConvertKitConf={setConvertKitConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!convertKitConf?.formId || convertKitConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, convertKitConf, navigate, '', '', setIsLoading)}
        isLoading={isLoading}
        dataConf={convertKitConf}
        setDataConf={setConvertKitConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ConvertKit
