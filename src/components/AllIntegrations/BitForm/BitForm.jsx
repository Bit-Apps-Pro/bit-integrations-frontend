import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import BackIcn from '../../../Icons/BackIcn'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import BitFormAuthorization from './BitFormAuthorization'
import { checkAddressFieldMapRequired, handleInput, checkMappedFields } from './BitFormCommonFunc'
import BitFormIntegLayout from './BitFormIntegLayout'

function BitForm({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const btcbi = useRecoilValue($btcbi)
  const { siteURL } = btcbi
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [bitFormConf, setBitFormConf] = useState({
    name: 'Bit Form',
    type: 'Bit Form',
    domainName: siteURL,
    api_key: process.env.NODE_ENV === 'development' ? '59971a5c6213ecbb4e58bf91b4a56962f05311d8' : '',
    id: '',
    field_map: [
      { formField: '', BitFormMapField: '' },
    ],
    address_field: [],
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (bitFormConf.actions?.address && !checkAddressFieldMapRequired(bitFormConf)) {
      setSnackbar({ show: true, msg: 'Please map address required fields to continue.' })
      return
    }
    if (!checkMappedFields(bitFormConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (bitFormConf.listId !== '') {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <BitFormAuthorization
        formID={formID}
        bitFormConf={bitFormConf}
        setBitFormConf={setBitFormConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <BitFormIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, bitFormConf, setBitFormConf, formID, setIsLoading, setSnackbar)}
          bitFormConf={bitFormConf}
          setBitFormConf={setBitFormConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {!bitFormConf.id && (
          <>
            <br />
            <br />
            <br />
          </>
        )}
        <button
          onClick={() => nextPage(3)}
          disabled={bitFormConf.field_map.length < 2 || isLoading}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: bitFormConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={bitFormConf}
        setDataConf={setBitFormConf}
        formFields={formFields}
      />

    </div>
  )
}

export default BitForm
